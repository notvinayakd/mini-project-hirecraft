import requests
import sys

def verify_api():
    try:
        # Using a session cookie if possible would be better, but we made the API fall back to a default user for dev
        response = requests.get('http://127.0.0.1:5000/api/student/dashboard')
        
        if response.status_code == 200:
            data = response.json()
            print("API Verification Successful!")
            print(f"User: {data['profile']['name']}")
            print(f"Stats: {data['stats']}")
            print(f"Graph Data Present: {'yes' if data['graphs'] else 'no'}")
            print(f"Recent Attempts: {len(data['recentAttempts'])}")
            print(f"Upcoming Events: {len(data['events'])}")
            print(f"Material Counts: {len(data['materials'])}")
        else:
            print(f"API Failed with status code: {response.status_code}")
            print(response.text)
            sys.exit(1)
            
    except Exception as e:
        print(f"API Verification Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_api()
