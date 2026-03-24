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
            cursor.execute("SHOW COLUMNS FROM users LIKE 'created_at'")
            if not cursor.fetchone():
                print("Adding created_at column to users table...")
                cursor.execute("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
                conn.commit()
                print("Migration successful.")
            else:
                print("Column created_at already exists.")
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    migrate()
