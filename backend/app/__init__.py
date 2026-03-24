import os
from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from app.extensions import db

load_dotenv()


def create_app():
    app = Flask(__name__)

    # Security
    app.secret_key = os.getenv("SECRET_KEY")
    if not app.secret_key:
        raise RuntimeError("SECRET_KEY environment variable is required")

    # Session configuration
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = os.getenv('FLASK_ENV') == 'production'

    # CORS
    CORS(app, supports_credentials=True, origins=[
        "http://localhost:*", "http://127.0.0.1:*"
    ])

    # Database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    # Register blueprints
    from app.routes import (
        auth_routes, dashboard_routes, test_routes,
        practice_routes, prep_routes, admin_routes
    )
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(dashboard_routes.bp)
    app.register_blueprint(test_routes.bp)
    app.register_blueprint(practice_routes.bp)
    app.register_blueprint(prep_routes.bp)
    app.register_blueprint(admin_routes.bp)

    return app
