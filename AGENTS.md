# Agent instructions

## Operator instructions

Do not treat a question as a request to act. Answer it first; take actions only when the operator explicitly asks. Carry an authorized task through implementation and proportionate verification without repeatedly asking for permission.

The operator gives standing authorization to build code and run proportionate verification for requested coding work, including necessary compiler/build-tool sandbox escalation and normal build/dependency cache writes. Do not ask again merely to build or retry outside the sandbox; cite this existing authorization when requesting tool escalation. Respect repository scope, resource limits and data preservation.

Preserve unrelated changes and unsaved application work. Inspect `git status --short` before edits. Untracked files may be valuable work; Git alone is not a backup of them. Do not commit, push, place orders, contact suppliers or change sibling projects unless the request authorizes that work.

## Repository purpose and files

This repository holds Carport project schedules in Open Planner Studio's native IFC format. These are scheduling IFCs, not physical building or PCB geometry models. Use IFC 4.3 ADD2 (`IFC4X3_ADD2`) for newly generated schedules; preserve the declared schema of an existing file unless a conversion is requested.

| File | Purpose |
|---|---|
| `carport-hw.ifc` | Hardware schedule opened and maintained in Open Planner Studio |
| `carport-hw.plan.json` | Declarative input for rebuilding the initial schedule; stable task keys, predecessors, estimates, calendars and evidence |
| `scripts/generate.mjs` | Generator using pinned upstream store, CPM engine, IFC reader/writer and headless document-open path |
| `scripts/validate_ifc.py` | Independent IfcOpenShell schema and EXPRESS-rule validation of `carport-hw.ifc` |
| `reports/carport-hw.schedule.csv` | Generated inspection view; not the authoritative editable schedule |
| `reports/validation.json` | Native generation, round-trip and recalculation results from the last generator run |
| `reports/ifc-schema-validation.json` | Independent schema results from the last validator run |
| `docs/carport-hw-planning-basis.md` | Requirements, assumptions, gate definitions, source register and software interfaces |
| `README.md` | Opening, regeneration and verification instructions; initial forecast snapshot |

Read the README and planning basis before substantive schedule changes. Read current files and reports rather than assuming that the first generated task counts, dates or versions still apply. Use `rg` / `rg --files` for discovery.

## Choose an editing route before writing

- **Maintaining the current schedule:** use Open Planner Studio or its connected `planner_*` MCP tools, preserve progress/baselines/notes, and save/export the edited IFC. This is the normal route after people have started maintaining the plan.
- **Rebuilding from declarative input:** edit `carport-hw.plan.json`, then use the generator. This replaces the IFC, CSV and native report. Pass `--preserve-baseline-from` to carry existing baselines forward by stable `Plan ID`; otherwise the generator creates a new proposal baseline. Neither route merges application/MCP edits or progress into the JSON.
- **Inspecting or validating an existing IFC:** read/validate that file directly. Do not run the generator as a validation shortcut: it would replace the file being inspected.

Before regeneration, account for any newer app/MCP changes and preserve the current IFC. Reconcile intended changes rather than silently overwriting them. A saved/exported IFC does not automatically update the JSON source. If synchronization is outside the request, state which representation was updated and that regeneration would replace those changes.

Do not make routine schedule edits with regex replacements of STEP entities or by manually numbering `#123` references. Prefer the application's editing APIs and native writer; use IfcOpenShell for inspection and independent validation. Preserve project metadata, hierarchy, relationships, calendars, custom fields, notes, progress and baselines, not just visible dates.

## Planning rules

- Build a dependency model: goal/milestones, work breakdown, durations, dependencies, calendars, then actual capacity. Let the scheduler calculate dates. Every non-summary task except the start needs a predecessor; every leaf except the final milestone needs a path to completion.
- Prefer finish-to-start relationships on leaf tasks. This repo's JSON generator prohibits dependencies on summary tasks. Summary dates/durations roll up from children; milestones have zero duration. Use visible procurement, shipping, review and retest tasks instead of unexplained lags. Do not add negative lags to make a target date fit.
- In MCP task creation, omit duration for a summary parent. Supply duration and its unit for ordinary tasks. The generator's zero-duration placeholder for a new parent is an internal construction detail, not a reason to send summary durations through MCP.
- Do not invent actual dates, progress, supplier commitments, lab bookings, approval status or resource capacity. Accountable role fields are ownership placeholders, not resource assignments or proof that a plan is capacity feasible.
- Distinguish forecast, requested deadline, historical actual and approved baseline. Use constraints only for real external restrictions; use deadlines to monitor a target without pinning the calculation. A mandatory milestone marker or project end-date metadata does not enforce a deadline.
- Keep engineering/lab, supplier and transit calendars distinct. Supplier operations must use supplier working days; seven-day transit must not imply weekend factory work. Record factory country, shutdown/restart and calendar assumptions explicitly. Do not present provisional closures as official holidays.
- Keep day measure, hour measure and elapsed time distinct. A five-day transport allowance is not necessarily five working days. A resource calendar does not by itself change task scheduling; inspect task calendar assignments.
- Preserve approved baselines. The existing initial baseline is an unapproved proposal. Do not call a newly captured baseline approved, reset it during routine updates or create a new baseline just to hide delay.
- For progress updates, use the operator's reporting date and supplied actuals. Setting a status date can move unstarted work; do not casually set it to today during inspection.
- Read calculated milestones, float and warnings after the final change. Investigate disconnected work, cycles, negative float, missed deadlines and resource overloads; do not conceal them by pinning dates.

