import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from src.core.database import get_session
from src.services.restaurant import RestaurantService
from src.schemas.restaurant import (
    RestaurantCreate,
    RestaurantUpdate,
    RestaurantResponse,
    RestaurantFilters,
)
from src.api.v1.dependencies import get_current_user
from src.models.user import User

router = APIRouter(prefix="/restaurants", tags=["restaurants"])

def build_response(restaurant, tags) -> RestaurantResponse:
    data = RestaurantResponse.model_validate(restaurant)
    data.tags = tags
    return data

@router.post("", response_model=RestaurantResponse, status_code=201)
def create_restaurant(
    data: RestaurantCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    service = RestaurantService(db)
    restaurant, tags = service.create(user_id=current_user.id, data=data)
    return build_response(restaurant, tags)

@router.get("", response_model=list[RestaurantResponse])
def list_restaurants(
    status: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    price_range: Optional[int] = Query(None),
    tag_ids: Optional[list[uuid.UUID]] = Query(None),
    q: Optional[str] = Query(None),
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    filters = RestaurantFilters(
        status=status,
        country=country,
        city=city,
        price_range=price_range,
        tag_ids=tag_ids,
        q=q,
    )
    service = RestaurantService(db)
    results = service.get_all(user_id=current_user.id, filters=filters)
    return [build_response(r, t) for r, t in results]

@router.get("/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant(
    restaurant_id: uuid.UUID,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    service = RestaurantService(db)
    restaurant, tags = service.get_by_id(restaurant_id, current_user.id)
    return build_response(restaurant, tags)

@router.patch("/{restaurant_id}", response_model=RestaurantResponse)
def update_restaurant(
    restaurant_id: uuid.UUID,
    data: RestaurantUpdate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    service = RestaurantService(db)
    restaurant, tags = service.update(restaurant_id, current_user.id, data)
    return build_response(restaurant, tags)

@router.delete("/{restaurant_id}", status_code=204)
def delete_restaurant(
    restaurant_id: uuid.UUID,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    service = RestaurantService(db)
    service.delete(restaurant_id, current_user.id)