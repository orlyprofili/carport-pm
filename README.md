# Carport hardware planning

Open **[carport-hw.ifc](carport-hw.ifc)** in Open Planner Studio. The current IFC 4.3 ADD2 schedule has **86 entries, 141 dependencies, 12 milestones, four calendars, two resources and 89 assignments**.

The November 1 coordination update moved the planning-start milestone to the top and placed **Program decisions and coordination** between the Rev1 release and EVT sections. The operator reports that the overseas manufacturer built Rev0 and is already assisting with review. The plan now covers remaining Rev1 coordination with that manufacturer, early Rev1 sample allocation, manufacturer-supported lab coordination and Profili's SIM/provider evaluation. Later qualification samples are finalized with the lab. Task descriptions, exit evidence, notes and accountable roles were updated together. See the [planning basis](docs/carport-hw-planning-basis.md) for the assumptions and forecast impact.

Profili has one-person base capacity and a second person during the peak windows described in the [earlier effort/capacity report](reports/effort-capacity-validation.json). **Twelve hands-on electrical/design/software assignments remain full-time; 26 review, lab, certification, integration and pilot-support assignments use estimated 10–50% effort.** Profili effort totals 187 person-days, replacing the earlier blanket 394-person-day assumption. The coordination update shortened the manufacturer and Rev1 sample-planning tasks; all other leaf durations remain unchanged. Sofeast retains 51 assignments as a parallel organization.

**Both resources show zero overallocated days in the model. The pilot/production/ramp phase still starts July 2, 2027; shipment release is September 23, 2027.** Five tasks were previously sequenced within available float; the original proposal baseline is preserved. Factory test-tool readiness takes priority over the product release candidate in the allocator. Profili’s peak load is two people. Effort and staffing remain planning assumptions, not confirmed commitments. The existing mixed-calendar negative-float diagnostic is disclosed in the coordination report.

Profili’s Ontario holidays and confirmed Christmas–New Year shutdown, Sofeast’s China planning calendar and joint task calendars are retained. China annual arrangements still require confirmation. Five freight waits keep coordination in their descriptions without continuous labor reservations; seven-day transport allowances are unchanged.

The JSON, [generated CSV](reports/carport-hw.schedule.csv), [generation report](reports/validation.json), [effort/capacity report](reports/effort-capacity-validation.json), [first resource-assignment report](reports/resource-assignment-validation.json), [calendar report](reports/calendar-resource-validation.json) and [earlier two-person capacity report](reports/two-person-capacity-validation.json) describe earlier IFC snapshots. The new [coordination validation report](reports/coordination-validation.json) records the current checks; modeled Profili effort remains 187 person-days and Sofeast falls by seven task-days. Regenerating from JSON would replace current live maintenance.

The plan covers Rev1 prototype PCBs and printed/handmade housings → Rev2 and T1 tooling → T2 preproduction candidate → pilot → first mass-production lot ready to ship. US/Canada qualification starts on Rev2/T1 **in parallel with T2**, followed by a T2 change-impact review and affected retests before market release. Satellite is an evaluation with an explicit decision gate before Rev2 freeze. Software work stays in its own backlogs and appears here as delivery gates.

Planning status is **October 31, 2026**, with remaining work scheduled from **November 2, 2026**. Rev0 is recorded as complete in the status narrative; historical dates and progress percentages are not invented. These dates are an unapproved estimate, with no staffing, supplier, lab or purchase commitments implied.

| Milestone | Current IFC calculated forecast |
|---|---|
| Rev1 prototype build release | December 1, 2026 |
| Rev1 EVT findings accepted | January 19, 2027 |
| Rev2 / housing tool release | February 25, 2027 |
| T1 integrated evaluation accepted | April 15, 2027 |
| T2 preproduction candidate accepted | June 2, 2027 |
| Qualification / US-Canada release evidence accepted | June 21, 2027 |
| Mass-production authorization | August 18, 2027 |
| First mass-production lot ready to ship | September 23, 2027 |

Qualification continues on suitable Rev2 work and representative T1 assemblies in parallel with T2; the final T2 impact/retest gate remains. Resource/calendar maintenance preserved leaf-task durations and the original unapproved baseline. Current dates are calculated forecasts, not supplier, lab or capacity commitments.

Customer distribution still follows final-configuration compliance acceptance. Printed resin, substitute adhesives or an unrepresentative handmade seal do not establish production-enclosure qualification; the lab must accept representative T1 parts and determine which T2 changes require repeats.

Read **[the planning basis](docs/carport-hw-planning-basis.md)** for scope, research, lead-time definitions, qualification strategy, assumptions, decisions and software repository map. The older CSV is a historical inspection view, not the file to open in the planner.

## Updating the plan

For ordinary schedule maintenance, edit and save the IFC in Open Planner Studio. Preserve an agreed baseline before changing the forecast. Assign named owners and validate their capacity, replace estimated durations/closures with supplier and lab commitments, and update actuals against evidence.

For regeneration, edit **[carport-hw.plan.json](carport-hw.plan.json)**, which holds the source tasks, explicit predecessors, estimates, calendars and exit criteria. Regeneration replaces the IFC; it does **not** merge edits made in the app. Preserve any app-maintained plan before regenerating. Use `--preserve-baseline-from` to retain existing baseline dates/metadata and active/comparison selection, remapping tasks by their stable `Plan ID`; this preserves baselines only, not live progress or other app edits. Omitting this option creates a new initial proposal baseline from the generated dates.

The generator uses the real Open Planner Studio store, scheduler, reader and writer from a pinned public source checkout. Node 22+ is required. Dependencies and upstream source are kept outside this repository:

```sh
git clone https://github.com/OpenAEC-Foundation/open-planner-studio.git /tmp/carport-open-planner-studio
git -C /tmp/carport-open-planner-studio checkout 2f6bc4d8220a255d1f7a493b9e39141ac2caa821
npm --prefix /tmp/carport-open-planner-studio ci --ignore-scripts --no-audit --no-fund
node scripts/generate.mjs --planner-source /tmp/carport-open-planner-studio \
  --preserve-baseline-from carport-hw.ifc
```

Independent schema verification uses a project-local Python 3.13 environment managed by `uv`. The lockfile pins IfcOpenShell, pytest (needed for EXPRESS-rule checks), and their dependencies:

```sh
uv sync --locked
uv run --locked python scripts/validate_ifc.py
```

The validator reads the current IFC and replaces `reports/ifc-schema-validation.json`; it does not regenerate the schedule. The `.venv` directory is local and ignored by Git.

Current checks are in **[reports/coordination-validation.json](reports/coordination-validation.json)** and **[reports/ifc-schema-validation.json](reports/ifc-schema-validation.json)**. Native reader/writer and document-open recalculation checks passed. Schema/EXPRESS validation found no issues. The headless histogram has zero resource conflicts; the existing mixed-calendar negative-float diagnostic remains disclosed in the coordination report. No graphical UI inspection was performed. Earlier reports remain historical snapshots.
