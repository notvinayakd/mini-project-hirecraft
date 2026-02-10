from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

uri = os.getenv("SQLALCHEMY_DATABASE_URI")
print(f"Testing connection to: {uri}")

try:
    engine = create_engine(uri)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Connection successful!")
except Exception as e:
    print(f"Connection failed: {e}")
