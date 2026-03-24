from flask import Blueprint, jsonify, session, request
from app.models import User, PlacementDrive, TestAttempt, db
from app.decorators import login_required
from datetime import datetime

bp = Blueprint('dashboard', __name__, url_prefix='/api/student')


@bp.route('/dashboard', methods=['GET'])
@login_required
def get_dashboard_data():
    user_id = session.get('user_id')
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    profile_data = {
        "name": user.name,
        "branch": user.branch,
        "semester": user.semester
    }

    attempts = TestAttempt.query.filter_by(user_id=user.id).order_by(TestAttempt.date_attempted).all()

    # Only the first attempt per test counts for official stats
    unique_attempts_map = {}
    for a in attempts:
        if a.test_id not in unique_attempts_map:
            unique_attempts_map[a.test_id] = a

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

    # Average score per category for pie chart
    category_scores = {}
    for a in completed_official:
        cat = a.test.category
        if cat not in category_scores:
            category_scores[cat] = []
        category_scores[cat].append(a.score)

    pie_data = [
        {"name": cat, "value": int(sum(scores) / len(scores))}
        for cat, scores in category_scores.items()
    ]

    # Recent official scores for bar chart
    recent_official = sorted(completed_official, key=lambda x: x.date_attempted)[-5:]
    bar_data = [{"name": a.test.title, "score": a.score} for a in recent_official]

    # Recent attempts (all, including retakes) for activity feed
    latest_attempts_objs = sorted(attempts, key=lambda x: x.date_attempted, reverse=True)[:5]
    recent_attempts = [{
        "id": a.id,
        "testName": a.test.title,
        "category": a.test.category,
        "date": a.date_attempted.strftime('%b %d, %Y'),
        "score": a.score,
        "status": a.status,
        "totalQuestions": a.test.questions_count
    } for a in latest_attempts_objs]

    upcoming_drives = PlacementDrive.query.filter(
        PlacementDrive.date >= datetime.now().date()
    ).order_by(PlacementDrive.date).limit(3).all()
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
@login_required
def handle_profile():
    user_id = session.get('user_id')
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
            "skills": [s.strip() for s in user.skills.split(',')] if user.skills else [],
            "resume": user.resume_link,
            "about": user.about
        })

    if request.method == 'PUT':
        data = request.get_json()

        if 'phone' in data:
            user.phone = data['phone']
        if 'location' in data:
            user.location = data['location']
        if 'about' in data:
            user.about = data['about']
        if 'skills' in data:
            skills = data['skills']
            if isinstance(skills, list):
                user.skills = ",".join([s.strip() for s in skills])
            elif isinstance(skills, str):
                user.skills = ",".join([s.strip() for s in skills.split(',')])

        try:
            db.session.commit()
            return jsonify({"message": "Profile updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Profile update error: {e}")
            return jsonify({"error": "An internal error occurred"}), 500


@bp.route('/drives', methods=['GET'])
@login_required
def get_student_drives():
    drives = PlacementDrive.query.all()
    return jsonify([d.to_dict() for d in drives])
