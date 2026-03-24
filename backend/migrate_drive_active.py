import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

def migrate():
    connection = pymysql.connect(
        host=str(os.getenv('MYSQL_HOST', 'localhost')),
        user=str(os.getenv('MYSQL_USER', 'root')),
        password=str(os.getenv('MYSQL_PASSWORD', 's5c25')),
        database=str(os.getenv('MYSQL_DB', 'hirecraft')),
        cursorclass=pymysql.cursors.DictCursor
    )

    try:
        with connection.cursor() as cursor:
            # Check if column exists
            cursor.execute("SHOW COLUMNS FROM placement_drives LIKE 'is_active'")
            result = cursor.fetchone()
            
            if not result:
                print("Adding is_active column to placement_drives...")
                cursor.execute("ALTER TABLE placement_drives ADD COLUMN is_active BOOLEAN DEFAULT TRUE")
                connection.commit()
                print("Column added successfully!")
            else:
                print("Column is_active already exists.")
                
    finally:
        connection.close()

if __name__ == "__main__":
    migrate()
