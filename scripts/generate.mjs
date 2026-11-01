#!/usr/bin/env node
// Uses the application's actual store, CPM scheduler, IFC writer and IFC reader.
// Keep upstream source/dependencies outside this repository. No third-party code is vendored.
import { readFileSync, mkdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv.indexOf('--planner-source');
if (arg < 0 || !process.argv[arg + 1]) throw new Error('Usage: node scripts/generate.mjs --planner-source /path/to/open-planner-studio');
const upstream = resolve(process.argv[arg + 1]);
const baselineArg = process.argv.indexOf('--preserve-baseline-from');
if (baselineArg >= 0 && !process.argv[baselineArg + 1]) throw new Error('--preserve-baseline-from requires an IFC path');
const baselineSource = baselineArg >= 0 ? resolve(process.argv[baselineArg + 1]) : null;
const plan = JSON.parse(readFileSync(join(root, 'carport-hw.plan.json'), 'utf8'));
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: upstream, encoding: 'utf8' }).trim();
if (sha !== plan.plannerCommit) throw new Error(`Planner source must be pinned to ${plan.plannerCommit}; got ${sha}`);
const { default: esbuild } = await import(pathToFileURL(join(upstream, 'node_modules/esbuild/lib/main.js')));
const { headlessStubPlugin } = await import(pathToFileURL(join(upstream, 'scripts/lib/headless-bundle.mjs')));
const temp = mkdtempSync(join(tmpdir(), 'carport-pm-generate-'));
try {
  const entry = join(temp, 'entry.ts');
  writeFileSync(entry, `
import { createAppStoreContext } from '@/state/appStoreFactory';
import { createDefaultTaskTime } from '@/utils/taskDefaults';
import { writeIFC } from '@/services/ifc/ifcWriter';
import { readIFC, assertIfcIntegrity } from '@/services/ifc/ifcReader';
import { buildWriteIFCInput } from '@/state/ifcSaveInput';
export { readIFC, writeIFC, assertIfcIntegrity };
export function build(plan, previous) {
  const ctx = createAppStoreContext({ emitHostEvents: false });
  const S = () => ctx.store.getState();
  S().newProject();
  S().setCalendar({ ...plan.calendars.engineering, id: S().calendar.id });
  S().setProject({ name: plan.name, description: plan.description, startDate: plan.startDate,
    author: 'Carport', company: 'Carport', ifcSchema: 'IFC4X3_ADD2',
    defaultTaskDurationUnit: 'days', defaultWorkRule: 'FIXED_DURATION_RATE' });
  const calendars = {};
  for (const [key, value] of Object.entries(plan.calendars)) {
    calendars[key] = key === 'engineering' ? S().calendar.id : S().addCalendar(value);
  }
  const fields = {};
  for (const name of ['Plan ID', 'Accountable role', 'Exit evidence', 'Estimate range', 'Evidence / source', 'Dependency type'])
    fields[name] = S().addCustomField(name, 'text');
  const ids = {};
  for (const t of plan.tasks) {
    const isSummary = plan.tasks.some(child => child.parent === t.id);
    const time = createDefaultTaskTime(plan.startDate, t.milestone || isSummary ? 0 : t.days);
    ids[t.id] = S().addTask({
      name: t.name, parentId: t.parent ? ids[t.parent] : null,
      isMilestone: !!t.milestone, milestoneKind: t.id === 'START' ? 'START' : t.milestone ? 'FINISH' : undefined,
      taskType: 'USERDEFINED', time,
      description: t.description || t.acceptance || '', calendarId: calendars[t.calendar || 'engineering'],
      notes: t.acceptance ? [{ id: t.id + '-exit', text: 'Exit: ' + t.acceptance, done: false }] : [],
    });
    for (const [name, value] of Object.entries({
      'Plan ID': t.id, 'Accountable role': t.owner || 'Program lead', 'Exit evidence': t.acceptance || '',
      'Estimate range': t.range || '', 'Evidence / source': (t.sources || []).join('; '),
      'Dependency type': t.external ? 'Software delivery gate; backlog managed separately' : 'Hardware program',
    })) if (value) S().setTaskCustomField(ids[t.id], fields[name], value);
  }
  for (const t of plan.tasks) for (const pred of t.after || []) {
    if (!ids[pred]) throw new Error('Missing predecessor ' + pred);
    if (!S().addSequence({ predecessorId: ids[pred], successorId: ids[t.id], type: 'FINISH_START', lagDays: 0 }))
      throw new Error('Rejected dependency ' + pred + ' -> ' + t.id);
  }
  S().runCPM();
  if (!S().cpmResult || S().cpmResult.error) throw new Error(JSON.stringify(S().cpmResult));
  if (previous) {
    const field = previous.customFieldDefs?.find(f => f.name === 'Plan ID');
    if (!field) throw new Error('Baseline source has no Plan ID field');
    const oldKeys = new Map(previous.tasks.map(t => [t.id, t.customFields?.[field.id]]));
    const baselines = (previous.baselines || []).map(b => ({ ...b, tasks: b.tasks.map(t => {
      const key = oldKeys.get(t.taskId);
      if (!key || !ids[key]) throw new Error('Cannot map baseline task ' + t.taskId + ' to a retained Plan ID');
      return { ...t, taskId: ids[key] };
    }) }));
    ctx.store.setState({ baselines, activeBaselineId: previous.activeBaselineId || null,
      comparedBaselineIds: previous.comparedBaselineIds || [null, null] });
  } else {
    // A proposal baseline captures estimates; no progress or actual dates are invented.
    S().saveBaseline('Initial proposal - 2026-10-31 - unapproved estimates');
  }
  const input = buildWriteIFCInput(S());
  return { input, ifc: writeIFC(input), result: S().cpmResult, taskIds: ids };
}
`);
  const bundle = join(temp, 'bundle.mjs');
  await esbuild.build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', outfile: bundle,
    alias: { '@': join(upstream, 'src') }, plugins: [headlessStubPlugin(upstream, 'carport-pm generator')],
    define: { 'import.meta.env.DEV': 'false', 'import.meta.env.PROD': 'true', 'import.meta.env.MODE': '"production"', '__OPS_DEV_INSTANCE__': '"carport-pm"' },
    logLevel: 'warning' });
  const api = await import(pathToFileURL(bundle));
  validatePlan(plan);
  const previous = baselineSource ? api.readIFC(readFileSync(baselineSource, 'utf8')) : null;
  const built = api.build(plan, previous);
  api.assertIfcIntegrity(built.ifc);
  const parsed = api.readIFC(built.ifc);
  if (previous) {
    const baselineDigest = p => {
      const field = p.customFieldDefs?.find(f => f.name === 'Plan ID');
      const keys = new Map(p.tasks.map(t => [t.id, t.customFields?.[field?.id]]));
      return JSON.stringify((p.baselines || []).map(b => ({ name: b.name, createdAt: b.createdAt,
        projectEnd: b.projectEnd, projectDuration: b.projectDuration,
        tasks: b.tasks.map(t => ({ ...t, taskId: keys.get(t.taskId) })).sort((a,b) => a.taskId.localeCompare(b.taskId)) })));
    };
    if (baselineDigest(previous) !== baselineDigest(parsed)) throw new Error('Existing baseline dates or metadata changed');
  }
  const second = api.readIFC(api.writeIFC(parsed));
  const digest = p => JSON.stringify({
    project: { name: p.project.name, startDate: p.project.startDate, schema: p.project.ifcSchema },
    tasks: p.tasks.map(t => ({ name: t.name, parentId: t.parentId, wbs: t.wbsCode, milestone: t.isMilestone,
      duration: t.time.scheduleDuration, start: t.time.earlyStart, finish: t.time.earlyFinish,
      notes: t.notes, fields: t.customFields, calendar: t.calendarId })).sort((a,b) => a.wbs.localeCompare(b.wbs)),
    sequences: p.sequences, calendar: p.calendar, calendars: p.resourceCalendars,
    baselines: p.baselines, fields: p.customFieldDefs,
  });
  if (digest(parsed) !== digest(second)) {
    mkdirSync(join(root, 'reports'), { recursive: true });
    writeFileSync(join(root, 'reports/roundtrip-first.json'), JSON.stringify(parsed, null, 2));
    writeFileSync(join(root, 'reports/roundtrip-second.json'), JSON.stringify(second, null, 2));
    throw new Error('IFC round-trip changed planning data; diagnostic files in reports/roundtrip-*.json');
  }
  if (parsed.tasks.length !== plan.tasks.length) throw new Error('Task count mismatch');
  if (parsed.sequences.length !== plan.tasks.reduce((n,t) => n + (t.after || []).length, 0)) throw new Error('Dependency count mismatch');
  // Open the exported file through the same document-open + F5 path as the actual application.
  const verifyEntry = join(temp, 'verify.ts');
  writeFileSync(verifyEntry, `export { openIfc } from '@/core/index';`);
  const verifyBundle = join(temp, 'verify.mjs');
  await esbuild.build({ entryPoints: [verifyEntry], bundle: true, platform: 'node', format: 'esm', outfile: verifyBundle,
    alias: { '@': join(upstream, 'src') }, plugins: [headlessStubPlugin(upstream, 'carport-pm verification')],
    define: { 'import.meta.env.DEV': 'false', 'import.meta.env.PROD': 'true', 'import.meta.env.MODE': '"production"', '__OPS_DEV_INSTANCE__': '"carport-pm"' }, logLevel: 'warning' });
  const { openIfc } = await import(pathToFileURL(verifyBundle));
  const doc = await openIfc(built.ifc);
  const summary = doc.schedule();
  if (summary.warnings.length) throw new Error('Scheduler warnings: ' + JSON.stringify(summary.warnings));
  const originalDates = new Map(parsed.tasks.map(t => [t.name, [t.time.earlyStart, t.time.earlyFinish]]));
  // Day-measure tasks may gain explicit shift boundary times when opened; compare civil dates.
  for (const t of summary.tasks) if (JSON.stringify(originalDates.get(t.name).map(d => d.slice(0,10))) !== JSON.stringify([t.start,t.finish].map(d => d.slice(0,10))))
    throw new Error('App recalculation changed dates for ' + t.name + ': ' + JSON.stringify(originalDates.get(t.name)) + ' -> ' + JSON.stringify([t.start,t.finish]));
  mkdirSync(join(root, 'reports'), { recursive: true });
  writeFileSync(join(root, 'carport-hw.ifc'), built.ifc);
  const sourceByInternalId = new Map(plan.tasks.map(t => [built.taskIds[t.id], t]));
  const rows = built.input.tasks.map(t => {
    const source = sourceByInternalId.get(t.id);
    if (!source) throw new Error('Unknown exported task ' + t.id);
    return { id: source.id, wbs: t.wbsCode, name: t.name, days: t.time.scheduleDuration, start: t.time.earlyStart,
      finish: t.time.earlyFinish, critical: t.time.isCritical, float: t.time.totalFloat, owner: source?.owner || '',
      after: (source?.after || []).join(' '), exitEvidence: source?.acceptance || '' };
  });
  const columns = Object.keys(rows[0]);
  const csvCell = v => '"' + String(v ?? '').replaceAll('"', '""') + '"';
  writeFileSync(join(root, 'reports/carport-hw.schedule.csv'), [columns, ...rows.map(r => columns.map(c => r[c]))].map(row => row.map(csvCell).join(',')).join('\n') + '\n');
  const report = { plannerCommit: sha, plannerVersion: JSON.parse(readFileSync(join(upstream, 'package.json'))).version,
    sourceAsOf: plan.asOf, schema: 'IFC4X3_ADD2', tasks: parsed.tasks.length,
    milestones: parsed.tasks.filter(t => t.isMilestone).length, dependencies: parsed.sequences.length,
    calendars: 1 + (parsed.resourceCalendars || []).filter(c => c.id !== parsed.calendar.id).length,
    baselines: parsed.baselines.length, baselinesPreserved: !!previous, checks: ['acyclic dependency network', 'all leaves reach final milestone',
      'native IFC integrity check', 'native reader/writer round-trip preserves planning data',
      'native document-open and F5 recalculation preserves all day-measure dates', 'zero native scheduler warnings',
      ...(previous ? ['existing baseline dates and metadata preserved by stable Plan ID'] : [])],
    milestonesForecast: rows.filter(r => plan.tasks.find(t => t.id === r.id)?.milestone),
    criticalPath: rows.filter(r => r.critical && !plan.tasks.some(t => t.parent === r.id)).map(r => ({id:r.id,name:r.name,start:r.start,finish:r.finish})),
    schedule: summary };
  writeFileSync(join(root, 'reports/validation.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ tasks: report.tasks, dependencies: report.dependencies, milestones: report.milestones,
    forecasts: report.milestonesForecast.map(r => ({ id:r.id, finish:r.finish })), checks: report.checks }, null, 2));
} finally { rmSync(temp, { recursive: true, force: true }); }

