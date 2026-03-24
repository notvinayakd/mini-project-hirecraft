from flask import Blueprint, jsonify, request
from app.models import Material

bp = Blueprint('prep', __name__, url_prefix='/api/student/prep')


@bp.route('/materials', methods=['GET'])
def get_materials():
    type_filter = request.args.get('type')
    company_filter = request.args.get('company')

    query = Material.query

    if type_filter and type_filter != 'All':
        query = query.filter_by(type=type_filter)

    if company_filter and company_filter != 'All':
        query = query.filter_by(company=company_filter)

    materials = query.all()
    return jsonify([m.to_dict() for m in materials])
