import requests

try:
    # 1. Get all tests
    response = requests.get('http://localhost:5000/api/student/tests')
    tests = response.json()
    print(f"Found {len(tests)} tests.")
    
    if len(tests) > 0:
        test_id = tests[0]['id']
        print(f"Checking details for Test ID: {test_id} ({tests[0]['title']})")
        
        # 2. Get details for first test
        print(f"Checking details for Test ID: {test_id} ({tests[0]['title']})")
        detail_response = requests.get(f'http://localhost:5000/api/student/tests/{test_id}')
        
        # Check for TCS specifically
        tcs_found = any("TCS" in t['title'] for t in tests)
        print(f"TCS Test Found: {tcs_found}")
        
        if detail_response.status_code == 200:
            details = detail_response.json()
            questions = details.get('questions', [])
            print(f" - Questions Count: {len(questions)}")
            if len(questions) > 0:
                print(f" - Sample Question: {questions[0]['text']}")
                print("VERIFICATION SUCCESS: Tests have questions.")
            else:
                print("VERIFICATION FAILED: Test has 0 questions.")
        else:
            print(f"Failed to get details: {detail_response.status_code}")
    else:
        print("No tests found.")

except Exception as e:
    print(f"Error: {e}")
