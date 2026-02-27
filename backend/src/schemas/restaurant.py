from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime
from src.schemas.tag import TagResponse
from src.schemas.review import ReviewResponse


class RestaurantCreate(BaseModel):
    name: str
    country: str
    city: str
    area: Optional[str] = None
    website_url: Optional[str] = None
    google_maps_url: Optional[str] = None
    google_place_id: Optional[str] = None
    photo_url: Optional[str] = None
    price_range: Optional[int] = None
    notes: Optional[str] = None
    tag_ids: list[uuid.UUID] = []


class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    website_url: Optional[str] = None
    google_maps_url: Optional[str] = None
    google_place_id: Optional[str] = None
    photo_url: Optional[str] = None
    price_range: Optional[int] = None
    notes: Optional[str] = None
    tag_ids: Optional[list[uuid.UUID]] = None


class RestaurantResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    status: str
    name: str
    country: str
    city: str
    area: Optional[str]
    website_url: Optional[str] = None
    google_maps_url: Optional[str] = None
    google_place_id: Optional[str] = None
    photo_url: Optional[str] = None
    price_range: Optional[int]
    notes: Optional[str]
    is_favorite: bool = False
    tags: list[TagResponse] = []
    review: Optional[ReviewResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RestaurantFilters(BaseModel):
    status: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    price_range: Optional[int] = None
    tag_ids: Optional[list[uuid.UUID]] = None
    q: Optional[str] = None
    is_favorite: Optional[bool] = None