import secrets
from passlib.context import CryptContext
from src.core.config import settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# --- Password hashing ---

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# --- API Key generation ---

def generate_api_key() -> str:
    """Generate a new random API key with a readable prefix."""
    token = secrets.token_urlsafe(32)
    return f"{settings.api_key_prefix}_{token}"