function validatePlan(p) {
  const byId = new Map(p.tasks.map(t => [t.id,t]));
  if (byId.size !== p.tasks.length) throw new Error('Duplicate task ID');
  const parents = new Set(p.tasks.map(t => t.parent).filter(Boolean));
  const visiting = new Set(), visited = new Set();
  const visit = id => {
    if (visiting.has(id)) throw new Error('Dependency cycle at ' + id);
    if (visited.has(id)) return;
    const t = byId.get(id); if (!t) throw new Error('Unknown task ' + id);
    visiting.add(id); for (const pred of t.after || []) visit(pred); visiting.delete(id); visited.add(id);
  };
  for (const t of p.tasks) {
    visit(t.id);
    if (t.parent && !byId.has(t.parent)) throw new Error('Unknown parent ' + t.parent);
    if (!parents.has(t.id)) {
      if (!t.acceptance) throw new Error('Missing exit evidence ' + t.id);
      if (t.milestone ? t.days !== 0 : !(t.days > 0)) throw new Error('Invalid duration ' + t.id);
      if (t.id !== 'START' && !(t.after || []).length) throw new Error('Missing predecessor ' + t.id);
    }
    if (parents.has(t.id) && (t.after || []).length) throw new Error('Summary dependency is prohibited');
  }
  const ancestors = new Set();
  const trace = id => { if (ancestors.has(id)) return; ancestors.add(id); for (const pred of byId.get(id).after || []) trace(pred); };
  trace('MP');
  for (const t of p.tasks) if (!parents.has(t.id) && !ancestors.has(t.id)) throw new Error('Task does not reach production ' + t.id);
}
