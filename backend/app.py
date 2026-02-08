from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import mysql, jwt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    mysql.init_app(app)
    jwt.init_app(app)

    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    from routes.company_routes import company_bp
    app.register_blueprint(company_bp, url_prefix="/api/company")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)


