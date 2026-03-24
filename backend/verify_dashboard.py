import requests
import sys

def verify_api():
    try:
        session = requests.Session()
        
        # 1. Login to get session cookie
        login_url = 'http://127.0.0.1:5000/api/auth/login'
        login_payload = {
            "email": "alex@example.com", 
            "password": "password123"
        }
        
        print(f"Logging in to {login_url}...")
        login_resp = session.post(login_url, json=login_payload)
        
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code}")
            print(login_resp.text)
            sys.exit(1)
            
        print("Login successful! Session cookie obtained.")

        # 2. Access Dashboard with session
        dashboard_url = 'http://127.0.0.1:5000/api/student/dashboard'
        print(f"Accessing {dashboard_url}...")
        response = session.get(dashboard_url)
        
        if response.status_code == 200:
            data = response.json()
            print("\nAPI Verification Successful!")
            print("-" * 30)
            print(f"User: {data['profile']['name']}")
            print(f"Stats: {data['stats']}")
            print(f"Graph Data: {'Pie & Bar present' if data['graphs']['pie'] or data['graphs']['bar'] else 'Empty'}")
            print(f"Recent Attempts: {len(data['recentAttempts'])}")
            print(f"Upcoming Events: {len(data['events'])}")
            print("-" * 30)
        else:
            print(f"Dashboard Access Failed with status code: {response.status_code}")
            print(response.text)
            sys.exit(1)
            
    except Exception as e:
        print(f"Verification Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_api()
