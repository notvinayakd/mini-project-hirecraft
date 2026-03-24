from flask import Blueprint, jsonify, session, request
from app.models import User, PlacementDrive, MockTest, TestAttempt, Material, db
from datetime import datetime
from sqlalchemy import func

bp = Blueprint('dashboard', __name__, url_prefix='/api/student')

@bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    user_id = session.get('user_id')
    
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.get(user_id)
        
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile_data = {
        "name": user.name,
        "branch": user.branch,
        "semester": user.semester
    }

    attempts = TestAttempt.query.filter_by(user_id=user.id).order_by(TestAttempt.date_attempted).all()
    
    # Process attempts to keep only the FIRST attempt per test for stats (Anti-Cheating / Official Score)
    unique_attempts_map = {}
    for a in attempts:
        if a.test_id not in unique_attempts_map:
            unique_attempts_map[a.test_id] = a
            
    # These are the "Official" attempts used for stats
    official_attempts = list(unique_attempts_map.values())
    completed_official = [a for a in official_attempts if a.status == 'Completed']
    
    total_tests = len(completed_official)
    avg_score = int(sum(a.score for a in completed_official) / len(completed_official)) if completed_official else 0
    best_score = max((a.score for a in completed_official), default=0)
    
    stats = {
        "testsAttended": total_tests,
        "averageScore": avg_score,
        "bestScore": best_score
    }
    # Pie Chart: Performance by Category (Average score per category based on OFFICIAL attempts)
    # We can't use simple SQL Group By easily now because of the filtering logic.
    # Let's calculate in Python.
    category_scores = {} # {category: [scores]}
    
    for a in completed_official:
        cat = a.test.category
        if cat not in category_scores:
            category_scores[cat] = []
        category_scores[cat].append(a.score)
        
    pie_data = []
    for cat, scores in category_scores.items():
        avg_cat_score = int(sum(scores) / len(scores))
        pie_data.append({"name": cat, "value": avg_cat_score})

    # Sort official attempts by date
    recent_official = sorted(completed_official, key=lambda x: x.date_attempted)[-5:]
    bar_data = [{"name": a.test.title, "score": a.score} for i, a in enumerate(recent_official)]
    # Show ALL attempts history or just official? 
    # User probably wants to see the latest activity here, even if it's a retake.
    # Let's show ALL recent attempts so they can see they just took a test.
    
    latest_attempts_objs = sorted(attempts, key=lambda x: x.date_attempted, reverse=True)[:5]
    recent_attempts = []
    for a in latest_attempts_objs:
        recent_attempts.append({
            "id": a.id,
            "testName": a.test.title,
            "category": a.test.category,
            "date": a.date_attempted.strftime('%b %d, %Y'),
            "score": a.score,
            "status": a.status,
            "totalQuestions": a.test.questions_count
        })

    # Get upcoming 3 drives
    upcoming_drives = PlacementDrive.query.filter(PlacementDrive.date >= datetime.now().date()).order_by(PlacementDrive.date).limit(3).all()
    events = [d.to_dict() for d in upcoming_drives]

    return jsonify({
        "profile": profile_data,
        "stats": stats,
        "graphs": {
            "pie": pie_data,
            "bar": bar_data
        },
        "recentAttempts": recent_attempts,
        "events": events
    })

@bp.route('/profile', methods=['GET', 'PUT'])
def handle_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if request.method == 'GET':
        return jsonify({
            "name": user.name,
            "role": "Student",
            "branch": user.branch,
            "year": f"{user.semester}th Sem",
            "email": user.email,
            "phone": user.phone,
            "location": user.location,
            "gpa": user.gpa,
            "skills": user.skills.split(',') if user.skills else [],
            "resume": user.resume_link,
            "about": user.about
        })
    
    if request.method == 'PUT':
        data = request.get_json()
        
        # Update allowed fields
        if 'phone' in data: user.phone = data['phone']
        if 'location' in data: user.location = data['location']
        if 'about' in data: user.about = data['about']
        if 'skills' in data:
            # Expecting detailed skills array or string, store as comma-separated
            skills = data['skills']
            if isinstance(skills, list):
                user.skills = ",".join([s.strip() for s in skills])
            elif isinstance(skills, str):
                user.skills = ",".join([s.strip() for s in skills.split(',')])
        
        # Read-only or unlikely to change fields for now: Name, Email, Branch, Semester, GPA
        
        try:
            db.session.commit()
            return jsonify({"message": "Profile updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
@bp.route('/drives', methods=['GET'])
def get_student_drives():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
        
    drives = PlacementDrive.query.all()
    # Students see all drives, but the 'isActive' flag on the card will reflect the status
    return jsonify([d.to_dict() for d in drives])
