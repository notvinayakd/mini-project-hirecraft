from flask import Blueprint, jsonify, request
from app.models import CodeProblem

bp = Blueprint('practice', __name__, url_prefix='/api/student/practice')


@bp.route('/problems', methods=['GET'])
def get_problems():
    topic = request.args.get('topic')
    difficulty = request.args.get('difficulty')
    company = request.args.get('company')

    query = CodeProblem.query

    if topic and topic != 'All':
        query = query.filter_by(topic=topic)
    if difficulty and difficulty != 'All':
        query = query.filter_by(difficulty=difficulty)
    if company and company != 'All':
        query = query.filter(CodeProblem.companies.like(f'%{company}%'))

    problems = query.all()
    return jsonify([p.to_dict() for p in problems])


@bp.route('/problems/<int:id>', methods=['GET'])
def get_problem_detail(id):
    problem = CodeProblem.query.get_or_404(id)
    return jsonify(problem.to_dict())
