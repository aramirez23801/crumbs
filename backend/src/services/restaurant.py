import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.repositories.restaurant import RestaurantRepository
from src.schemas.restaurant import RestaurantCreate, RestaurantUpdate, RestaurantFilters
from src.models.restaurant import Restaurant

class RestaurantService:
    def __init__(self, db: Session):
        self.repo = RestaurantRepository(db)

    def create(self, user_id: uuid.UUID, data: RestaurantCreate) -> tuple[Restaurant, list]:
        tag_ids = data.tag_ids
        restaurant_data = data.model_dump(exclude={"tag_ids"})
        restaurant = self.repo.create(user_id=user_id, data=restaurant_data)
        if tag_ids:
            self.repo.set_tags(restaurant, tag_ids)
        tags = self.repo.get_tags(restaurant.id)
        return restaurant, tags

    def get_all(self, user_id: uuid.UUID, filters: RestaurantFilters) -> list[tuple[Restaurant, list]]:
        restaurants = self.repo.get_all(user_id=user_id, filters=filters)
        return [(r, self.repo.get_tags(r.id)) for r in restaurants]

    def get_by_id(self, restaurant_id: uuid.UUID, user_id: uuid.UUID) -> tuple[Restaurant, list]:
        restaurant = self.repo.get_by_id(restaurant_id, user_id)
        if not restaurant:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
        tags = self.repo.get_tags(restaurant.id)
        return restaurant, tags

    def update(self, restaurant_id: uuid.UUID, user_id: uuid.UUID, data: RestaurantUpdate) -> tuple[Restaurant, list]:
        restaurant = self.repo.get_by_id(restaurant_id, user_id)
        if not restaurant:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
        update_data = data.model_dump(exclude_unset=True, exclude={"tag_ids"})
        if update_data:
            restaurant = self.repo.update(restaurant, update_data)
        if data.tag_ids is not None:
            self.repo.set_tags(restaurant, data.tag_ids)
        tags = self.repo.get_tags(restaurant.id)
        return restaurant, tags

    def delete(self, restaurant_id: uuid.UUID, user_id: uuid.UUID) -> None:
        restaurant = self.repo.get_by_id(restaurant_id, user_id)
        if not restaurant:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
        self.repo.delete(restaurant)