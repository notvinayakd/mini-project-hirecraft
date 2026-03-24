from flask import Blueprint, jsonify, request, session
from app.models import db, MockTest, Question, TestAttempt
from app.decorators import login_required
import json

bp = Blueprint('tests', __name__, url_prefix='/api/student/tests')

OPTION_MAP = ['A', 'B', 'C', 'D']


@bp.route('/', methods=['GET'])
def get_tests():
    user_id = session.get('user_id')
    tests = MockTest.query.all()

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
        'options': q.options,
        'marks': q.marks
    } for q in test.questions]

    return jsonify({
        'test': test.to_dict(),
        'questions': questions
    })


@bp.route('/submit', methods=['POST'])
@login_required
def submit_test():
    user_id = session.get('user_id')
    data = request.get_json()
    test_id = data.get('testId')
    answers = data.get('answers')

    test = MockTest.query.get_or_404(test_id)
    questions = {q.id: q for q in test.questions}

    total_score = 0
    max_score = 0

    for q_id, q in questions.items():
        max_score += q.marks
        user_ans = answers.get(str(q_id))

        if user_ans is not None and 0 <= user_ans < 4:
            if OPTION_MAP[user_ans] == q.correct_option:
                total_score += q.marks

    percentage = (total_score / max_score) * 100 if max_score > 0 else 0

    try:
        attempt = TestAttempt(
            user_id=user_id,
            test_id=test_id,
            score=int(percentage),
            max_score=100,
            answers=json.dumps(answers),
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
    except Exception as e:
        db.session.rollback()
        print(f"Test submit error: {e}")
        return jsonify({"error": "An internal error occurred"}), 500


@bp.route('/attempt/<int:attempt_id>', methods=['GET'])
def get_attempt_details(attempt_id):
    attempt = TestAttempt.query.get_or_404(attempt_id)
    test = attempt.test

    try:
        user_answers = json.loads(attempt.answers) if attempt.answers else {}
    except (json.JSONDecodeError, ValueError):
        user_answers = {}

    questions_data = []
    for q in test.questions:
        try:
            options = json.loads(q.options)
        except (json.JSONDecodeError, ValueError):
            options = []

        questions_data.append({
            'id': q.id,
            'text': q.text,
            'options': options,
            'correctOption': q.correct_option,
            'userAnswer': user_answers.get(str(q.id)),
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
    """Check if the user's selected option index matches the correct option letter."""
    if user_idx is None:
        return False
    if 0 <= user_idx < 4:
        return OPTION_MAP[user_idx] == correct_char
    return False
