from flask import Blueprint, jsonify, session
from app.models import User, PlacementDrive, MockTest, TestAttempt, Material, db
from datetime import datetime
from sqlalchemy import func

bp = Blueprint('dashboard', __name__, url_prefix='/api/student')

@bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    # Simulate logged in user if not in session, or get from session
    # For now, we'll fetch the first user (Alex Morgan) as we are in development/demo mode
    # In production: user_id = session.get('user_id')
    user_id = session.get('user_id')
    
    if not user_id:
        # Fallback for demo purposes if session is empty (e.g. strict frontend separation)
        user = User.query.first()
    else:
        user = User.query.get(user_id)
        
    if not user:
        return jsonify({"error": "User not found"}), 404

    # 1. User Profile Data
    profile_data = {
        "name": user.name,
        "branch": user.branch,
        "semester": user.semester
    }

    # 2. Performance Stats
    attempts = TestAttempt.query.filter_by(user_id=user.id).all()
    completed_attempts = [a for a in attempts if a.status == 'Completed']
    
    total_tests = len(attempts)
    avg_score = int(sum(a.score for a in completed_attempts) / len(completed_attempts)) if completed_attempts else 0
    best_score = max((a.score for a in completed_attempts), default=0)
    
    # Calculate rank (dummy logic for now, or comparing with others)
    # real logic: rank = TestAttempt.query.filter(TestAttempt.score > avg_score).count() + 1
    rank = 42 

    stats = {
        "testsAttended": total_tests,
        "averageScore": avg_score,
        "bestScore": best_score,
        "rank": rank
    }

    # 3. Graph Data
    # Pie Chart: Performance by Category (Average score per category)
    category_scores = db.session.query(
        MockTest.category, 
        func.avg(TestAttempt.score)
    ).join(TestAttempt).filter(
        TestAttempt.user_id == user.id, 
        TestAttempt.status == 'Completed'
    ).group_by(MockTest.category).all()
    
    pie_data = [{"name": cat, "value": int(score)} for cat, score in category_scores]
    if not pie_data: # Fallback if empty
        pie_data = []

    # Bar Chart: User's score trend over time (last 5 attempts)
    recent_completed = sorted(completed_attempts, key=lambda x: x.date_attempted, reverse=False)[-5:]
    bar_data = [{"name": f"Test {i+1}", "score": a.score} for i, a in enumerate(recent_completed)]

    # 4. Recent Test Attempts (Progress Section)
    # Get latest 3 attempts
    latest_attempts_objs = sorted(attempts, key=lambda x: x.date_attempted, reverse=True)[:3]
    recent_attempts = []
    for a in latest_attempts_objs:
        recent_attempts.append({
            "id": a.id,
            "testName": a.test.title,
            "category": a.test.category,
            "date": a.date_attempted.strftime('%b %d, %Y'),
            "score": a.score,
            "status": a.status,
            "totalQuestions": a.test.total_questions
        })

    # 5. Upcoming Events (Drives)
    # Get upcoming 3 drives
    upcoming_drives = PlacementDrive.query.filter(PlacementDrive.date >= datetime.now().date()).order_by(PlacementDrive.date).limit(3).all()
    events = [d.to_dict() for d in upcoming_drives]

    # 6. Material Counts
    material_counts = db.session.query(Material.subject, func.count(Material.id)).group_by(Material.subject).all()
    materials_summary = [{"title": sub, "count": f"{count} Resources"} for sub, count in material_counts]

    return jsonify({
        "profile": profile_data,
        "stats": stats,
        "graphs": {
            "pie": pie_data,
            "bar": bar_data
        },
        "recentAttempts": recent_attempts,
        "events": events,
        "materials": materials_summary
    })
