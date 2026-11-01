# Carport HW planning basis

Status: **2026-10-31**, America/Toronto. Proposal, not an approved delivery commitment. Forecast anchor: **2026-11-02**. The generated IFC is the deliverable; JSON is the regenerable source. Research informs the work and its acceptance gates; durations are engineering estimates unless explicitly attributed to the operator.

## Current IFC maintenance — November 1, 2026

The running desktop app was edited through its MCP bridge and exported to `carport-hw.ifc`. The plan has 86 entries and 142 dependencies. The pilot/production/ramp phase remains **July 2, 2027**, and the final ready-to-ship milestone remains **September 23, 2027**. All milestone dates and the initial unapproved proposal baseline are preserved. Current task effort, capacity windows, sequencing and checks are in the [effort/capacity report](../reports/effort-capacity-validation.json). Forecasts in the original narrative below are historical where they differ.

The operator chose to retain July and revisit Profili effort/support assignments. Twelve assignments for hands-on schematic/PCB work, firmware/software delivery, bring-up, electrical-fix verification and test architecture remain **100%**. Twenty-six assignments for technical reviews, provider evaluation, external lab/certification campaigns, Sofeast-led mechanical/fixture integration and pilot monitoring use **10–50% estimated effort**. These are effort allowances spread over the existing task windows; lab campaigns, supplier work and soak durations are not shortened. Every estimate and rationale is listed in the current report. Total Profili effort is **187 person-days**, of which **183** precede the pilot, compared with the superseded blanket full-time total of 394. These are planning estimates, not actual time records.

Profili has one-person base capacity and an assumed second person only during the nine modeled peak windows, recorded as 18 availability steps in the IFC. The additional person follows Profili’s Ontario/shutdown calendar. Sofeast retains the operator’s parallel staffing assumption: its 51-slot organization envelope is not 51 confirmed people. Its current peak is six concurrent task units. No supplier or staffing commitment is asserted. Five freight waits carry coordination in their descriptions without a continuous labor allocation.

Resource smoothing was previewed and applied **within float only**. It shifts SIM/provider and satellite evaluation to November 20, 2026; fixture architecture to March 5, 2027; factory firmware/provisioning/test tools to April 13; and the product release candidate to May 11. The product RC leveling priority is 400 (previously 500), so fixture/factory test readiness is allocated first. No dependency, hard date constraint, duration, actual, status date or baseline was added or changed. **Both resources now have zero overallocated days in the model**, with a two-person Profili peak. Actual skill coverage, task attendance peaks and lab bookings still require confirmation.

