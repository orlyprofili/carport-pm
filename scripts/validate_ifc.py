#!/usr/bin/env python3
"""Independent IFC4X3_ADD2 schema/EXPRESS validation (IfcOpenShell + pytest)."""
import json
from pathlib import Path
import ifcopenshell
import ifcopenshell.validate

root = Path(__file__).resolve().parent.parent
model = ifcopenshell.open(str(root / 'carport-hw.ifc'))
logger = ifcopenshell.validate.json_logger()
ifcopenshell.validate.validate(model, logger, express_rules=True)
report = {
    'validator': f'IfcOpenShell {ifcopenshell.version}',
    'schema': model.schema_identifier,
    'entityCount': len(list(model)),
    'taskCount': len(model.by_type('IfcTask')),
    'sequenceCount': len(model.by_type('IfcRelSequence')),
    'calendarCount': len(model.by_type('IfcWorkCalendar')),
    'expressRulesChecked': True,
    'findings': logger.statements,
}
(root / 'reports/ifc-schema-validation.json').write_text(json.dumps(report, indent=2, default=str) + '\n')
print(json.dumps({k: v for k, v in report.items() if k != 'findings'}, indent=2))
print(f'Findings: {len(logger.statements)}')
for finding in logger.statements[:5]:
    print(finding.get('attribute'), finding.get('message'), str(finding.get('instance'))[:200])
raise SystemExit(bool(logger.statements))
