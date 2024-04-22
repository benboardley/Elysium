import requests

url = 'http://127.0.0.1:8000/user/follow/'  # Replace with your actual API URL
headers = {
    'Authorization': 'Token 23ba62bc5b229c7e35779f63cdbd7c55d04d9597',  # Replace your_token_here with the actual token
}

# Example data for creating a post
post_data = {
    'caption': 'This is a test post.',
    # Include other required fields for your Post model
}

#response = requests.post(url, headers=headers, data=post_data)
response = requests.get(url, headers=headers)
# Check the response status and content
if response.status_code == 200:  # Assuming 201 is the status code for a successful creation
    data = response.json()
    print(f"Post created successfully. Posts: {data}")
else:
    print(f"Error: {response.status_code}, {response.text}")
