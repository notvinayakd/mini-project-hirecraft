from app.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Profile fields
    branch = db.Column(db.String(50))
    semester = db.Column(db.Integer)
    phone = db.Column(db.String(20))
    about = db.Column(db.Text)
    
    # Relationships
    test_attempts = db.relationship('TestAttempt', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

class PlacementDrive(db.Model):
    __tablename__ = 'placement_drives'
    
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    ctc = db.Column(db.String(50))
    location = db.Column(db.String(100))
    date = db.Column(db.Date, nullable=False)
    type = db.Column(db.String(50)) # e.g., 'Full Time', 'Internship'
    description = db.Column(db.Text)
    criteria = db.Column(db.String(200))
    logo_initial = db.Column(db.String(2)) # Store initial instead of image for now
    
    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company,
            'role': self.role,
            'ctc': self.ctc,
            'location': self.location,
            'date': self.date.strftime('%Y-%m-%d'),
            'type': self.type,
            'logo': self.logo_initial
        }

class MockTest(db.Model):
    __tablename__ = 'mock_tests'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False) # Aptitude, Technical, etc.
    difficulty = db.Column(db.String(20)) # Easy, Medium, Hard
    duration_mins = db.Column(db.Integer)
    total_questions = db.Column(db.Integer)
    
    attempts = db.relationship('TestAttempt', backref='test', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'difficulty': self.difficulty,
            'duration': f"{self.duration_mins} mins",
            'questions': self.total_questions
        }

class TestAttempt(db.Model):
    __tablename__ = 'test_attempts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('mock_tests.id'), nullable=False)
    score = db.Column(db.Integer) # Percentage or raw score
    max_score = db.Column(db.Integer, default=100)
    date_attempted = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20)) # 'Completed', 'In Progress'
    
    def to_dict(self):
        return {
            'id': self.id,
            'testTitle': self.test.title,
            'testCategory': self.test.category,
            'score': self.score,
            'date': self.date_attempted.strftime('%b %d, %Y'),
            'status': self.status
        }

class Material(db.Model):
    __tablename__ = 'materials'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50)) # PDF, Video, Article
    subject = db.Column(db.String(50)) # Aptitude, Technical...
    url = db.Column(db.String(255))
    meta_info = db.Column(db.String(50)) # e.g., "140+ Questions", "25 Topics"
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'subject': self.subject,
            'meta': self.meta_info
        }
