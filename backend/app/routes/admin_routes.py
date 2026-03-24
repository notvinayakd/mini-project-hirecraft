from flask import Blueprint, jsonify, request
import json
from datetime import datetime, timedelta
from sqlalchemy import func
from app.models import User, MockTest, PlacementDrive, TestAttempt, Question, Material, CodeProblem
from app.decorators import admin_required
from app.extensions import db
import bcrypt

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    total_students = User.query.filter_by(role='student').count()
    total_questions = Question.query.count()
    active_drives = PlacementDrive.query.count()
    total_attempts = TestAttempt.query.count()
    
    # Weekly student growth
    a_week_ago = datetime.utcnow() - timedelta(days=7)
    # Using the new created_at field
    new_students_week = User.query.filter(User.role == 'student', User.created_at >= a_week_ago).count()
    
    return jsonify({
        "totalStudents": total_students,
        "totalQuestions": total_questions,
        "activeDrives": active_drives,
        "totalAttempts": total_attempts,
        "weeklyGrowth": new_students_week
    })

def to_ist(dt):
    if not dt:
        return "N/A"
    # Convert UTC to IST (UTC + 5:30)
    ist_time = dt + timedelta(hours=5, minutes=30)
    return ist_time.strftime('%Y-%m-%d %H:%M')

@bp.route('/activity', methods=['GET'])
@admin_required
def get_activity():
    # Fetch recent test attempts
    recent_attempts = TestAttempt.query.order_by(TestAttempt.date_attempted.desc()).limit(5).all()
    # Fetch recent registrations
    recent_users = User.query.filter_by(role='student').order_by(User.id.desc()).limit(5).all()
    # Fetch recent drives
    recent_drives = PlacementDrive.query.order_by(PlacementDrive.date.desc()).limit(5).all()
    
    activities = []
    
    for attempt in recent_attempts:
        activities.append({
            "type": "attempt",
            "text": f"Test '{attempt.test.title}' completed by {attempt.user.name} (Scored {attempt.score}%)",
            "time": to_ist(attempt.date_attempted),
            "category": attempt.test.category
        })
        
    for user in recent_users:
        activities.append({
            "type": "registration",
            "text": f"New student registered: {user.name}",
            "time": to_ist(user.created_at),
            "category": user.branch
        })
        
    for drive in recent_drives:
        activities.append({
            "type": "drive",
            "text": f"New Drive: {drive.company} for {drive.role}",
            "time": drive.date.strftime('%Y-%m-%d'), # Date objects don't have time, keeping as is
            "category": "Placement"
        })
        
    # Sort by time (this is tricky with mixed formats, but let's just return them)
    return jsonify(activities)

# --- Question Bank Management ---

@bp.route('/questions', methods=['GET'])
@admin_required
def get_questions():
    questions = Question.query.all()
    # For list view, we might not need all details, but let's send them
    return jsonify([{
        'id': q.id,
        'text': q.text,
        'options': json.loads(q.options),
        'correctOption': q.correct_option,
        'category': q.test.category if q.test else 'Uncategorized',
        'test_id': q.test_id,
        'test_title': q.test_title if hasattr(q, 'test_title') else (q.test.title if q.test else 'N/A'),
        'marks': q.marks
    } for q in questions])

