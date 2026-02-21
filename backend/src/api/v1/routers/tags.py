from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.core.database import get_session
from src.services.tag import TagService
from src.schemas.tag import TagCreate, TagResponse, ConfigOptions
from src.api.v1.dependencies import get_current_user
from src.models.user import User

router = APIRouter(tags=["tags"])


@router.post("/tags", response_model=TagResponse, status_code=201)
def create_tag(
    data: TagCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    service = TagService(db)
    return service.create(data)


@router.get("/tags", response_model=list[TagResponse])
def list_tags(
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    service = TagService(db)
    return service.get_all()


@router.get("/config/options", response_model=ConfigOptions)
def get_config_options(
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    service = TagService(db)
    grouped = service.get_config_options()
    return ConfigOptions(options=grouped)