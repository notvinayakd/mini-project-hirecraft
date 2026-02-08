from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from extensions import mysql

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data["name"]
    email = data["email"]
    password = generate_password_hash(data["password"])

    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO users (name, email, password) VALUES (%s,%s,%s)",
        (name, email, password)
    )
    mysql.connection.commit()

    return jsonify({"message": "User registered successfully"})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if user and check_password_hash(user[3], password):
        token = create_access_token(identity=str(user[0]))

        return jsonify({"token": token, "role": user[4]})

    return jsonify({"message": "Invalid credentials"}), 401
