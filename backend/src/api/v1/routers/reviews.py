import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.core.database import get_session
from src.services.review import ReviewService
from src.services.restaurant import RestaurantService
from src.schemas.review import ReviewCreate
from src.schemas.restaurant import RestaurantResponse
from src.api.v1.dependencies import get_current_user
from src.models.user import User

router = APIRouter(prefix="/restaurants", tags=["reviews"])


@router.post("/{restaurant_id}/mark-tried", response_model=RestaurantResponse)
def mark_tried(
    restaurant_id: uuid.UUID,
    data: ReviewCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    service = ReviewService(db)
    restaurant, review = service.mark_tried(restaurant_id, current_user.id, data)
    restaurant_service = RestaurantService(db)
    tags = restaurant_service.repo.get_tags(restaurant.id)
    response = RestaurantResponse.model_validate(restaurant)
    response.tags = tags
    response.review = review
    return response


@router.post("/{restaurant_id}/mark-saved", response_model=RestaurantResponse)
def mark_saved(
    restaurant_id: uuid.UUID,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    service = ReviewService(db)
    restaurant = service.mark_saved(restaurant_id, current_user.id)
    restaurant_service = RestaurantService(db)
    tags = restaurant_service.repo.get_tags(restaurant.id)
    response = RestaurantResponse.model_validate(restaurant)
    response.tags = tags
    return response