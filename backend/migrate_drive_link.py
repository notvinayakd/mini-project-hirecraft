import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

def migrate():
    try:
        conn = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', 's5c25'),
            database=os.getenv('MYSQL_DB', 'hirecraft')
        )
        with conn.cursor() as cursor:
            # Check if column exists
            cursor.execute("SHOW COLUMNS FROM placement_drives LIKE 'google_form_link'")
            if not cursor.fetchone():
                print("Adding google_form_link column to placement_drives table...")
                cursor.execute("ALTER TABLE placement_drives ADD COLUMN google_form_link VARCHAR(255)")
                conn.commit()
                print("Migration successful.")
            else:
                print("Column google_form_link already exists.")
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    migrate()
