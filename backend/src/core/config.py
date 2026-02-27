from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # App
    app_name: str = "Crumbs API"
    app_version: str = "0.1.0"
    debug: bool = False

    # Database
    database_url: str

    # Security
    secret_key: str
    allowed_origins: str = "http://localhost:5173"
    api_key_prefix: str = "crumbs"

    # Google Places
    google_places_api_key: Optional[str] = None
    
    # Email
    resend_api_key: Optional[str] = None
    email_from: str
    frontend_url: str = "http://localhost:5173"

settings = Settings()