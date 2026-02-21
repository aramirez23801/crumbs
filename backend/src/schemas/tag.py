from pydantic import BaseModel
import uuid
from datetime import datetime


class TagCreate(BaseModel):
    name: str
    category: str


class TagResponse(BaseModel):
    id: uuid.UUID
    name: str
    category: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConfigOptions(BaseModel):
    options: dict[str, list[TagResponse]]