import requests
import sys

def verify_profile():
    # first login to get session
    session = requests.Session()
    login_payload = {"email": "alex@example.com", "password": "password123"}
    try:
        login_resp = session.post('http://127.0.0.1:5000/api/auth/login', json=login_payload)
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code}")
            print(login_resp.text)
            sys.exit(1)
            
        # now fetch profile
        resp = session.get('http://127.0.0.1:5000/api/student/profile')
        if resp.status_code == 200:
            data = resp.json()
            print("Profile Verification Successful!")
            print(f"Name: {data['name']}")
            print(f"Email: {data['email']}")
            print(f"Skills: {data['skills']}")
            print(f"Location: {data['location']}")
        else:
            print(f"Profile Fetch Failed: {resp.status_code}")
            print(resp.text)
            sys.exit(1)
            
    except Exception as e:
        print(f"Verification Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_profile()
