from functools import wraps
from flask import session, jsonify
from app.models import User


def login_required(f):
    """Ensures the user is logged in before accessing the route."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        user = User.query.get(user_id)
        if not user:
            session.clear()
            return jsonify({"error": "Unauthorized"}), 401

        return f(*args, **kwargs)
    return decorated_function


def admin_required(f):
    """Ensures the user is logged in and has admin role."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({"error": "Forbidden: Admin access required"}), 403

        return f(*args, **kwargs)
    return decorated_function