## Carport scope and interfaces

The hardware source is `~/work/carport/hw`. The initial status was Rev0 complete, Rev1 schematic in review and layout underway. Read current evidence before updating that status. Treat saved review findings as items to reconcile, not automatically open defects or proof of closure.

The plan distinguishes Rev1 EVT, Rev2 design changes, T1/T2 mold trials with integrated evaluations, formal qualification/market access, PVT, and mass-production release. Qualification starts on Rev2 for suitable electrical/conducted work and on representative T1 for enclosure-sensitive work, in parallel with T2. Require lab acceptance of sample representativeness and an explicit T2 impact/retest gate; do not restore a blanket T2-before-all-testing dependency. Mold acceptance alone does not demonstrate electrical qualification, certification or manufacturing readiness. Track ePTFE humidity/acoustic performance, final membrane bonding/grill process, USB/seam sealing and pigtail strain relief on representative assemblies.

US and Canada are the initial launch markets; expansion is later scope. Satellite remains an evaluation with an explicit inclusion/deferment decision before Rev2 freeze. Do not assume service availability or final-product approval from nRF module capability. Confirm installation location and the 12 V versus 24 V input requirement before choosing automotive test envelopes. Use qualified lab/vendor evidence for certification and lead-time claims, and cite sources in the planning basis.

Software has separate backlogs and release management. Represent hardware-relevant software deliveries as versioned gates, not a speculative implementation schedule. Known components under `~/work/carport/sw/`:

- `carport-fw-esp32` and `tools/dashboard` within it: host firmware and GUI diagnostics.
- `carport-shared`, including `proto` and `carportpy`: contracts, constants, protocols and shared Python tooling.
- `carport-fw-nrf`: West wrapper; the actual firmware repository is nested at `carport-fw-nrf/carport-fw-nrf`.
- `carport-cli-app`: BLE/mobile tools, onboarding, location and recording.
- `carport-aws-cdk-iot`: backend infrastructure and provisioning/telemetry/OTA interfaces.

Do not infer release readiness from a README. Record matching hardware, firmware, modem/NCS, protocol/tool and backend versions at integration gates. Never copy credentials into plans, factory packages or logs.

## Open Planner Studio MCP

### Discover the connected server

Prefer a connected Open Planner Studio MCP server for live schedule edits. Discover its available `planner_*` tools and read their current input schemas; never invent a tool, argument or transport setting. Call `planner_get_planning_guide` when available and consult the guide for the connected version. Live tool schemas take precedence over examples below and over documentation from another build.

The first IFC was generated and checked through upstream code and the headless core; a live MCP session was not exercised. Do not claim that this repo already has an installed/configured MCP connection. Do not install client configuration or start a server merely because these instructions describe how.

Before modifying anything, use `planner_list_documents` and confirm the intended document with `planner_switch_document` if needed. Read `planner_get_project_info`, `planner_get_project_overview`, `planner_get_calendars` and relevant tasks/baselines. Import from disk with `planner_import_schedule` only when the intended file is not already the live document. Resolve returned task and relationship IDs from that document; WBS positions and IDs from earlier sessions are not reliable identities.

### Desktop bridge versus standalone headless MCP

The desktop bridge edits the app's live document and shares its undo history. Read the running app's MCP/AI settings for endpoint and authentication rather than assuming a port. At the pinned upstream version, production macOS discovery files are under `~/Library/Application Support/org.openaec.planner/mcp/`: `runtime.json` contains endpoint/authentication details and `open-files.json` lists open files. Treat tokens as secrets; do not print or commit either file. Discovery behavior can change; verify the running version.

The standalone MCP server is separate from the desktop bridge, the headless core library and the HTTP calculation API. It edits documents in its own memory. At the pinned version it is built from the upstream checkout with:

```sh
npm --prefix /tmp/carport-open-planner-studio run build:mcp-server
node /tmp/carport-open-planner-studio/dist-mcp-server/server.mjs --help
```

For a client-managed stdio process, the launch command/arguments can be:

```sh
node /tmp/carport-open-planner-studio/dist-mcp-server/server.mjs \
  --transport stdio \
  --root /Users/apisa/work/carport/pm \
  --open /Users/apisa/work/carport/pm/carport-hw.ifc \
  --data-dir /Users/apisa/work/carport/pm/.cache/open-planner-mcp
```

The MCP client must keep that process/session alive. Stdout is the protocol channel; logs belong on stderr. File operations are confined to `--root`; use absolute paths within it. In this headless mode `~` refers to the configured root, not the operator's home directory. Keep backups enabled. Optional HTTP mode requires loopback, authentication and MCP session handling; use the upstream help/docs rather than an unauthenticated endpoint or ad hoc stateless requests.

