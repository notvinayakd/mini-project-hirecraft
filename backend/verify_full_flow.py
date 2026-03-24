import requests
import json

BASE_URL = "http://localhost:5000/api/student"
SESSION = requests.Session()

def login():
    print("1. Logging in...")
    resp = SESSION.post("http://localhost:5000/api/auth/login", json={
        "email": "alex@example.com",
        "password": "password123"
    })
    if resp.status_code == 200:
        print("   Login Successful")
    else:
        print(f"   Login Failed: {resp.text}")
        exit(1)

def get_dashboard_before():
    print("2. Fetching Dashboard (Before Test)...")
    resp = SESSION.get(f"{BASE_URL}/dashboard")
    if resp.status_code == 200:
        data = resp.json()
        print(f"   Tests Attended: {data['stats']['testsAttended']}")
        return data['stats']['testsAttended']
    else:
        print(f"   Failed to fetch dashboard: {resp.text}")
        return 0

def take_test():
    print("3. Fetching a Test...")
    # Get list of tests
    resp = SESSION.get(f"{BASE_URL}/tests/")
    tests = resp.json()
    if not tests:
        print("   No tests found!")
        exit(1)
    
    test_id = tests[0]['id']
    print(f"   taking Test ID: {test_id} ({tests[0]['title']})")
    
    # Get details
    resp = SESSION.get(f"{BASE_URL}/tests/{test_id}")
    details = resp.json()
    questions = details['questions']
    
    # Simulate answers (all 'A' i.e. index 0)
    answers = {}
    for q in questions:
        answers[str(q['id'])] = 0 
    
    print("4. Submitting Test...")
    resp = SESSION.post(f"{BASE_URL}/tests/submit", json={
        "testId": test_id,
        "answers": answers
    })
    
    if resp.status_code == 200:
        result = resp.json()
        print(f"   Submission Successful! Score: {result['score']}%")
        print(f"   Attempt ID: {result['attemptId']}")
        return result['attemptId']
    else:
        print(f"   Submission Failed: {resp.text}")
        exit(1)

def check_analysis(attempt_id):
    print(f"5. Checking Analysis for Attempt {attempt_id}...")
    resp = SESSION.get(f"{BASE_URL}/tests/attempt/{attempt_id}")
    if resp.status_code == 200:
        print("   Analysis Data Retrieved Successfully")
    else:
        print(f"   Failed to fetch analysis: {resp.text}")

def get_dashboard_after(prev_count):
    print("6. Fetching Dashboard (After Test)...")
    resp = SESSION.get(f"{BASE_URL}/dashboard")
    if resp.status_code == 200:
        data = resp.json()
        new_count = data['stats']['testsAttended']
        print(f"   Tests Attended: {new_count}")
        
        if new_count > prev_count:
            print("SUCCESS: Dashboard updated with new test attempt!")
        else:
            print("WARNING: Dashboard test count did not increase.")
    else:
        print(f"   Failed to fetch dashboard: {resp.text}")

if __name__ == "__main__":
    login()
    count_before = get_dashboard_before()
    attempt_id = take_test()
    check_analysis(attempt_id)
    get_dashboard_after(count_before)
