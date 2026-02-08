from flask import Blueprint, request, jsonify
from extensions import mysql
from flask_jwt_extended import jwt_required

company_bp = Blueprint('company', __name__)

@company_bp.route("/add", methods=["POST"])
@jwt_required()
def add_company():
    data = request.json
    name = data["name"]
    description = data["description"]
    pattern = data["pattern"]

    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO companies (name, description, pattern) VALUES (%s,%s,%s)",
        (name, description, pattern)
    )
    mysql.connection.commit()

    return jsonify({"message": "Company added successfully"})
@company_bp.route("/all", methods=["GET"])
def get_all_companies():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, name, description, pattern FROM companies")
    rows = cursor.fetchall()

    companies = []
    for row in rows:
        companies.append({
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "pattern": row[3]
        })

    return jsonify(companies)