Do not concurrently write a file from the desktop app, a separate headless MCP process and a shell generator. At the pinned version the standalone app-lock hook is not a complete cross-process lock. Check the live app/open-file state and choose one writer; use a copy for what-if work.

### Edit, inspect, export

Use `planner_batch` for a coherent supported group of changes: one undo step and one recalculation. Not every operation can be batched; baseline capture, imports and exports have separate rules. Read the schemas. Mutating scheduling tools recalculate automatically; schedule reads can refresh stale calculations. There is no reason to invent a `planner_recalculate` call.

Inspect the response envelope:

| Signal | Required interpretation/action |
|---|---|
| `datesAsRecorded` | Stored imported dates are being shown; reads preserve them. Explain this when reporting; a mutation may switch to recalculated dates. |
| `scheduleStale` | Do not report the current values as a fresh calculation; reread after the edit completes. |
| `scheduleError` | Inspect and resolve the reported network/calculation problem before trusting dates. |
| `DOC_DRIFT` | Re-identify/select the intended document; do not blindly repeat a mutation. |
| `PAUSED`, `READ_ONLY`, `DIALOG_OPEN` | Respect the live guard and report the reason if it blocks the request; do not bypass it. |

After changes, read `planner_get_project_info`, `planner_get_critical_path` and affected tasks; compare baseline when appropriate. If resource levelling is requested, preview the supported dry-run result first. Do not infer capacity from role labels or apply levelling casually.

**In standalone headless MCP, changes are not automatically saved.** Persist with `planner_export_ifc` to the intended absolute path. An existing target requires explicit `overwrite: true`; use it for an authorized update after preserving/reconciling current work, without asking again merely because a save is needed. Verify the export response and actual disk file. Export does not change the desktop document's save target, and a baseline is not a disk save.

Never silently convert an unsupported source schema to overwrite the original. Case variants, symlinks and alternate path spellings do not prove a different file. After a timeout or ambiguous write failure, inspect document/file state before retrying: a timeout is not proof that no change occurred.

## Regeneration and verification

Use the full setup commands in `README.md` when dependencies are missing. `/tmp` checkouts/environments are disposable and may not survive another session. The generator requires the exact upstream commit recorded in `carport-hw.plan.json`; do not silently substitute current `main`. Keep upstream source, dependency trees and caches outside tracked project content. If a newer API is needed, update the pin deliberately and recheck round-trip/calculation behavior.

After an authorized JSON rebuild:

```sh
node scripts/generate.mjs --planner-source /tmp/carport-open-planner-studio \
  --preserve-baseline-from carport-hw.ifc
uv run --locked python scripts/validate_ifc.py
```

After an app/MCP edit of the existing IFC, run the independent validator directly. For native checks, import a copy into the matching app/headless core and inspect its recalculation/round-trip; do not regenerate from stale JSON. Refresh or clearly identify any CSV/native report that still describes an older file. Never present old reports as verification of new IFC bytes.

Check preservation of hierarchy, links, calendars, notes/custom fields, actuals and baselines, as well as schema correctness and calculated milestone dates. Verify there are no dropped relations or unexplained date shifts. A schema-valid file can still contain a bad schedule, and headless checks do not constitute graphical Gantt/print inspection. For documentation-only edits, check accuracy/links/whitespace; do not rebuild schedules unnecessarily.

Lessons from the first generation:

- The upstream store allocates internal IDs. Preserve the mapping returned from `addTask`; do not assume a supplied JSON task key becomes the internal ID. The `Plan ID` custom field carries the stable source key.
- Generated GUIDs, internal IDs and file-header timestamps may vary. Compare meaningful schedule data rather than requiring byte-identical regeneration. Stable task keys are safer than name-only joins; avoid duplicate names with the current generator's name-based verification.
- Day-measure dates may gain explicit shift-boundary times when reopened. Compare civil dates for day tasks, but preserve exact instants/minutes for hour tasks; do not truncate all timestamps indiscriminately.
- IfcOpenShell EXPRESS-rule checking requires `pytest` as well as `ifcopenshell`; the documented environment pins working versions. A native reader success does not replace independent schema validation.
- The current generator targets this particular Carport plan, assumes `START`/`MP` endpoints, and writes fixed output paths. Generalize it deliberately before applying it to a different schedule or hour-based plan.

## Reference and reporting

The implementation reference used initially is [Open Planner Studio at the pinned source commit](https://github.com/OpenAEC-Foundation/open-planner-studio/tree/2f6bc4d8220a255d1f7a493b9e39141ac2caa821). Useful upstream files are `public/agent/planning-guide.md`, `docs/headless-mcp.md`, `docs/headless-kern.md`, `docs/mcp-ontdekking.md`, `src/services/mcp/toolRegistry.ts` and `src/services/ifc/`. These describe that build, not a promise about future versions.

Report the file updated, the requested behavioral/schedule change, material assumptions and forecast impact, and what verification actually ran. Link the IFC and relevant planning basis/report using absolute workspace paths. Distinguish saved output from in-memory changes and explicit dates from estimates. Do not claim live MCP or visual validation unless performed.
