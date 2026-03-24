from app import create_app, db
from app.models import User, PlacementDrive, MockTest, Question, TestAttempt, Material, CodeProblem
import bcrypt
from datetime import datetime, timedelta
import random

app = create_app()

def seed_data():
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all() # Resetting DB to ensure new schema is applied
        print("Creating all tables...")
        db.create_all()

        print("Seeding data...")

        # 1. Create a Student User
        hashed_password = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        student = User(
            name="Alex Morgan",
            email="alex@example.com",
            password_hash=hashed_password,
            branch="Computer Science",
            semester=7,
            phone="+91 98765 43210",
            location="Mumbai, India",
            gpa="8.9 CGPA",
            skills="React.js,Node.js,Python,Java,SQL,Figma",
            resume_link="alex_morgan_resume.pdf",
            about="Passionate Full Stack Developer aiming for product-based companies."
        )
        db.session.add(student)
        db.session.commit() # Commit to get ID

        # 2. Create Placement Drives
        companies = [
            {"name": "Google", "role": "Software Engineer", "ctc": "32 LPA", "loc": "Bangalore", "type": "Full Time", "logo": "G"},
            {"name": "Microsoft", "role": "SDE I", "ctc": "45 LPA", "loc": "Hyderabad", "type": "Full Time", "logo": "M"},
            {"name": "Amazon", "role": "SDE Intern", "ctc": "80K/mo", "loc": "Bangalore", "type": "Internship", "logo": "A"},
            {"name": "TCS", "role": "System Engineer", "ctc": "7 LPA", "loc": "Pune", "type": "Full Time", "logo": "T"},
            {"name": "Infosys", "role": "Specialist Programmer", "ctc": "9.5 LPA", "loc": "Mysore", "type": "Full Time", "logo": "I"},
        ]

        for i, comp in enumerate(companies):
            drive = PlacementDrive(
                company=comp["name"],
                role=comp["role"],
                ctc=comp["ctc"],
                location=comp["loc"],
                date=datetime.now().date() + timedelta(days=i*5 + 2),
                type=comp["type"],
                description=f"Join {comp['name']} as a {comp['role']}. Great opportunity!",
                logo_initial=comp["logo"]
            )
            db.session.add(drive)

        # 3. Create Mock Tests & Questions
        
        test_objects = []

        # --- Specific Company Tests (User Provided) ---
        
        # 3.1 TCS NQT
        tcs_test = MockTest(
            title="TCS NQT Practice",
            category="Aptitude",
            difficulty="Medium",
            questions_count=8,
            duration=30,
            description="Numerical Ability and Reasoning questions based on TCS NQT pattern."
        )
        db.session.add(tcs_test)
        db.session.flush()
        test_objects.append(tcs_test)

        tcs_questions = [
            {"text": "If a train travels 60 km in 1.5 hours, what is its speed in km/hr?", "options": ["30", "40", "45", "60"], "correct": "B"},
            {"text": "The average of 6 numbers is 15. If one number is excluded, the average becomes 14. What is the excluded number?", "options": ["18", "20", "21", "24"], "correct": "B"},
            {"text": "A car travels 120 km at a speed of 40 km/hr and returns at a speed of 60 km/hr. What is the average speed for the entire journey?", "options": ["48 km/hr", "52 km/hr", "50 km/hr", "55 km/hr"], "correct": "A"},
            {"text": "What sum of money will amount to ₹6600 in 3 years at 10% per annum simple interest?", "options": ["5000", "6000", "5500", "4800"], "correct": "B"},
            {"text": "What is the smallest number that must be multiplied by 84 to make it a perfect square?", "options": ["3", "6", "21", "7"], "correct": "C"},
            {"text": "An article is sold at a profit of 20%. If the selling price is ₹720, what is the cost price?", "options": ["600", "620", "680", "660"], "correct": "A"},
            {"text": "A student scored 30% in an exam and failed by 20 marks. If the passing marks are 40%, what are the maximum marks of the exam?", "options": ["100", "150", "200", "250"], "correct": "C"},
            {"text": "The ratio of the ages of A and B is 4 : 5. After 5 years, the ratio becomes 5 : 6. What is A's present age?", "options": ["20 years", "25 years", "30 years", "35 years"], "correct": "A"}
        ]
        
        import json
        for q_data in tcs_questions:
            db.session.add(Question(test_id=tcs_test.id, text=q_data["text"], options=json.dumps(q_data["options"]), correct_option=q_data["correct"], marks=1))

        # 3.2 Infosys
        inf_test = MockTest(
            title="Infosys Certification Prep",
            category="Technical",
            difficulty="Hard",
            questions_count=9,
            duration=45,
            description="Infosys specific pattern covering Quant, Reasoning, and Verbal."
        )
        db.session.add(inf_test)
        db.session.flush()
        test_objects.append(inf_test)
        
        inf_questions = [
            {"text": "A number is increased by 25% and then decreased by 20%. What is the net change in the number?", "options": ["5% increase", "5% decrease", "No change", "10% decrease"], "correct": "C"},
            {"text": "A can complete a work in 16 days and B can complete the same work in 24 days. In how many days will they complete the work together?", "options": ["8", "9.6", "10", "12"], "correct": "B"},
            {"text": "The average age of 5 people is 30 years. If one person aged 40 years leaves, what will be the new average?", "options": ["25", "26.5", "27.5", "28"], "correct": "C"},
            {"text": "The ratio of the salaries of A and B is 5 : 7. If B earns ₹8400, what is A's salary?", "options": ["6000", "6500", "7000", "7500"], "correct": "A"},
            {"text": "What will be the simple interest on ₹8000 at 7.5% per annum for 2 years?", "options": ["1000", "1100", "1200", "1300"], "correct": "C"},
            {"text": "What is the smallest number that must be added to 1234 to make it divisible by 9?", "options": ["2", "3", "4", "5"], "correct": "A"},
            {"text": "A shopkeeper sells an article at a loss of 10%. If the cost price is ₹500, what is the selling price?", "options": ["450", "460", "470", "480"], "correct": "A"},
            {"text": "A train travels at a speed of 54 km/hr. How many meters will it cover in 10 seconds?", "options": ["100", "120", "150", "180"], "correct": "C"},
            {"text": "A die is thrown once. What is the probability of getting a number greater than 4?", "options": ["1/6", "1/3", "1/2", "2/3"], "correct": "B"}
        ]

        for q_data in inf_questions:
            db.session.add(Question(test_id=inf_test.id, text=q_data["text"], options=json.dumps(q_data["options"]), correct_option=q_data["correct"], marks=1))

        # 3.3 IBM
        ibm_test = MockTest(
            title="IBM Assessment",
            category="Coding",
            difficulty="Medium",
            questions_count=6,
            duration=40,
            description="Assessment covering logical reasoning, coding concepts, and verbal ability."
        )
        db.session.add(ibm_test)
        db.session.flush()
        test_objects.append(ibm_test)
        
        ibm_questions = [
            {"text": "The price of an article is increased by 15% and then decreased by 15%. What is the net change in price?", "options": ["No change", "2.25% increase", "2.25% decrease", "5% decrease"], "correct": "C"},
            {"text": "A can complete a job in 20 days and B can complete the same job in 30 days. In how many days will they complete the job working together?", "options": ["10", "12", "15", "25"], "correct": "B"},
            {"text": "The average of 8 numbers is 25. If one number is replaced by 41, the average becomes 27. What was the replaced number?", "options": ["23", "25", "29", "31"], "correct": "A"},
            {"text": "Find the next number in the series: 3, 9, 27, 81, ?", "options": ["162", "189", "243", "324"], "correct": "C"},
            {"text": "Which of the following is used to store unique elements in Python?", "options": ["List", "Tuple", "Dictionary", "Set"], "correct": "D"},
            {"text": "What is the time complexity of traversing an array of size n?", "options": ["O(1)", "O(log n)", "O(n)", "O(n^2)"], "correct": "C"}
        ]

        for q_data in ibm_questions:
            db.session.add(Question(test_id=ibm_test.id, text=q_data["text"], options=json.dumps(q_data["options"]), correct_option=q_data["correct"], marks=1))

        # --- Generic Generated Tests ---
        # Define a pool of questions
        question_pool = {
            "Aptitude": [
                {"text": "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", "opts": ["120 metres", "180 metres", "324 metres", "150 metres"], "ans": "D"},
                {"text": "A, B and C can do a piece of work in 20, 30 and 60 days respectively. In how many days can A do the work if he is assisted by B and C on every third day?", "opts": ["12 days", "15 days", "16 days", "18 days"], "ans": "B"},
                {"text": "The average of 20 numbers is zero. Of them, at the most, how many may be greater than zero?", "opts": ["0", "1", "10", "19"], "ans": "D"},
                {"text": "Find the next number in the series: 2, 5, 11, 23, 47, ?", "opts": ["95", "94", "96", "98"], "ans": "A"},
                {"text": "In a certain code language, 'COMPUTER' is written as 'RFUVQNPC'. How will 'MEDICINE' be written in that code language?", "opts": ["MFEDJJOE", "EOJDEJFM", "MFEJDJOE", "EOJDJEFM"], "ans": "D"},
                {"text": "A man buys a cycle for Rs. 1400 and sells it at a loss of 15%. What is the selling price of the cycle?", "opts": ["Rs. 1090", "Rs. 1160", "Rs. 1190", "Rs. 1202"], "ans": "C"},
                {"text": "Two numbers are in ratio 5:7. If 9 is subtracted from each, they are in ratio 7:11. Find the difference between numbers.", "opts": ["6", "12", "15", "18"], "ans": "B"},
                {"text": "If 20% of a = b, then b% of 20 is the same as:", "opts": ["4% of a", "5% of a", "20% of a", "None of these"], "ans": "A"},
                {"text": "The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then the value of x is:", "opts": ["15", "16", "18", "25"], "ans": "B"},
                {"text": "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:", "opts": ["Rs. 650", "Rs. 690", "Rs. 698", "Rs. 700"], "ans": "C"}
            ],
            "Technical": [
                {"text": "What does the 's' in HTTPS stand for?", "opts": ["Secure", "Site", "System", "Standard"], "ans": "A"},
                {"text": "Which data structure uses LIFO?", "opts": ["Queue", "Stack", "Array", "Linked List"], "ans": "B"},
                {"text": "What is the time complexity of binary search?", "opts": ["O(n)", "O(n^2)", "O(log n)", "O(1)"], "ans": "C"},
                {"text": "Which of these is NOT a NoSQL database?", "opts": ["MongoDB", "Cassandra", "PostgreSQL", "Redis"], "ans": "C"},
                {"text": "In React, what is used to pass data to a component from outside?", "opts": ["setState", "render", "props", "propTypes"], "ans": "C"},
                {"text": "What is the purpose of the 'virtual DOM' in React?", "opts": ["To directly manipulate the DOM", "To improve performance by minimizing DOM updates", "To store data", "To manage routing"], "ans": "B"},
                {"text": "Which HTTP method is idempotent?", "opts": ["POST", "PUT", "PATCH", "CONNECT"], "ans": "B"},
                {"text": "What is the output of 2 + '2' in JavaScript?", "opts": ["4", "22", "NaN", "Error"], "ans": "B"},
                {"text": "Which of the following is a mutable data type in Python?", "opts": ["Tuple", "String", "List", "Integer"], "ans": "C"},
                {"text": "What does SQL stand for?", "opts": ["Structured Question Language", "Structured Query Language", "Simple Query Language", "Standard Query Level"], "ans": "B"}
            ],
            "Verbal": [
                {"text": "Select the synonym of: CANDID", "opts": ["Frank", "Secretive", "Vague", "Dishonest"], "ans": "A"},
                {"text": "Select the antonym of: ROBUST", "opts": ["Strong", "Weak", "Healthy", "Heavy"], "ans": "B"},
                {"text": "Choose the correctly spelt word.", "opts": ["Accomodation", "Accommodation", "Acommodation", "Acomodation"], "ans": "B"},
                {"text": "Complete the idiom: To let the cat out of the ____.", "opts": ["Box", "House", "Bag", "Cage"], "ans": "C"},
                {"text": "One who knows everything is called:", "opts": ["Omnipresent", "Omnipotent", "Omniscient", "Optimist"], "ans": "C"},
            ],
            "Coding": [
                 {"text": "Predict the output: console.log(typeof NaN)", "opts": ["number", "NaN", "undefined", "object"], "ans": "A"},
                 {"text": "What is the output of: print(bool('False'))", "opts": ["True", "False", "Error", "None"], "ans": "A"},
                 {"text": "Which of the following is not a valid variable name in Python?", "opts": ["_myVar", "my_var", "2myVar", "myVar2"], "ans": "C"},
                 {"text": "What is the complexity of accessing an element in an array by index?", "opts": ["O(1)", "O(n)", "O(log n)", "O(n log n)"], "ans": "A"},
                 {"text": "Which sorting algorithm has the best average case time complexity?", "opts": ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], "ans": "C"}
            ]
        }

        tests_data = [
            {"title": "Amazon SDE - Aptitude Round", "cat": "Aptitude", "diff": "Hard", "q": 20, "dur": 45, "pool": ["Aptitude"]},
            {"title": "Google General Knowledge", "cat": "Aptitude", "diff": "Medium", "q": 10, "dur": 15, "pool": ["Aptitude", "Verbal"]},
            {"title": "React JS Proficiency", "cat": "Technical", "diff": "Medium", "q": 10, "dur": 30, "pool": ["Technical"]}
        ]
        
        for t in tests_data:
            test = MockTest(
                title=t["title"],
                category=t["cat"],
                difficulty=t["diff"],
                duration=t["dur"],
                questions_count=t["q"]
            )
            db.session.add(test)
            db.session.flush() # Get ID
            test_objects.append(test)

            # Add Questions
            import json
            pool_keys = t["pool"]
            selected_questions = []
            for key in pool_keys:
                selected_questions.extend(question_pool.get(key, []))
            
            # Shuffle and ensure we have enough questions
            import random
            random.shuffle(selected_questions)
            final_questions = []
            
            target_count = int(t["q"])
            
            if selected_questions:
                while len(final_questions) < target_count:
                    needed = target_count - len(final_questions)
                    # Take as many as needed, cycling if necessary
                    batch = selected_questions[:needed]
                    final_questions.extend(batch)
                    
                    if not batch:
                        break

            for q_data in final_questions:
                q = Question(
                    test_id=test.id,
                    text=q_data["text"],
                    options=json.dumps(q_data["opts"]),
                    correct_option=q_data["ans"],
                    marks=1
                )
                db.session.add(q)
        
        db.session.commit()

        # 4. Create Test Attempts (More realistic data)
        # Alex has attempted TCS and Amazon tests
        db.session.add(TestAttempt(
            user_id=1,
            test_id=test_objects[0].id, # TCS
            score=75,
            date_attempted=datetime.now() - timedelta(days=5),
            status="Completed"
        ))
        db.session.add(TestAttempt(
            user_id=1,
            test_id=test_objects[1].id, # Amazon
            score=82,
            date_attempted=datetime.now() - timedelta(days=2),
            status="Completed"
        ))
         
        # Additional history for analytics
        db.session.add(TestAttempt(user_id=1, test_id=test_objects[2].id, score=60, date_attempted=datetime.now() - timedelta(days=10), status="Completed"))
        db.session.add(TestAttempt(user_id=1, test_id=test_objects[0].id, score=65, date_attempted=datetime.now() - timedelta(days=8), status="Completed"))
        
        # 4.5 Make the tests look active (fake attempts)
        # We don't need to add rows for this, the model counts rows. 
        # But user wants it to LOOK real.
        # Solution: We will rely on the real attempts we just added.

        material_data = [
            # TCS
            {"title": "TCS NQT Official Syllabus & Pattern", "type": "Article", "sub": "Technical", "meta": "Official", "company": "TCS", "url": "https://learning.tcsionhub.in/hub/national-qualifier-test/"},
            {"title": "TCS NQT Previous Year Questions", "type": "Practice", "sub": "Aptitude", "meta": "GeeksforGeeks", "company": "TCS", "url": "https://www.geeksforgeeks.org/tcs-nqt-placement-papers/"},
            
            # Infosys
            {"title": "Infosys Springboard (InfyTQ)", "type": "Course", "sub": "Coding", "meta": "Official", "company": "Infosys", "url": "https://infyspringboard.onwingspan.com/"},
            {"title": "Infosys Interview Experience Archive", "type": "Article", "sub": "Interview", "meta": "GeeksforGeeks", "company": "Infosys", "url": "https://www.geeksforgeeks.org/tag/infosys-interview-experience/"},
            
            # IBM
            {"title": "IBM Cognitive Ability Assessment Guide", "type": "Guide", "sub": "Aptitude", "meta": "Practice Tests", "company": "IBM", "url": "https://www.practiceaptitudetests.com/employers/ibm-assessments/"},
            {"title": "IBM Coding Assessment Questions", "type": "Practice", "sub": "Coding", "meta": "PrepInsta", "company": "IBM", "url": "https://prepinsta.com/ibm/coding-questions/"},
            
            # Google
            {"title": "Google System Design Interview Guide", "type": "Video", "sub": "Technical", "meta": "Ex-Google", "company": "Google", "url": "https://www.youtube.com/watch?v=bUHFg8CZFws"},
            {"title": "LeetCode Top Google Questions", "type": "Practice", "sub": "Coding", "meta": "LeetCode", "company": "Google", "url": "https://leetcode.com/company/google/"},
            
            # Amazon
            {"title": "Amazon Leadership Principles", "type": "Article", "sub": "HR", "meta": "Essential", "company": "Amazon", "url": "https://www.amazon.jobs/content/en/our-workplace/leadership-principles"},
            {"title": "Striver's SDE Sheet (DSA)", "type": "Sheet", "sub": "Coding", "meta": "Must Do", "company": "All", "url": "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/"},
            
            # General
            {"title": "Top 100 SQL Interview Questions", "type": "Article", "sub": "Technical", "meta": "GeeksforGeeks", "company": "All", "url": "https://www.geeksforgeeks.org/sql-interview-questions/"},
            {"title": "System Design Primer", "type": "Repo", "sub": "Design", "meta": "GitHub", "company": "All", "url": "https://github.com/donnemartin/system-design-primer"}
        ]

        for m in material_data:
            db.session.add(Material(
                title=m["title"],
                type=m["type"],
                subject=m["sub"],
                meta_info=m["meta"],
                company=m.get("company"),
                url=m.get("url", "#")
            ))

        db.session.commit()

        # 5. Create Code Problems
        problems = [
            {
                "title": "Two Sum",
                "desc": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                "diff": "Easy",
                "topic": "Arrays",
                "comp": "Google,Amazon,Facebook",
                "hint": "Use a hash map to store the complement of each number as you iterate."
            },
            {
                "title": "Reverse Linked List",
                "desc": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
                "diff": "Easy",
                "topic": "Linked List",
                "comp": "Microsoft,Amazon,TCS",
                "hint": "Iterate through the list and change the next pointer of each node to point to the previous node."
            },
            {
                "title": "Longest Substring Without Repeating Characters",
                "desc": "Given a string s, find the length of the longest substring without repeating characters.",
                "diff": "Medium",
                "topic": "Strings",
                "comp": "Google,Facebook,Microsoft",
                "hint": "Use a sliding window approach with a set or hash map to track characters in the current window."
            },
            {
                "title": "Valid Parentheses",
                "desc": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
                "diff": "Easy",
                "topic": "Stack",
                "comp": "Facebook,Amazon,Bloomberg",
                "hint": "Use a stack to keep track of opening brackets and check if the closing brackets match."
            },
            {
                "title": "Maximum Subarray",
                "desc": "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
                "diff": "Medium",
                "topic": "Arrays",
                "comp": "LinkedIn,Amazon,Apple",
                "hint": "Use Kadane's Algorithm to find the maximum sum ending at each position."
            },
            {
                "title": "Merge Intervals",
                "desc": "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
                "diff": "Medium",
                "topic": "Sorting",
                "comp": "Google,Uber,Salesforce",
                "hint": "Sort the intervals by their start times and then iterate to merge overlaps."
            },
            {
                "title": "Climbing Stairs",
                "desc": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
                "diff": "Easy",
                "topic": "DP",
                "comp": "Amazon,Google,Adobe",
                "hint": "This is a classic Dynamic Programming problem. The number of ways to reach step i is the sum of ways to reach step i-1 and i-2."
            },
            {
                "title": "Binary Tree Level Order Traversal",
                "desc": "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
                "diff": "Medium",
                "topic": "Tree",
                "comp": "Facebook,Microsoft,Amazon",
                "hint": "Use a queue to perform a Breadth-First Search (BFS)."
            },
            {
                "title": "Best Time to Buy and Sell Stock",
                "desc": "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
                "diff": "Easy",
                "topic": "Arrays",
                "comp": "Amazon,Facebook,Google",
                "hint": "Track the minimum price seen so far and calculate the potential profit at each day."
            },
            {
                "title": "Find Duplicate Number",
                "desc": "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums, return this repeated number.",
                "diff": "Medium",
                "topic": "Arrays",
                "comp": "Amazon,Microsoft",
                "hint": "You can use the Tortoise and Hare (Floyd's Cycle Detection) algorithm."
            },
            {
                "title": "LRU Cache",
                "desc": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
                "diff": "Hard",
                "topic": "Design",
                "comp": "Amazon,Google,Facebook",
                "hint": "Use a combination of a Doubly Linked List and a Hash Map."
            },
            {
                "title": "N-Queens",
                "desc": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.",
                "diff": "Hard",
                "topic": "Backtracking",
                "comp": "Facebook,Amazon,Google",
                "hint": "Use backtracking to place queens row by row, ensuring no conflicts."
            }
        ]
        
        # from app.models import CodeProblem
        
        for p in problems:
            prob = CodeProblem(
                title=p["title"],
                description=p["desc"],
                difficulty=p["diff"],
                topic=p["topic"],
                companies=p["comp"],
                hint=p["hint"]
            )
            db.session.add(prob)

        db.session.commit()
        print("Database seeded successfully with Code Problems!")

if __name__ == "__main__":
    seed_data()
