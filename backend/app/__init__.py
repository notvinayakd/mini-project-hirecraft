from flask import Flask
from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from app.extensions import db

load_dotenv()

# db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Database Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from app.routes import auth_routes
    app.register_blueprint(auth_routes.bp)

    return app
