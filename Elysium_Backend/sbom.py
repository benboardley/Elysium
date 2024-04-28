import json

with open('sbom.json') as f:
    data = json.load(f)

license = set()

for component in data['components']:
    for license in component['licenses']:
        if 'id' in license['license']:
            license.add(license['id'])

print(license)