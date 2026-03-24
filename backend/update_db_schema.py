from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        # Check if column exists first
        with db.engine.connect() as conn:
            result = conn.execute(text("SHOW COLUMNS FROM users LIKE 'role'"))
            if result.fetchone():
                print("Column 'role' already exists.")
            else:
                print("Adding 'role' column to users table...")
                conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'student'"))
                conn.commit()
                print("Column 'role' added successfully.")
    except Exception as e:
        print(f"Error updating database: {e}")
