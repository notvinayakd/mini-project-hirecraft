from app.extensions import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='student')
    branch = db.Column(db.String(50))
    semester = db.Column(db.Integer)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    gpa = db.Column(db.String(10), default="0.0")
    skills = db.Column(db.Text)
    resume_link = db.Column(db.String(255))
    about = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    test_attempts = db.relationship('TestAttempt', backref='user', lazy=True, cascade='all, delete-orphan')

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
            'skills': [s.strip() for s in self.skills.split(',')] if self.skills else [],
            'about': self.about,
            'createdAt': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
        }


class PlacementDrive(db.Model):
    __tablename__ = 'placement_drives'

    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    ctc = db.Column(db.String(50))
    location = db.Column(db.String(100))
    date = db.Column(db.Date, nullable=False)
    type = db.Column(db.String(50))
    description = db.Column(db.Text)
    criteria = db.Column(db.String(200))
    logo_initial = db.Column(db.String(2))
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
    category = db.Column(db.String(50), nullable=False)
    difficulty = db.Column(db.String(20))
    questions_count = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    description = db.Column(db.Text)

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
    options = db.Column(db.Text, nullable=False)
    correct_option = db.Column(db.String(1), nullable=False)
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
    score = db.Column(db.Integer)
    max_score = db.Column(db.Integer, default=100)
    answers = db.Column(db.Text)
    date_attempted = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20))

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
    type = db.Column(db.String(50))
    subject = db.Column(db.String(50))
    url = db.Column(db.String(255))
    meta_info = db.Column(db.String(50))
    company = db.Column(db.String(50))

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
    difficulty = db.Column(db.String(20))
    topic = db.Column(db.String(50))
    companies = db.Column(db.String(255))
    hint = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'difficulty': self.difficulty,
            'topic': self.topic,
            'companies': [c.strip() for c in self.companies.split(',')] if self.companies else [],
            'hint': self.hint
        }
