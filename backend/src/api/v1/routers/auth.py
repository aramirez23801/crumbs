from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.core.database import get_session
from src.services.auth import AuthService
from src.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse
from src.api.v1.dependencies import get_current_user
from src.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(data: UserRegister, db: Session = Depends(get_session)):
    service = AuthService(db)
    user, api_key = service.register(data)
    return TokenResponse(api_key=api_key, user=UserResponse.model_validate(user))


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_session)):
    service = AuthService(db)
    user, api_key = service.login(data)
    return TokenResponse(api_key=api_key, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)