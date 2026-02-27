import secrets
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.core.config import settings
from src.core.security import hash_password
from src.repositories.password_reset_token import PasswordResetTokenRepository
from src.repositories.user import UserRepository
from src.services.email import send_password_reset_email


class PasswordResetService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
        self.token_repo = PasswordResetTokenRepository(db)

    def request_reset(self, email: str) -> str:
        user = self.user_repo.get_by_email(email)
        if user:
            token = secrets.token_urlsafe(32)
            expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
            self.token_repo.create(user.id, token, expires_at)
            reset_link = f"{settings.frontend_url}/reset-password?token={token}"
            send_password_reset_email(to_email=email, reset_link=reset_link)
        return "If that email is registered, you'll receive a password reset link shortly."

    def reset_password(self, token: str, new_password: str) -> None:
        record = self.token_repo.get_by_token(token)
        if not record or record.used or record.expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired password reset token.",
            )
        user = self.user_repo.get_by_id(record.user_id)
        self.user_repo.update_password(user, hash_password(new_password))
        self.token_repo.mark_used(record)
