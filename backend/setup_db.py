import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Extract connection details manually or just use hardcoded for this setup script
DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASS = 's5c25'        # Based on user input
DB_NAME = 'hirecraft'

try:
    conn = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS
    )
    cursor = conn.cursor()
    
    # Create database if not exists
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    print(f"Database '{DB_NAME}' created or already exists.")
    
    conn.close()
except Exception as e:
    print(f"Error creating database: {e}")
