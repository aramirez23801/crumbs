from sqlalchemy.orm import Session
from src.models.user import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_api_key(self, api_key: str) -> User | None:
        return self.db.query(User).filter(User.api_key == api_key).first()

    def create(self, email: str, username: str, password_hash: str, api_key: str) -> User:
        user = User(
            email=email,
            username=username,
            password_hash=password_hash,
            api_key=api_key,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def email_exists(self, email: str) -> bool:
        return self.db.query(User).filter(User.email == email).first() is not None

    def username_exists(self, username: str) -> bool:
        return self.db.query(User).filter(User.username == username).first() is not None