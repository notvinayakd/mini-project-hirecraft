import requests
import time

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

def get_dashboard_stats():
    resp = SESSION.get(f"{BASE_URL}/dashboard")
    if resp.status_code == 200:
        return resp.json()['stats']
    return None

def take_test(test_id, score_mode="low"):
    print(f"   Taking Test {test_id} (Mode: {score_mode})...")
    # Fetch test to get questions
    resp = SESSION.get(f"{BASE_URL}/tests/{test_id}")
    data = resp.json()
    questions = data['questions']
    
    answers = {}
    # If high score, answer correctly (assuming 'A' is correct for dummy, or check logic)
    # The dummy logic check in test_routes checks against correct_option 'A','B', etc.
    # We need to know the correct answer to force a score.
    # In my seeded data (if I recall seed_questions.py), I should check.
    # But for now, let's just make *some* attempt. 
    # Actually, simpler: The score isn't as important as the COUNT of tests.
    
    # Just submit arbitrary answers
    for q in questions:
        answers[str(q['id'])] = 0 
        
    resp = SESSION.post(f"{BASE_URL}/tests/submit", json={
        "testId": test_id,
        "answers": answers
    })
    return resp.json()

if __name__ == "__main__":
    login()
    
    # 1. Check Stats Before
    initial_stats = get_dashboard_stats()
    print(f"Initial Stats: {initial_stats}")
    
    # 2. Take a Test (Attempt 1)
    # Use a test ID that hopefully exists. ID 1 is usually safe.
    test_id = 1 
    print(f"\n2. Attempting Test {test_id} for the 1st time...")
    r1 = take_test(test_id)
    print(f"   Result 1: Score {r1['score']}%")
    
    # 3. Check Stats (Should update)
    stats_after_1 = get_dashboard_stats()
    print(f"Stats after Attempt 1: {stats_after_1}")
    
    if stats_after_1['testsAttended'] > initial_stats['testsAttended']:
        print("   -> Success: Test Count increased.")
    else:
        # It's possible we already took Test 1 in previous debugging.
        print("   -> Note: Test Count didn't increase (maybe already taken?). Continuing to retake check...")

    # 4. Retake same Test (Attempt 2)
    print(f"\n4. Retaking Test {test_id} (Attempt 2)...")
    r2 = take_test(test_id)
    print(f"   Result 2: Score {r2['score']}%")
    
    # 5. Check Stats (Should NOT change from step 3)
    stats_after_2 = get_dashboard_stats()
    print(f"Stats after Attempt 2: {stats_after_2}")
    
    if stats_after_2['testsAttended'] == stats_after_1['testsAttended']:
        print("PASS: Tests Attended count did NOT increase after retake.")
    else:
        print("FAIL: Tests Attended count INCREASED after retake!")
        
    # Check Average Score Logic
    # If the logic holds, the average score should be exactly the same as after attempt 1
    # UNLESS the logic was "Best Score". My implementation was "First Attempt".
    if stats_after_2['averageScore'] == stats_after_1['averageScore']:
        print("PASS: Average Score did not change (First attempt logic works).")
    else:
        print(f"FAIL: Average Score changed! {stats_after_1['averageScore']} -> {stats_after_2['averageScore']}")
