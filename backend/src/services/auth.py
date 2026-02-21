from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.repositories.user import UserRepository
from src.core.security import hash_password, verify_password, generate_api_key
from src.schemas.user import UserRegister, UserLogin
from src.models.user import User

class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register(self, data: UserRegister) -> tuple[User, str]:
        if self.repo.email_exists(data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        if self.repo.username_exists(data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken",
            )

        api_key = generate_api_key()
        user = self.repo.create(
            email=data.email,
            username=data.username,
            password_hash=hash_password(data.password),
            api_key=api_key,
        )
        return user, api_key

    def login(self, data: UserLogin) -> tuple[User, str]:
        user = self.repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        # Return the stored plain key — same key every time
        return user, user.api_key

    def get_user_from_api_key(self, api_key: str) -> User | None:
        return self.repo.get_by_api_key(api_key)