# Carport hardware planning

Open **[carport-hw.ifc](carport-hw.ifc)** in Open Planner Studio using File → Open. It is an IFC 4.3 ADD2 **schedule**, with 87 entries, 144 dependencies, 12 milestones, three calendars, task notes, accountable roles, exit evidence and the preserved initial proposal baseline.

The plan covers Rev1 prototype PCBs and printed/handmade housings → Rev2 and T1 tooling → T2 preproduction candidate → pilot → first mass-production lot ready to ship. US/Canada qualification starts on Rev2/T1 **in parallel with T2**, followed by a T2 change-impact review and affected retests before market release. Satellite is an evaluation with an explicit decision gate before Rev2 freeze. Software work stays in its own backlogs and appears here as delivery gates.

Planning status is **October 31, 2026**, with remaining work scheduled from **November 2, 2026**. Rev0 is recorded as complete in the status narrative; historical dates and progress percentages are not invented. These dates are an unapproved estimate, with no staffing, supplier, lab or purchase commitments implied.

| Milestone | Revised calculated forecast |
|---|---|
| Rev1 prototype build release | December 11, 2026 |
| Rev1 EVT findings accepted | January 29, 2027 |
| Rev2 / housing tool release | March 1, 2027 |
| T1 integrated evaluation accepted | April 16, 2027 |
| T2 preproduction candidate accepted | June 3, 2027 |
| Qualification / US-Canada release evidence accepted | June 22, 2027 |
| Mass-production authorization | August 18, 2027 |
| First mass-production lot ready to ship | September 22, 2027 |

T1 retains the proposed **6–8 week** window and T2 **4–6 weeks**, measured from their respective releases. Electrical and conducted/network work can start after the two-day Rev2 incoming bring-up (forecast March 31, 2027), using printed housings/handmade parts where the lab agrees they do not invalidate the result. Formal enclosure-sensitive campaigns use accepted representative T1 assemblies (forecast April 21). T2 changes undergo a three-day impact review and a ten-day affected-retest reserve. This moves qualification release seven weeks earlier and the first production lot **47 calendar days earlier** than the original November 8 forecast. The original unapproved proposal baseline remains in the IFC; it has not been reset to the accelerated dates.

Customer distribution still follows final-configuration compliance acceptance. Printed resin, substitute adhesives or an unrepresentative handmade seal do not establish production-enclosure qualification; the lab must accept representative T1 parts and determine which T2 changes require repeats.

Read **[the planning basis](docs/carport-hw-planning-basis.md)** for scope, research, lead-time definitions, qualification strategy, assumptions, decisions and software repository map. **[The CSV schedule](reports/carport-hw.schedule.csv)** is an inspection/export view of the same plan, not the file to open in the planner.

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

Independent schema verification uses Python 3.13, IfcOpenShell and its EXPRESS-rule dependency:

```sh
uv venv --python 3.13 /tmp/carport-ifc-venv
uv pip install --python /tmp/carport-ifc-venv/bin/python ifcopenshell==0.8.3.post2 pytest==9.2.0
/tmp/carport-ifc-venv/bin/python scripts/validate_ifc.py
```

Validation results are in **[reports/validation.json](reports/validation.json)** and **[reports/ifc-schema-validation.json](reports/ifc-schema-validation.json)**. Checks cover network connectivity/cycles, native IFC round-trip preservation, opening and recalculating through the app's headless core, and independent IFC schema/EXPRESS rules. Day-measure tasks retain their civil dates; the app may make shift boundary times explicit when reopening. No graphical UI inspection was performed.
