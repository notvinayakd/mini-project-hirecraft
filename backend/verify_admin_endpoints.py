import requests
import json

BASE_URL = "http://localhost:5000/api/admin"

def test_endpoint(name, path, method="GET", data=None):
    print(f"Testing {name} ({path})...")
    try:
        url = f"{BASE_URL}{path}"
        # We need a session to hold the login cookie
        # For simplicity, if we are running locally and login is enabled, 
        # this might fail without auth. But let's check if we can get a response.
        headers = {'Content-Type': 'application/json'}
        response = requests.request(method, url, json=data)
        print(f"Status: {response.status_code}")
        if response.status_code < 300:
            print(f"Response: {json.dumps(response.json(), indent=2)[:500]}...")
        else:
            print(f"Error Body: {response.text}")
    except Exception as e:
        print(f"Failed: {str(e)}")
    print("-" * 20)

if __name__ == "__main__":
    # Note: These will likely return 401/403 if auth is working correctly.
    # That's actually a GOOD sign (auth is protecting them).
    # To truly test, we'd need to login first.
    test_endpoint("Stats", "/stats")
    test_endpoint("Activity", "/activity")
    test_endpoint("Questions", "/questions")
    test_endpoint("Drives", "/drives")
    test_endpoint("Students", "/students")