Profili follows [Ontario public holidays](https://www.ontario.ca/document/your-guide-employment-standards-act-0/public-holidays), the customary Civic Holiday, and the operator-confirmed **December 24–January 1 shutdown**. Weekend substitute days use the next available weekday as a planning convention. The old “provisional year-end” labels were replaced with the named Profili shutdown. Sofeast’s country is confirmed as China; the unsupported February 1–19 factory closure was removed.

The China calendar uses the [PRC statutory holiday rules](https://big5.www.gov.cn/gate/big5/www.gov.cn/zhengce/content/202411/content_6986380.htm) and [HKO 2027](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2027e.pdf), [2028](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2028e.pdf) and [2029](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2029e.pdf) lunar/solar dates. Eight-day Spring Festival, five-day May and seven-day October breaks are **planning allowances**, not verified annual government arrangements or factory commitments. Exact annual substitutions/make-up working weekends require confirmation; no weekend factory work is assumed. Both resource calendars and task calendars were assigned. Joint work excludes both countries’ holidays; seven-day transit remains separate.

Native document-open checks reproduce the saved forward dates and find no warnings. Negative float of one to three days remains in the mixed-calendar backward calculation, despite no finish deadline; the existing Rev1-build SNET is unchanged. This diagnostic is unresolved and reported, rather than hidden by date constraints. Baseline civil dates/metadata, active/comparison selection, hierarchy, links, notes, custom fields, leaf durations and progress are preserved.

The IFC is saved. JSON, old CSV and older reports were not synchronized; regeneration would replace live maintenance. Before-change snapshots are retained under `.cache/effort-revision-2026-11-01/` and the earlier maintenance backup directories. Export does not clear the app’s dirty flag.

## Scope and current position

The operator reports Rev0 PCB complete, Rev1 schematic out for review, and Rev1 layout in progress. Enclosure development covers a straightforward plastic clamshell, ePTFE protection for humidity sensing and a MEMS microphone, USB access, a power pigtail with strain relief, a user button and RGB indicator, and development access to ESP32 reset/boot and nRF reset. Next are Rev1 PCBs and printed housings with handmade membrane/grill assemblies; then Rev2 PCBs and tooling/T1, T2, and production.

The hardware source is `/Users/apisa/work/carport/hw`. The saved review reports, especially `docs/review-2.md` dated October 27, give useful test and release requirements. They are review evidence, not proof of current fix status. The plan requires reconciling them with the released design. Important carried-forward items are R2-03 BOM metadata, R2-04 input-fault stress, charger input-current/source policy and USB-only recovery, nRF rail droop during radio peaks, switched-domain back-power/sequence behavior, effective capacitance, and correct Rev1 pin/sensor mappings. Findings already marked resolved are not reopened as new defects.

Remaining work estimates begin at the planning anchor. No exact historical Rev0 completion date, schematic review completion, layout percentage, purchase placement or lab booking is claimed. The first milestone summarizes the supplied status. The baseline is labelled **Initial proposal - 2026-10-31 - unapproved estimates**. Its original dates and metadata are preserved while the current forecast accelerates qualification onto Rev2/T1 at the operator's request; this is a forecast revision, not an approved rebaseline.

Launch markets are **US and Canada**, confirmed by the operator. Later geographic expansion requires a new applicability review; EU/UK approval is outside the launch critical path. Satellite support remains under investigation, including nRF evaluation, as confirmed by the operator.

## Gate sequence

| Gate | Required result |
|---|---|
| G0 | Requirements, installation/power envelope, qualification strategy and supplier assumptions accepted |
| G1 | Controlled Rev1 PCBA prototype release after review/DFM |
| G2 | Rev1 EVT evidence and Rev2 change list accepted |
| G3a | Provider/SIM and satellite inclusion/deferment decided |
| G3 | Reviewed Rev2 PCBA and tool-ready enclosure released together |
| G4 | T1 molded parts evaluated with Rev2 electronics; correction list accepted |
| G5 | T2 configuration accepted as a preproduction candidate |
| G6 | Qualification and US/Canada market-access evidence accepted |
| G7 | Pilot materials, fixtures, software and manufacturing process ready |
| G8 | Pilot findings closed; operator authorizes MP quantity and release |
| G9 | First MP lot audited and ready to ship |

T1 and T2 are **mold-trial milestones**, with electrical integration evaluations attached. EVT is engineering validation on Rev1; DVT starts on Rev2 for tests whose validity does not depend on final enclosure construction, then uses representative molded T1 for enclosure-sensitive work. PVT proves the intended production process. T2 acceptance does not by itself prove regulatory clearance, reliability or production yield. A separate three-day T2 impact review determines which Rev2/T1 reports remain applicable and which tests must repeat before G6.

The schedule uses explicit finish-to-start dependencies on leaf tasks, with no negative lags, fixed finish dates or artificial deadline. Rev2 boards, tooling, fixture development and software gates run in parallel where their inputs allow it. Every leaf reaches the final release milestone. Critical dates are calculated by the planner rather than manually positioned.

## Duration and calendar assumptions

The requested **6–8 weeks to T1** is reasonable as a provisional simple-tool window. Commercial quick-turn services advertise shorter times, including [Fictiv's two-week T1 offer](https://www.fictiv.com/lp-ps/injection-molding-prototypes) and [Protolabs' service-dependent molding lead times](https://www.protolabs.com/help-center/lead-times/). Those offers do not establish a committed overseas production-tool schedule for this enclosure. I have retained the operator's allowance and made its components visible.

| Loop | Baseline allowance | Definition and limits |
|---|---|---|
| Rev1 / Rev2 PCBA | 15 supplier workdays + 5 calendar days freight each | Unquoted; shortages, substitutions and additional respins require replanning |
| T1 | 20 supplier workdays cutting + 5 supplier workdays first shots/FAI + 5 calendar days freight + 5 engineering workdays evaluation | Approximately 6–8 weeks from G3 without factory closure or a later electrical predecessor |
| T2 | 10 supplier workdays correction + 2 supplier workdays repeat trial/FAI + 5 calendar days express delivery + 10 engineering workdays evaluation | Approximately 4–6 weeks from the T2 correction release; minor tool/process corrections only |
| US/Canada RF/host route | 30 engineering workdays | Planning allowance for lab work/report/route completion; actual scope and lead time must be quoted |
| Cellular/operator route | 30 engineering workdays in parallel | Conditional NTN route included if selected; no approval inferred from module certification |
| Environmental qualification | 20 engineering workdays | Agreed DVP&R controls scope; lengthy aging/corrosion tests can exceed this window |
| T2 test-impact review | 3 engineering workdays | Compare tested Rev2/T1 with final T2 and obtain lab/quality carry-forward/retest disposition |
| Retest reserve | 10 engineering workdays | Affected final-T2 tests, report/acceptance and document updates; one minor cycle, visible in the network |
| Pilot | 10 supplier workdays build + 5 calendar days freight + 15 engineering workdays field work + 5 workdays closure | Proposed lot and acceptance targets require approval |
| First MP lot | 20 supplier workdays build + 5 engineering workdays outgoing audit | Lot quantity unknown; final customer freight is beyond G9 |

There are three calendars: weekday engineering/lab work, weekday overseas supplier work, and seven-day express transit. Engineering includes an assumed December 24–January 1 closure and editable Canadian planning holidays. Supplier country is unknown. A conservative China-based placeholder blocks **February 1–19, 2027**, plus provisional May/October closures. These are **capacity assumptions**, not official holiday claims. Confirm the actual country, factory shutdown/restart, subcontractors, staffing and customs operation before accepting supplier dates. No Saturday overtime or sea freight is assumed. Five transit days do not guarantee weekend receiving or customs clearance; successor evaluation waits for the engineering calendar.

Qualification now overlaps T2 instead of starting after it. The sequence still completes final-configuration compliance evidence before PVT/customer distribution. A controlled internal pilot during certification would be a further acceleration after the lab confirms the permitted manufacture/import/test route and the operator accepts configuration risk; that additional overlap is not assumed here.

The revised forecast retains T1 evaluation on **April 16, 2027**, moves T2 acceptance from June 11 to **June 3**, final qualification release from August 10 to **June 22**, and first MP lot ready-to-ship from November 8 to **September 22**. Qualification release advances seven weeks; first-lot release advances 47 calendar days. Early Rev2 pre-scan also removes the post-T1 serial pre-scan delay before tool corrections. Original baseline dates remain available for comparison.

## Earlier qualification and representative samples

The lab campaign begins after a **two-working-day incoming Rev2 bring-up**, while the remaining eight-day electrical fix verification runs on separately allocated units. This permits power/fault, conducted RF, network/protocol and selected-provider work to start around **March 31, 2027**. Use production-intent PCB/BOM, modem/application/test firmware, battery/load and cables, with a printed shell and hand-cut/applied grill/ePTFE where the test does not depend on final materials/process. The lab records the limitations rather than automatically calling every prototype result final qualification.

Move the ten-day EMC/GNSS/coexistence readiness pre-scan onto those Rev2 prototype assemblies. Once T1 is evaluated, allow two working days for the lab to accept a representative assembly/configuration matrix. Formal host radiated RF/EMC/exposure, enclosure/environment/cable and final accessible-point ESD/enclosed thermal work can then start on T1 around **April 21**, while T2 corrections and evaluation proceed. Cellular work is split into 20 days of earlier conducted/protocol testing and ten days of T1 OTA/antenna/provider completion; this preserves the original overall test allowance rather than pretending the route disappears.

Hand cutting or hand applying a membrane/grill can be representative if that is the intended controlled process, with the intended material, geometry, adhesive, bond surface/pressure/cure and retention. A printed shell of different resin or a temporary adhesive cannot prove production ingress, chemical/UV, mechanical or thermal behavior. T1 must use production-intent molded resin and relevant geometry/process, with any remaining differences explicitly dispositioned. This representative-sample approach is an engineering planning assumption requiring lab acceptance, not a claim that a certifier has already agreed.

[Nordic's host regulatory guidance](https://docs.nordicsemi.com/r/bundle/ps_nrf9151/page/regulatory_information.html) explains that mechanics changes can affect antenna behavior and that module integration has host obligations. [TÜV Rheinland's EMC process](https://www.tuv.com/world/en/electromagnetic-compatibility-%28emc%29.html) distinguishes early development testing from final-prototype conformity testing. [Gore's adhesive-vent information](https://www.gore.com/gorer-protective-vents-adhesive-series) provides material/integration options, not automatic qualification of the assembled housing. These support starting suitable work early while documenting which final configuration the evidence covers.

After T2 evaluation and the initial campaigns complete, the explicit impact review compares PCB/BOM, antenna/matching/location, firmware limits, resin/texture, geometry/seals, ePTFE/adhesive/grill, cables and assembly processes. The lab/quality team must approve report carry-forward or specify repeat tests/filings/operator acceptance. The ten-day reserve follows that review and includes minor affected tests and final report/document updates. Major changes need a new schedule; G6 remains blocked until final T2 is covered.

Dates can move materially with staffing, actual factory and lab calendars, long-lead parts, RF/antenna changes, power redesign, new battery qualification, major mold corrections, or a launch NTN requirement. A new PCB revision or new mold is a new loop; the ten-day reserve cannot plausibly absorb it. No probabilistic confidence interval or capacity-levelled commitment is implied.

## Mechanical and electrical qualification strategy

Define the installation location and quantitative pass limits first: cabin versus exposed/underhood placement changes environmental, chemical, thermal and RF requirements. Confirm the vehicle input class, especially **12 V versus 24 V**. The saved review discusses a lower-voltage protection envelope; nothing here assumes that hardware is suitable for 24 V vehicles. Resolve operating versus survival limits and recovery expectations before selecting pulse severities.

Power qualification covers input protection, reverse battery, crank, jump start, load dump/transients, USB overlap/hot-plug, fuse/cable behavior, shorts, charger/source limits, battery absent/depleted operation, radio current peaks, rail sequencing, thermal/efficiency and parked-vehicle sleep draw. [TI's automotive battery-input reference design](https://www.ti.com/tool/TIDA-01167) supports treating reverse polarity, overvoltage, overload and jump start as distinct concerns, with ISO 7637-2 / ISO 16750-2 as relevant test categories. The lab must select applicable editions, severities, fixture/cable arrangements and permitted functional behavior; a passed subset is not a general automotive approval.

Humidity exchange and acoustic transmission need separate measurements even if the final ports share an area. Prototype alternate ePTFE stacks, membrane support/bond lands, grille/screen, adhesive and cavity geometries. Measure RH lag/hysteresis and microphone response/noise before and after wetting, contamination, thermal/humidity cycling and aging. [Gore's acoustic vent guidance](https://www.gore.com/products/automotive-vents-acoustic) describes environmental protection and acoustic integration, while [its MEMS vent guidance](https://www.gore.com/gorer-mems-protective-vents-microphones) addresses contamination, pressure and in-process testing. Neither makes a hand-applied assembly or full housing qualified automatically.

Test all water paths: shell seam/fasteners, USB, power cable, button/light path and membrane bond. Qualify cable pull/flex/tension relief and mounting loads, grill retention, assembly torque, button/connector life, temperature/condensation and installation-specific vibration/shock/drop/chemicals/UV. Set the actual ingress target instead of inventing IP67. Printed housings support early tests; formal molded-enclosure evidence starts on representative T1 with a controlled adhesive process. Repeat the tests affected by T2 changes rather than automatically rerunning every unchanged test.

## Connectivity and US/Canada market access

Exact ESP32/nRF module variants, grants, antennas/gains, firmware and simultaneous transmit scenarios go into the initial lab matrix. GNSS is a receive-performance/desense concern; BLE, Wi-Fi and cellular/conditional NTN add transmitter integration concerns. Switching regulator noise, the vehicle ground/cable installation and the final enclosure all enter RF/EMC pre-scans.

For Canada, [ISED RSP-100 host/modular requirements](https://ised-isde.canada.ca/site/spectrum-management-telecommunications/en/devices-and-equipment/radio-standards-procedures-rsp/rsp-100-certification-radio-apparatus-and-broadcasting-equipment) and [RSS-Gen](https://ised-isde.canada.ca/site/spectrum-management-telecommunications/en/devices-and-equipment/radio-equipment-standards/radio-standards-specifications-rss/rss-gen-general-requirements-compliance-radio-apparatus) require the host integration/configuration and applicable host requirements to be assessed. RF exposure and host labels/user notices are explicit deliverables. The US task similarly requires an accredited lab/TCB determination of the exact FCC integration, emissions, exposure and filing route; this plan does not assert that a new host certification is always required. The FCC KDB site was inaccessible during research, so no claim of having checked its current detailed guidance is made.

Cellular industry/operator acceptance is separate from government authorization. [PTCRB](https://www.ptcrb.com/get-certified/) describes its module-based IoT Network Certified route and calls for checking additional operator testing. The provider selection must settle LTE-M/NB-IoT coverage and roaming in the US/Canada, PSM/eDRX, APN/provisioning, activation, long-term supply, commercial terms and physical SIM/eUICC lifecycle. Validate actual services before the hardware freeze.

Satellite stays an explicit branch decision. [Nordic's nRF9151 download notes](https://www.nordicsemi.com/Products/nRF9151/Download) distinguish NTN firmware compatibility, including hardware build-code restrictions, and [the compatibility matrix](https://docs.nordicsemi.com/r/bundle/comp_matrix_nrf9151/page/comp/nrf9151/nrf9151_modem_fw.html) identifies tested modem/NCS combinations. Check the actual fitted part, provider, approved bands/antenna, sky visibility, terrestrial/NTN mode behavior, power, SIM/profile and final-product approval route on evaluation hardware. If included, hold G3 until that scope is credible and reschedule any longer approval work. If deferred, require the disabled production feature/configuration and accurate claims. Neither outcome is presumed today.

[Bluetooth SIG's qualification process](https://www.bluetooth.com/develop-with-bluetooth/qualify/) is a separate release task owned under the company's membership account. Product identity and design reuse/testing must be settled before market distribution. Battery/transport review uses the actual cell and pack configuration; [PHMSA's lithium battery guide](https://www.phmsa.dot.gov/sites/phmsa.dot.gov/files/2024-12/Lithium-Battery-Guide-2024.pdf) explains test-summary traceability and why design modifications can change the transport test basis. Existing pack documentation can support the plan; a new pack test campaign needs its own quote and schedule.

## Software interfaces

Software uses its own iteration/release management. Hardware needs versioned, evidence-backed delivery gates rather than a construction-style task list for each implementation detail. Estimated software gate durations are placeholders agreed at G0, not an assessment of current completion.

| Repository/path under `/Users/apisa/work/carport/sw` | Hardware-program interface |
|---|---|
| `carport-fw-esp32` | Host firmware, Rev1/Rev2 pin/storage/sensor changes, source/charger policy, power states, radio/sensor integration, test modes and product release |
| `carport-fw-esp32/tools/dashboard` | GUI bench diagnostics, measurements/logs and factory/test workflow compatibility |
| `carport-shared` | Contracts, constants, schemas, protocols and generated-consumer version alignment |
| `carport-shared/proto` | Protobuf wire contracts and compatible generated bindings |
| `carport-shared/carportpy` | Shared Python bindings, BLE/event/log tooling and fixture/diagnostic use |
| `carport-fw-nrf` | nRF West workspace wrapper; actual firmware repo is nested at `carport-fw-nrf/carport-fw-nrf`; cellular/GNSS/modem and conditional NTN behavior |
| `carport-cli-app` | Mobile/BLE tools, onboarding, location, motion recording, diagnostic/OTA and relay integration |
| `carport-aws-cdk-iot` | Backend contracts, authorized provisioning, identity/telemetry/OTA and manufacturing/production environment readiness |

The four external gates are Rev1 bring-up tools, Rev2 DVT/RF firmware, factory provisioning/test release, and integrated product release candidate. Retain version/hash/configuration matrices across ESP32, nRF application/modem/NCS, shared/protobuf, Python/dashboard, mobile and backend. Existing READMEs establish that these components exist; they do not prove launch readiness. Preserve credentials outside build packages and logs, and calibration across reset/unclaim as required by the final product specification.

## Overseas manufacturing and release control

Use controlled drawing/BOM/Gerber/assembly packages and written ECO approval, approved vendor list/substitutions, build and cavity/lot/serial traceability, and factory inspection/test evidence. Confirm mold ownership, life/capacity, storage/maintenance and any separate pigtail/insert tooling. Weekly overlapping engineering calls and a shared issue log reduce handoff latency. Sample sets should include a retained factory set and customer reference units; require FAI and process parameters with each trial.

Suggested lots are **15 Rev1 boards, 30 Rev2 boards, 20 T1 housing sets, 60 T2 assemblies and 100 PVT units**. They are allocation/budget placeholders; the lab's destructive tests, reliability plan and spare needs decide final counts. MP lot size follows demand, yield, cash and vendor capacity at G8. Proposed pilot targets of at least 95% first-pass yield, every shipped unit passing functional screens and no unresolved critical defect require explicit acceptance and an appropriate sampling/control plan. Small pilots do not prove lifetime reliability or robust process capability.

## Source register

Source tokens appear in task custom fields and the JSON source. Web sources were reviewed for this proposal; revisit them at scope/freeze gates. Estimates remain distinct from researched facts.

| Token | Evidence |
|---|---|
| USER | Operator instructions and follow-up: hardware status, clamshell/ports/UI, T1/T2 windows, overseas manufacturing, US/Canada launch, NTN evaluation undecided |
| HW-REVIEW2 | `/Users/apisa/work/carport/hw/docs/review-2.md`; related earlier `docs/review.md`, `1/rev_change/rev_change.md`, and simulation notes |
| SW-MAP | Supplied repository list, local firmware/mobile/backend READMEs, shared repo AGENTS/proto README and dashboard source inventory |
| TOOL-LEAD | [Fictiv](https://www.fictiv.com/lp-ps/injection-molding-prototypes), [Protolabs](https://www.protolabs.com/help-center/lead-times/); feasibility context only, no vendor quotation |
| TI-POWER | [TI TIDA-01167](https://www.ti.com/tool/TIDA-01167) and [design guide](https://www.ti.com/lit/ug/tiduc41/tiduc41.pdf) |
| ISED-HOST | [RSP-100](https://ised-isde.canada.ca/site/spectrum-management-telecommunications/en/devices-and-equipment/radio-standards-procedures-rsp/rsp-100-certification-radio-apparatus-and-broadcasting-equipment) |
| ISED-GEN | [RSS-Gen](https://ised-isde.canada.ca/site/spectrum-management-telecommunications/en/devices-and-equipment/radio-equipment-standards/radio-standards-specifications-rss/rss-gen-general-requirements-compliance-radio-apparatus) |
| PTCRB | [Certification process and IoT route](https://www.ptcrb.com/get-certified/) |
| BT-SIG | [Product qualification](https://www.bluetooth.com/develop-with-bluetooth/qualify/) |
| NORDIC-NTN | [nRF9151 download/NTN compatibility notes](https://www.nordicsemi.com/Products/nRF9151/Download) |
| NORDIC-FW | [nRF9151 modem/NCS compatibility](https://docs.nordicsemi.com/r/bundle/comp_matrix_nrf9151/page/comp/nrf9151/nrf9151_modem_fw.html) |
| GORE-ACOUSTIC | [Automotive acoustic vents](https://www.gore.com/products/automotive-vents-acoustic) |
| GORE-MEMS | [MEMS protective vents](https://www.gore.com/gorer-mems-protective-vents-microphones) |
| BATTERY-TRANSPORT | [PHMSA Lithium Battery Guide](https://www.phmsa.dot.gov/sites/phmsa.dot.gov/files/2024-12/Lithium-Battery-Guide-2024.pdf) |
| NORDIC-HOST | [nRF9151 host responsibilities, RF exposure and antenna mechanics](https://docs.nordicsemi.com/r/bundle/ps_nrf9151/page/regulatory_information.html) |
| TUV-EMC | [TÜV Rheinland development and final-prototype EMC testing](https://www.tuv.com/world/en/electromagnetic-compatibility-%28emc%29.html) |
| GORE-ADHESIVE | [Gore adhesive vent materials/integration](https://www.gore.com/gorer-protective-vents-adhesive-series) |

Generation/verification uses [OpenAEC's public Open Planner Studio source](https://github.com/OpenAEC-Foundation/open-planner-studio/tree/2f6bc4d8220a255d1f7a493b9e39141ac2caa821), pinned commit `2f6bc4d8220a255d1f7a493b9e39141ac2caa821` (package version 2026.44.0). No upstream application source is vendored in this repository.
