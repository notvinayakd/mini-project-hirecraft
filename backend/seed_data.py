from app import create_app, db
from app.models import User, PlacementDrive, MockTest, TestAttempt, Material
from werkzeug.security import generate_password_hash
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
        student = User(
            name="Alex Morgan",
            email="alex@example.com",
            password_hash=generate_password_hash("password123"),
            branch="Computer Science",
            semester=7,
            phone="+91 9876543210",
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

        # 3. Create Mock Tests
        tests = [
            {"title": "Full Stack Development - Mock 1", "cat": "Technical", "diff": "Hard", "q": 50, "dur": 90},
            {"title": "Data Structures & Algo - Mock 2", "cat": "Coding", "diff": "Medium", "q": 10, "dur": 60},
            {"title": "General Aptitude - Level 1", "cat": "Aptitude", "diff": "Easy", "q": 30, "dur": 45},
            {"title": "Verbal Ability Challenge", "cat": "Verbal", "diff": "Medium", "q": 40, "dur": 45},
            {"title": "React JS Proficiency", "cat": "Technical", "diff": "Medium", "q": 25, "dur": 60},
        ]
        
        test_objects = []
        for t in tests:
            test = MockTest(
                title=t["title"],
                category=t["cat"],
                difficulty=t["diff"],
                duration_mins=t["dur"],
                total_questions=t["q"]
            )
            db.session.add(test)
            test_objects.append(test)
        
        db.session.commit() # Commit to get IDs

        # 4. Create Test Attempts (History)
        # Completed
        db.session.add(TestAttempt(
            user_id=student.id,
            test_id=test_objects[0].id,
            score=85,
            date_attempted=datetime.now() - timedelta(days=5),
            status="Completed"
        ))
        
        # In Progress
        db.session.add(TestAttempt(
            user_id=student.id,
            test_id=test_objects[1].id,
            score=0,
            date_attempted=datetime.now(),
            status="In Progress"
        ))

        material_data = [
            {"title": "TCS NQT Past Papers", "type": "PDF", "sub": "Technical", "meta": "15MB", "company": "TCS", "url": "/tcs_questions.pdf"},
            {"title": "Infosys Power Programmer Guide", "type": "PDF", "sub": "Coding", "meta": "10 min read", "company": "Infosys", "url": "#"},
            {"title": "IBM Cognitive Ability Test", "type": "Video", "sub": "Aptitude", "meta": "45 mins", "company": "IBM", "url": "#"},
            {"title": "Google System Design", "type": "Video", "sub": "Technical", "meta": "5MB", "company": "Google", "url": "#"},
            {"title": "Amazon Leadership Principles", "type": "Article", "sub": "HR", "meta": "30 mins", "company": "Amazon", "url": "#"},
            {"title": "TCS Digital Coding Questions", "type": "PDF", "sub": "Coding", "meta": "12MB", "company": "TCS", "url": "#"},
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
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
