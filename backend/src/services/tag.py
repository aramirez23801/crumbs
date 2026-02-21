from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.repositories.tag import TagRepository
from src.schemas.tag import TagCreate
from src.models.tag import Tag


class TagService:
    def __init__(self, db: Session):
        self.repo = TagRepository(db)

    def create(self, data: TagCreate) -> Tag:
        existing = self.repo.get_by_name(data.name)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tag '{data.name}' already exists",
            )
        return self.repo.create(name=data.name, category=data.category)

    def get_all(self) -> list[Tag]:
        return self.repo.get_all()

    def get_config_options(self) -> dict[str, list[Tag]]:
        return self.repo.get_grouped_by_category()