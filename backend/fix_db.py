from app import create_app
from app.extensions import db
from sqlalchemy import text

def fix_schema():
    app = create_app()
    with app.app_context():
        print("Checking if 'min_cgpa' column exists in 'placement_drives'...")
        try:
            # Check if column exists
            db.session.execute(text("SELECT min_cgpa FROM placement_drives LIMIT 1"))
            print("Column 'min_cgpa' already exists.")
        except Exception:
            db.session.rollback()
            print("Column 'min_cgpa' missing. Adding it...")
            try:
                db.session.execute(text("ALTER TABLE placement_drives ADD COLUMN min_cgpa VARCHAR(10) DEFAULT '0.0'"))
                db.session.commit()
                print("Column 'min_cgpa' added successfully.")
            except Exception as e:
                print(f"Error adding column: {e}")

if __name__ == "__main__":
    fix_schema()
