from app import create_app, db
from app.models import User
import bcrypt

app = create_app()

with app.app_context():
    user = User.query.filter_by(email="alex@example.com").first()
    if not user:
        print("User NOT found!")
    else:
        print(f"User found: {user.name}")
        print(f"Stored Hash: {user.password_hash}")
        
        password = "password123"
        is_valid = bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8'))
        print(f"Password '{password}' is valid: {is_valid}")
        
        if not is_valid:
            print("Generating new hash for comparison...")
            new_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            print(f"New Hash: {new_hash}")
