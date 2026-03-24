from flask import Blueprint, jsonify, request, session
from app.models import db, MockTest, Question, TestAttempt, User
from datetime import datetime
import json

bp = Blueprint('tests', __name__, url_prefix='/api/student/tests')

@bp.route('/', methods=['GET'])
def get_tests():
    user_id = session.get('user_id')
    # Get all tests
    tests = MockTest.query.all()
    
    # Get user's attempts if user_id exists
    user_attempts = []
    if user_id:
        attempts_objs = TestAttempt.query.filter_by(user_id=user_id).all()
        user_attempts = [{
            'test_id': a.test_id,
            'score': a.score,
            'status': a.status,
            'date': a.date_attempted.strftime('%Y-%m-%d'),
            'attempt_id': a.id
        } for a in attempts_objs]
        
    return jsonify({
        "tests": [t.to_dict() for t in tests],
        "user_attempts": user_attempts
    })

@bp.route('/<int:test_id>', methods=['GET'])
def get_test_details(test_id):
    test = MockTest.query.get_or_404(test_id)
    questions = [{
        'id': q.id,
        'text': q.text,
        'options': q.options, # JSON string, frontend should parse
        'marks': q.marks
    } for q in test.questions]
    
    return jsonify({
        'test': test.to_dict(),
        'questions': questions
    })

@bp.route('/submit', methods=['POST'])
def submit_test():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.json
    test_id = data.get('testId')
    answers = data.get('answers') # Dict of {question_id: selected_option_index}
    
    test = MockTest.query.get_or_404(test_id)
    questions = {q.id: q for q in test.questions}
    
    total_score = 0
    max_score = 0
    
    for q_id, q in questions.items():
        max_score += q.marks
        user_ans = answers.get(str(q_id))
        
        map_idx_to_char = ['A', 'B', 'C', 'D']
        if user_ans is not None and 0 <= user_ans < 4:
            selected_char = map_idx_to_char[user_ans]
            if selected_char == q.correct_option:
                total_score += q.marks
                
    # Calculate percentage
    percentage = (total_score / max_score) * 100 if max_score > 0 else 0
    
    # Check if this is a retake (for dashboard logic)
    # We don't need to do anything special here in the DB model unless we added a flag.
    # The dashboard calculation will handle filtering for the first attempt.
    
    # Save Attempt
    attempt = TestAttempt(
        user_id=user_id,
        test_id=test_id,
        score=int(percentage),
        max_score=100,
        answers=json.dumps(answers), # Save user answers
        status='Completed'
    )
    db.session.add(attempt)
    db.session.commit()
    
    return jsonify({
        'score': int(percentage),
        'totalScore': total_score,
        'maxScore': max_score,
        'attemptId': attempt.id
    })

@bp.route('/attempt/<int:attempt_id>', methods=['GET'])
def get_attempt_details(attempt_id):
    attempt = TestAttempt.query.get_or_404(attempt_id)
    test = attempt.test
    
    # helper to parse json safely
    try:
        user_answers = json.loads(attempt.answers) if attempt.answers else {}
    except:
        user_answers = {}

    questions_data = []
    for q in test.questions:
        try:
            options = json.loads(q.options)
        except:
            options = []
            
        questions_data.append({
            'id': q.id,
            'text': q.text,
            'options': options,
            'correctOption': q.correct_option, # 'A', 'B', 'C', 'D'
            'userAnswer': user_answers.get(str(q.id)), # index 0-3 or None
            'marks': q.marks
        })
        
    return jsonify({
        'attempt': {
            'id': attempt.id,
            'score': attempt.score,
            'date': attempt.date_attempted.strftime('%b %d, %Y %H:%M'),
            'totalQuestions': len(test.questions),
            'correctCount': sum(1 for q in questions_data if _is_correct(q['userAnswer'], q['correctOption']))
        },
        'test': {
            'title': test.title,
            'category': test.category
        },
        'questions': questions_data
    })

def _is_correct(user_idx, correct_char):
    if user_idx is None: return False
    map_idx_to_char = ['A', 'B', 'C', 'D']
    if 0 <= user_idx < 4:
        return map_idx_to_char[user_idx] == correct_char
    return False
