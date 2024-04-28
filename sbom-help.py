import json

filename = 'Elysium_Backend/backend-sbom.json'
#filename = 'Elysium_Frontend/frontend-sbom.json'

with open(filename) as fp:
    data = json.load(fp)

licenses = set()

##FRONTEND
"""
for package in data.get('packages', []):
    licenses.add(package.get('licenseConcluded'))
"""
##BACKEND
for component in data.get('components', []):
    for license_entry in component.get('licenses', []):
        license_info = license_entry.get('license', {})
        if 'id' in license_info:
            licenses.add(license_info['id'])

#print("Frontend Licenses:")
print("Backend Licenses:")
print(licenses)
