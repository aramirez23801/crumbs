import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.repositories.restaurant import RestaurantRepository
from src.repositories.review import ReviewRepository
from src.schemas.review import ReviewCreate
from src.models.restaurant import Restaurant, RestaurantStatus
from src.models.review import Review


class ReviewService:
    def __init__(self, db: Session):
        self.restaurant_repo = RestaurantRepository(db)
        self.review_repo = ReviewRepository(db)

    def mark_tried(self, restaurant_id: uuid.UUID, user_id: uuid.UUID, data: ReviewCreate) -> tuple[Restaurant, Review]:
        restaurant = self.restaurant_repo.get_by_id(restaurant_id, user_id)
        if not restaurant:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")

        # Update status to tried
        restaurant = self.restaurant_repo.update(restaurant, {"status": RestaurantStatus.TRIED})

        # Create or update review
        existing = self.review_repo.get_by_restaurant_id(restaurant_id)
        if existing:
            review = self.review_repo.update(existing, data.rating, data.review_text, data.visited_at)
        else:
            review = self.review_repo.create(restaurant_id, data.rating, data.review_text, data.visited_at)

        return restaurant, review

    def mark_saved(self, restaurant_id: uuid.UUID, user_id: uuid.UUID) -> Restaurant:
        restaurant = self.restaurant_repo.get_by_id(restaurant_id, user_id)
        if not restaurant:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")

        restaurant = self.restaurant_repo.update(restaurant, {"status": RestaurantStatus.SAVED})
        return restaurant