from datetime import datetime
from sqlalchemy.orm import Session
from src.models.password_reset_token import PasswordResetToken


class PasswordResetTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id, token: str, expires_at: datetime) -> PasswordResetToken:
        record = PasswordResetToken(user_id=user_id, token=token, expires_at=expires_at)
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_by_token(self, token: str) -> PasswordResetToken | None:
        return self.db.query(PasswordResetToken).filter(PasswordResetToken.token == token).first()

    def mark_used(self, token_record: PasswordResetToken) -> None:
        token_record.used = True
        self.db.commit()
