import json

def pretty_print_json_file(file_path):
    # Read the JSON data from the file
    with open(file_path, 'r') as file:
        json_data = json.load(file)

    # Pretty print the JSON data
    pretty_json = json.dumps(json_data, indent=4)

    # Write the pretty printed JSON back to the file
    with open(file_path, 'w') as file:
        file.write(pretty_json)

# Example usage:
file_path = 'frontend-SBOM.json'  # Change this to the path of your JSON file
pretty_print_json_file(file_path)
