import urllib.request
import json
import urllib.error

url = 'http://127.0.0.1:5000/api/auth/signup'
headers = {'Content-Type': 'application/json'}
data = {
    'name': 'Test User',
    'email': 'test@example.com',
    'password': 'password123'
}

req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"Error: {e.code} - {e.reason}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
