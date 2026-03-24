import requests
import sys

def verify_update():
    session = requests.Session()
    # Login
    login_payload = {"email": "alex@example.com", "password": "password123"}
    try:
        login_resp = session.post('http://127.0.0.1:5000/api/auth/login', json=login_payload)
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code}")
            sys.exit(1)
            
        print("Login successful.")
        
        # Update Profile
        update_payload = {
            "phone": "+91 12345 67890",
            "location": "Bangalore, India",
            "skills": "React, Python, Flask, Docker"
        }
        
        print(f"Updating profile with: {update_payload}")
        update_resp = session.put('http://127.0.0.1:5000/api/student/profile', json=update_payload)
        
        if update_resp.status_code == 200:
            print("Update successful.")
        else:
            print(f"Update failed: {update_resp.status_code}")
            print(update_resp.text)
            sys.exit(1)
            
        # Verify Update
        print("Verifying update...")
        get_resp = session.get('http://127.0.0.1:5000/api/student/profile')
        data = get_resp.json()
        
        if data['phone'] == "+91 12345 67890" and \
           data['location'] == "Bangalore, India" and \
           "Docker" in data['skills']:
            print("Verification Passed! Data updated correctly.")
        else:
            print("Verification Failed! Data mismatch.")
            print(f"Got: {data}")
            sys.exit(1)
            
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_update()
