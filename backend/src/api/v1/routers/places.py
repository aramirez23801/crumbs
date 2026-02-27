from fastapi import APIRouter, Query

from src.schemas.places import PlaceSearchResult, PlaceDetailsResponse
from src.services.places import PlacesService

router = APIRouter(prefix="/places", tags=["places"])


@router.get("/search", response_model=list[PlaceSearchResult])
async def search_places(q: str = Query(..., min_length=2)):
    service = PlacesService()
    return await service.search(q)


@router.get("/details/{place_id}", response_model=PlaceDetailsResponse)
async def get_place_details(place_id: str):
    service = PlacesService()
    return await service.get_details(place_id)
