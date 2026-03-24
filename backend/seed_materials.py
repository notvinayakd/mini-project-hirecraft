from app import create_app
from app.extensions import db
from app.models import Material

def seed_materials():
    app = create_app()
    with app.app_context():
        # Clear existing materials to avoid duplicates
        # Material.query.delete()
        
        materials_data = [
            {
                "title": "TCS NQT Preparation Guide - Comprehensive 2026",
                "type": "Guide",
                "subject": "Aptitude",
                "company": "TCS",
                "url": "https://www.geeksforgeeks.org/tcs-nqt-preparation-guide/",
                "meta": "140+ Questions"
            },
            {
                "title": "Infosys Technical Interview Questions & Answers",
                "type": "Article",
                "subject": "Technical",
                "company": "Infosys",
                "url": "https://www.javatpoint.com/infosys-interview-questions",
                "meta": "Top 50 Q&A"
            },
            {
                "title": "Data Structures & Algorithms Masterclass",
                "type": "Video",
                "subject": "Programming",
                "company": "Google",
                "url": "https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTtf6",
                "meta": "45 Hours"
            },
            {
                "title": "IBM Cognitive Assessment Preparation",
                "type": "PDF",
                "subject": "Cognitive",
                "company": "IBM",
                "url": "https://www.prepdocs.com/ibm-assessment/",
                "meta": "Sample Papers"
            },
            {
                "title": "Amazon Leadership Principles Deep Dive",
                "type": "Article",
                "subject": "Behavioral",
                "company": "Amazon",
                "url": "https://www.scarlettink.com/amazon-leadership-principles-deep-dive/",
                "meta": "Must Read"
            }
        ]

        for data in materials_data:
            # Check if material exists
            exists = Material.query.filter_by(title=data['title']).first()
            if not exists:
                m = Material(
                    title=data['title'],
                    type=data['type'],
                    subject=data['subject'],
                    company=data['company'],
                    url=data['url'],
                    meta_info=data['meta']
                )
                db.session.add(m)
        
        db.session.commit()
        print("Production materials seeded successfully!")

if __name__ == "__main__":
    seed_materials()
