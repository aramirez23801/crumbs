from sqlalchemy.orm import Session
from src.models.tag import Tag


class TagRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Tag]:
        return self.db.query(Tag).order_by(Tag.category, Tag.name).all()

    def get_by_id(self, tag_id) -> Tag | None:
        return self.db.query(Tag).filter(Tag.id == tag_id).first()

    def get_by_name(self, name: str) -> Tag | None:
        return self.db.query(Tag).filter(Tag.name == name).first()

    def create(self, name: str, category: str) -> Tag:
        tag = Tag(name=name, category=category)
        self.db.add(tag)
        self.db.commit()
        self.db.refresh(tag)
        return tag

    def get_grouped_by_category(self) -> dict[str, list[Tag]]:
        tags = self.get_all()
        grouped: dict[str, list[Tag]] = {}
        for tag in tags:
            if tag.category not in grouped:
                grouped[tag.category] = []
            grouped[tag.category].append(tag)
        return grouped