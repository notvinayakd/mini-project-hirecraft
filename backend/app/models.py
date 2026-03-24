from app.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Profile fields
    role = db.Column(db.String(20), default='student') # 'student' or 'admin'
    branch = db.Column(db.String(50))
    semester = db.Column(db.Integer)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    gpa = db.Column(db.String(10), default="0.0")
    skills = db.Column(db.Text) # Store as comma-separated string for simplicity
    resume_link = db.Column(db.String(255))
    about = db.Column(db.Text)
    
    # Relationships
    test_attempts = db.relationship('TestAttempt', backref='user', lazy=True, cascade='all, delete-orphan')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.email}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'branch': self.branch,
            'semester': self.semester,
            'phone': self.phone,
            'location': self.location,
            'gpa': self.gpa,
            'skills': self.skills.split(', ') if self.skills else [],
            'about': self.about,
            'createdAt': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            'year': '4th' # Placeholder helper
        }

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
    google_form_link = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    min_cgpa = db.Column(db.String(10), default="0.0")
    
    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company,
            'role': self.role,
            'ctc': self.ctc,
            'location': self.location,
            'date': self.date.strftime('%Y-%m-%d'),
            'type': self.type,
            'logo': self.logo_initial,
            'googleFormLink': self.google_form_link,
            'isActive': self.is_active,
            'minCGPA': self.min_cgpa
        }

class MockTest(db.Model):
    __tablename__ = 'mock_tests'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False) # Aptitude, Technical, etc.
    difficulty = db.Column(db.String(20)) # Easy, Medium, Hard
    questions_count = db.Column(db.Integer)
    duration = db.Column(db.Integer) # Duration in minutes
    description = db.Column(db.Text)
    
    # Relationships
    questions = db.relationship('Question', backref='test', lazy=True)
    attempts = db.relationship('TestAttempt', backref='test', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'difficulty': self.difficulty,
            'questions': self.questions_count,
            'duration': f"{self.duration} mins" if self.duration else "N/A",
            'attempts': len(self.attempts)
        }

class Question(db.Model):
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey('mock_tests.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    options = db.Column(db.Text, nullable=False) # JSON string: ["Op1", "Op2", "Op3", "Op4"]
    correct_option = db.Column(db.String(1), nullable=False) # 'A', 'B', 'C', 'D' or index 0-3
    marks = db.Column(db.Integer, default=1)

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'options': self.options,
            'marks': self.marks
        }

class TestAttempt(db.Model):
    __tablename__ = 'test_attempts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('mock_tests.id'), nullable=False)
    score = db.Column(db.Integer) # Percentage or raw score
    max_score = db.Column(db.Integer, default=100)
    answers = db.Column(db.Text) # JSON string: {question_id: option_index}
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
    company = db.Column(db.String(50)) # e.g., "TCS", "Infosys", "Google"
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'subject': self.subject,
            'meta': self.meta_info,
            'company': self.company,
            'url': self.url
        }
class CodeProblem(db.Model):
    __tablename__ = 'code_problems'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(20)) # Easy, Medium, Hard
    topic = db.Column(db.String(50)) # Arrays, DP, SQL...
    companies = db.Column(db.String(255)) # Comma-separated: "Google, Amazon"
    hint = db.Column(db.Text) # Solution hint or approach
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'difficulty': self.difficulty,
            'topic': self.topic,
            'companies': self.companies.split(',') if self.companies else [],
            'hint': self.hint
        }
