from pydantic import BaseModel
from typing import Optional


class PlaceSearchResult(BaseModel):
    place_id: str
    description: str
    main_text: str
    secondary_text: str


class PlaceDetailsResponse(BaseModel):
    place_id: str
    name: Optional[str]
    website_url: Optional[str]
    google_maps_url: Optional[str]
    country: Optional[str]
    city: Optional[str]
    area: Optional[str]
    price_range: Optional[int]
    photo_url: Optional[str]
