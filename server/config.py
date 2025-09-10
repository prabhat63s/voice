import os
from dotenv import load_dotenv

load_dotenv()  # load .env file

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
