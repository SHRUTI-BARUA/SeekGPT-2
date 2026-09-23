import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]
    TAVILY_API_KEY = os.environ["TAVILY_API_KEY"]
    CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
    CHAT_MODEL = "gemini-2.5-flash"
    EMBEDDING_MODEL = "models/gemini-embedding-001"

settings = Settings()
