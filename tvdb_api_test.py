import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

API_KEY = os.getenv('VITE_TVDB_API_KEY')

if not API_KEY:
    print("API key not found in .env")
    exit()

# Step 1: Login with API Key only
login_url = 'https://api4.thetvdb.com/v4/login'
payload = {
    "apikey": API_KEY
}

response = requests.post(login_url, json=payload)
data = response.json()

if 'data' not in data:
    print("Login failed:", data)
    exit()

token = data['data']['token']
headers = {
    'Authorization': f'Bearer {token}'
}

# Step 2: Search for a show
search_url = 'https://api4.thetvdb.com/v4/search'
params = {
    'q': 'Naruto'
}

search_response = requests.get(search_url, headers=headers, params=params)
search_results = search_response.json()

if 'data' in search_results:
    for show in search_results['data']:
        print(f"{show['name']} (TVDB ID: {show['tvdb_id']})")
else:
    print("No results or error:", search_results)