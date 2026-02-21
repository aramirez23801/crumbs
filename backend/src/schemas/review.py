from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import datetime

class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    review_text: Optional[str] = None
    visited_at: Optional[datetime] = None

class ReviewResponse(BaseModel):
    id: uuid.UUID
    restaurant_id: uuid.UUID
    rating: int
    review_text: Optional[str]
    visited_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True