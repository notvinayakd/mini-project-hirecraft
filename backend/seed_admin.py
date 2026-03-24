from app import create_app, db
from app.models import User
import bcrypt

app = create_app()

with app.app_context():
    email = "abhiramsnair2006@gmail.com"
    password = "1234"
    
    user = User.query.filter_by(email=email).first()
    
    if user:
        print(f"User {email} already exists. Updating role to admin...")
        user.role = 'admin'
        # Update password just in case
        user.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    else:
        print(f"Creating new admin user {email}...")
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(
            name="Admin User",
            email=email,
            password_hash=hashed_password,
            role='admin'
        )
        db.session.add(user)
    
    db.session.commit()
    print("Admin user seeded successfully.")