@bp.route('/questions', methods=['POST'])
@admin_required
def add_question():
    data = request.json
    try:
        # Currently questions are tied to a test. We need a test_id.
        # If we want a global bank, we might need to adjust the model or create a "Bank" test container.
        # For this phase, let's assume adding to a specific Test ID or a default "Bank" Test.
        
        test_id = data.get('test_id')
        if not test_id:
            # Fallback or Error? Let's check if we have a "Question Bank" mock test
            bank_test = MockTest.query.filter_by(title="General Question Bank").first()
            if not bank_test:
                bank_test = MockTest(title="General Question Bank", category="General", difficulty="Mixed", duration=0, questions_count=0)
                db.session.add(bank_test)
                db.session.commit()
            test_id = bank_test.id

        new_q = Question(
            test_id=test_id,
            text=data['text'],
            options=json.dumps(data['options']), # Expecting list
            correct_option=data['correctOption'], # 'A', 'B', etc.
            marks=data.get('marks', 1)
        )
        db.session.add(new_q)
        
        # Update test question count
        test = MockTest.query.get(test_id)
        if test:
            test.questions_count = (int(test.questions_count) if test.questions_count else 0) + 1
        
        db.session.commit()
        return jsonify({"message": "Question added successfully", "id": new_q.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/questions/<int:id>', methods=['DELETE'])
@admin_required
def delete_question(id):
    q = Question.query.get_or_404(id)
    try:
        test = q.test
        if test:
            current_count = int(test.questions_count) if test.questions_count is not None else 0
            test.questions_count = current_count + 1
        
        db.session.delete(q)
        db.session.commit()
        return jsonify({"message": "Question deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/questions/<int:id>', methods=['PUT'])
@admin_required
def update_question(id):
    q = Question.query.get_or_404(id)
    data = request.json
    try:
        q.text = data.get('text', q.text)
        if 'options' in data:
            q.options = json.dumps(data['options'])
        q.correct_option = data.get('correctOption', q.correct_option)
        q.marks = data.get('marks', q.marks)
        
        db.session.commit()
        return jsonify({"message": "Question updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/questions/upload', methods=['POST'])
@admin_required
def upload_questions():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only CSV files are supported at the moment"}), 400

    try:
        import csv
        import io
        
        # Read file
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.DictReader(stream)
        
        count = 0
        errors = []
        
        # Check if a specific test_id was provided
        target_test_id = request.form.get('test_id')
        target_test = None
        
        if target_test_id:
            target_test = MockTest.query.get(target_test_id)
        
        # If no specific test or test not found, use/create the "General Question Bank"
        if not target_test:
            target_test = MockTest.query.filter_by(title="General Question Bank").first()
            if not target_test:
                target_test = MockTest(title="General Question Bank", category="General", difficulty="Mixed", duration=0, questions_count=0)
                db.session.add(target_test)
                db.session.commit()
            
        for row in csv_input:
            try:
                # Expected format: text, optionA, optionB, optionC, optionD, correctOption, marks
                options = [row.get('optionA'), row.get('optionB'), row.get('optionC'), row.get('optionD')]
                
                new_q = Question(
                    test_id=target_test.id,
                    text=row.get('text'),
                    options=json.dumps(options),
                    correct_option=row.get('correctOption', 'A').upper(),
                    marks=int(row.get('marks', 1))
                )
                db.session.add(new_q)
                count = count + 1
            except Exception as row_err:
                errors.append(f"Row error: {str(row_err)}")
        
        target_test.questions_count = (int(target_test.questions_count) if target_test.questions_count else 0) + count
        db.session.commit()
        
        return jsonify({
            "message": f"Successfully uploaded {count} questions",
            "errors": errors
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# --- Mock Test Management ---

@bp.route('/tests', methods=['GET'])
@admin_required
def get_admin_tests():
    tests = MockTest.query.all()
    return jsonify([t.to_dict() for t in tests])

@bp.route('/tests', methods=['POST'])
@admin_required
def add_test():
    data = request.json
    try:
        new_test = MockTest(
            title=data['title'],
            category=data['category'],
            difficulty=data.get('difficulty', 'Medium'),
            duration=int(data.get('duration', 30)),
            description=data.get('description', ''),
            questions_count=0
        )
        db.session.add(new_test)
        db.session.commit()
        return jsonify({"message": "Test created successfully", "id": new_test.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/tests/<int:id>', methods=['PUT'])
@admin_required
def update_test(id):
    test = MockTest.query.get_or_404(id)
    data = request.json
    try:
        test.title = data.get('title', test.title)
        test.category = data.get('category', test.category)
        test.difficulty = data.get('difficulty', test.difficulty)
        test.duration = int(data.get('duration', test.duration))
        test.description = data.get('description', test.description)
        
        db.session.commit()
        return jsonify({"message": "Test updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/tests/<int:id>', methods=['DELETE'])
@admin_required
def delete_test(id):
    test = MockTest.query.get_or_404(id)
    try:
        # Delete related questions first or cascade?
        # For now, let's keep it simple. If questions exist, it might fail due to FK.
        db.session.delete(test)
        db.session.commit()
        return jsonify({"message": "Test deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# --- Placement Drive Management ---

@bp.route('/drives', methods=['GET'])
@admin_required
def get_drives():
    drives = PlacementDrive.query.all()
    return jsonify([d.to_dict() for d in drives])

@bp.route('/drives', methods=['POST'])
@admin_required
def add_drive():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    try:
        company_name = str(data.get('company', ''))
        drive_date_str = str(data.get('date', ''))
        new_drive = PlacementDrive(
            company=company_name,
            role=str(data.get('role', '')),
            ctc=data.get('ctc'),
            location=data.get('location'),
            date=datetime.strptime(drive_date_str, '%Y-%m-%d').date(),
            type=data.get('type', 'Full Time'),
            description=data.get('description'),
            criteria=data.get('criteria'),
            logo_initial=company_name[:2].upper() if company_name else "HC",
            google_form_link=data.get('googleFormLink'),
            is_active=data.get('isActive', True),
            min_cgpa=data.get('minCGPA', '0.0')
        )
        db.session.add(new_drive)
        db.session.commit()
        return jsonify({"message": "Drive posted successfully", "id": new_drive.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/drives/<int:id>', methods=['PUT'])
@admin_required
def update_drive(id):
    drive = PlacementDrive.query.get_or_404(id)
    data = request.json
    try:
        drive.company = data.get('company', drive.company)
        drive.role = data.get('role', drive.role)
        drive.ctc = data.get('ctc', drive.ctc)
        drive.location = data.get('location', drive.location)
        if 'date' in data:
            drive.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        drive.type = data.get('type', drive.type)
        drive.description = data.get('description', drive.description)
        drive.criteria = data.get('criteria', drive.criteria)
        if 'company' in data:
            drive.logo_initial = str(data['company'][0:2]).upper()
        drive.google_form_link = data.get('googleFormLink', drive.google_form_link)
        drive.is_active = data.get('isActive', drive.is_active)
        drive.min_cgpa = data.get('minCGPA', drive.min_cgpa)
        
        db.session.commit()
        return jsonify({"message": "Drive updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/drives/<int:drive_id>/toggle', methods=['PATCH'])
@admin_required
def toggle_drive(drive_id):
    drive = PlacementDrive.query.get_or_404(drive_id)
    drive.is_active = not drive.is_active
    db.session.commit()
    return jsonify({"message": f"Drive status updated to {'Active' if drive.is_active else 'Closed'}", "isActive": drive.is_active})

@bp.route('/drives/<int:id>', methods=['DELETE'])
@admin_required
def delete_drive(id):
    drive = PlacementDrive.query.get_or_404(id)
    try:
        db.session.delete(drive)
        db.session.commit()
        return jsonify({"message": "Drive deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# --- Student Management ---

@bp.route('/students', methods=['GET'])
@admin_required
def get_students():
    students = User.query.filter_by(role='student').all()
    return jsonify([s.to_dict() for s in students])

@bp.route('/students/<int:id>', methods=['DELETE'])
@admin_required
def delete_student(id):
    student = User.query.get_or_404(id)
    if student.role == 'admin':
        return jsonify({"error": "Cannot delete admin"}), 403
    try:
        db.session.delete(student)
        db.session.commit()
        return jsonify({"message": "Student deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# --- Admin Management ---

@bp.route('/admins', methods=['GET'])
@admin_required
def get_admins():
    admins = User.query.filter_by(role='admin').all()
    return jsonify([{
        'id': u.id,
        'name': u.name,
        'email': u.email
    } for u in admins])

@bp.route('/admins', methods=['POST'])
@admin_required
def add_admin():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    if not all([email, password, name]):
        return jsonify({"error": "Missing fields"}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 409
        
    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        new_admin = User(
            name=name,
            email=email,
            password_hash=hashed_password,
            role='admin'
        )
        db.session.add(new_admin)
        db.session.commit()
        
        return jsonify({"message": "Admin added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Material Management
@bp.route('/materials', methods=['GET'])
@admin_required
def get_admin_materials():
    materials = Material.query.all()
    return jsonify([m.to_dict() for m in materials])

@bp.route('/materials', methods=['POST'])
@admin_required
def add_material():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    try:
        new_material = Material(
            title=data.get('title'),
            type=data.get('type', 'Article'),
            subject=data.get('subject'),
            url=data.get('url'),
            meta_info=data.get('meta'),
            company=data.get('company')
        )
        db.session.add(new_material)
        db.session.commit()
        return jsonify({"message": "Material added successfully", "id": new_material.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/materials/<int:id>', methods=['PUT'])
@admin_required
def update_material(id):
    material = Material.query.get_or_404(id)
    data = request.json
    try:
        material.title = data.get('title', material.title)
        material.type = data.get('type', material.type)
        material.subject = data.get('subject', material.subject)
        material.url = data.get('url', material.url)
        material.meta_info = data.get('meta', material.meta_info)
        material.company = data.get('company', material.company)
        
        db.session.commit()
        return jsonify({"message": "Material updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/materials/<int:id>', methods=['DELETE'])
@admin_required
def delete_material(id):
    material = Material.query.get_or_404(id)
    try:
        db.session.delete(material)
        db.session.commit()
        return jsonify({"message": "Material deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# --- Code Practice Management ---

@bp.route('/code-problems', methods=['GET'])
@admin_required
def get_admin_code_problems():
    problems = CodeProblem.query.all()
    return jsonify([p.to_dict() for p in problems])

@bp.route('/code-problems', methods=['POST'])
@admin_required
def add_code_problem():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    try:
        new_problem = CodeProblem(
            title=data.get('title'),
            description=data.get('description'),
            difficulty=data.get('difficulty', 'Medium'),
            topic=data.get('topic'),
            companies=data.get('companies'), # Expecting comma-separated string from frontend
            hint=data.get('hint')
        )
        db.session.add(new_problem)
        db.session.commit()
        return jsonify({"message": "Code problem added successfully", "id": new_problem.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/code-problems/<int:id>', methods=['PUT'])
@admin_required
def update_code_problem(id):
    problem = CodeProblem.query.get_or_404(id)
    data = request.json
    try:
        problem.title = data.get('title', problem.title)
        problem.description = data.get('description', problem.description)
        problem.difficulty = data.get('difficulty', problem.difficulty)
        problem.topic = data.get('topic', problem.topic)
        problem.companies = data.get('companies', problem.companies)
        problem.hint = data.get('hint', problem.hint)
        
        db.session.commit()
        return jsonify({"message": "Code problem updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/code-problems/<int:id>', methods=['DELETE'])
@admin_required
def delete_code_problem(id):
    problem = CodeProblem.query.get_or_404(id)
    try:
        db.session.delete(problem)
        db.session.commit()
        return jsonify({"message": "Code problem deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
