import json
from datetime import datetime, date, timedelta
from app import create_app
from app.extensions import db
from app.models import MockTest, Question, PlacementDrive

def seed_data():
    app = create_app()
    with app.app_context():
        print("Starting non-destructive seeding...")
        
        # 1. Add specialized Mock Tests
        specialized_tests = [
            {
                "title": "Python Backend Mastery",
                "category": "Technical",
                "difficulty": "Hard",
                "duration": 45,
                "description": "Deep dive into Flask, FastAPI, and SQLAlchemy patterns.",
                "questions": [
                    {
                        "text": "What is the primary purpose of SQLAlchemy's session.flush()?",
                        "options": ["Commit the transaction", "Push changes to the DB without committing", "Clear the session cache", "Rollback changes"],
                        "correctOption": "B",
                        "marks": 2
                    },
                    {
                        "text": "Which of these is NOT a valid Flask request hook?",
                        "options": ["before_request", "after_request", "teardown_request", "on_request_received"],
                        "correctOption": "D",
                        "marks": 2
                    }
                ]
            },
            {
                "title": "React Architecture & Hooks",
                "category": "Technical",
                "difficulty": "Medium",
                "duration": 30,
                "description": "Test your knowledge of advanced React patterns and hook lifecycle.",
                "questions": [
                    {
                        "text": "What does the useMemo hook return?",
                        "options": ["A memoized function", "A memoized value", "A reference to a DOM node", "A state variable"],
                        "correctOption": "B",
                        "marks": 2
                    }
                ]
            }
        ]
        
        for test_data in specialized_tests:
            title = str(test_data["title"])
            existing = MockTest.query.filter_by(title=title).first()
            if not existing:
                print(f"Adding test: {title}")
                test_questions = test_data.get("questions", [])
                
                new_test = MockTest(
                    title=title,
                    category=str(test_data.get("category", "General")),
                    difficulty=str(test_data.get("difficulty", "Medium")),
                    duration=int(test_data.get("duration", 30)),
                    description=str(test_data.get("description", "")),
                    questions_count=len(test_questions)
                )
                db.session.add(new_test)
                db.session.flush() # Get ID
                
                for q_data in test_questions:
                    new_q = Question(
                        test_id=new_test.id,
                        text=str(q_data.get("text", "")),
                        options=json.dumps(q_data.get("options", [])),
                        correct_option=str(q_data.get("correctOption", "A")),
                        marks=int(q_data.get("marks", 1))
                    )
                    db.session.add(new_q)
            else:
                print(f"Test '{title}' already exists. Skipping.")

        # 2. Add New Placement Drives
        new_drives = [
            {
                "company": "Amazon",
                "role": "SDE-1",
                "ctc": "32 LPA",
                "location": "Bangalore / Remote",
                "date": date.today() + timedelta(days=15),
                "type": "Full Time",
                "google_form_link": "https://forms.gle/amazon-fake-link",
                "min_cgpa": 8.0
            },
            {
                "company": "Microsoft",
                "role": "Software Engineer Intern",
                "ctc": "80k / month",
                "location": "Hyderabad",
                "date": date.today() + timedelta(days=7),
                "type": "Internship",
                "google_form_link": None,
                "min_cgpa": 7.5
            }
        ]
        
        for drive_data in new_drives:
            company_name = str(drive_data["company"])
            role_description = str(drive_data["role"])
            existing = PlacementDrive.query.filter_by(company=company_name, role=role_description).first()
            if not existing:
                print(f"Adding drive: {company_name} - {role_description}")
                drive_date = drive_data["date"]
                new_drive = PlacementDrive(
                    company=company_name,
                    role=role_description,
                    ctc=str(drive_data.get("ctc", "")),
                    location=str(drive_data.get("location", "")),
                    date=drive_date,
                    type=str(drive_data.get("type", "Full Time")),
                    logo_initial=str(company_name[:2]).upper(),
                    google_form_link=drive_data.get('google_form_link'),
                    is_active=drive_data.get('is_active', True),
                    min_cgpa=drive_data.get('min_cgpa', 0.0)
                )
                db.session.add(new_drive)
            else:
                print(f"Drive for {company_name} already exists. Skipping.")
                
        db.session.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_data()
