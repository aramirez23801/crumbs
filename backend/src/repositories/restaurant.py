import uuid
from sqlalchemy.orm import Session
from sqlalchemy import or_
from src.models.restaurant import Restaurant
from src.models.tag import Tag, RestaurantTag
from src.schemas.restaurant import RestaurantFilters


class RestaurantRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, restaurant_id: uuid.UUID, user_id: uuid.UUID) -> Restaurant | None:
        return (
            self.db.query(Restaurant)
            .filter(Restaurant.id == restaurant_id, Restaurant.user_id == user_id)
            .first()
        )

    def get_all(self, user_id: uuid.UUID, filters: RestaurantFilters) -> list[Restaurant]:
        query = self.db.query(Restaurant).filter(Restaurant.user_id == user_id)

        if filters.status:
            query = query.filter(Restaurant.status == filters.status)
        if filters.country:
            query = query.filter(Restaurant.country.ilike(f"%{filters.country}%"))
        if filters.city:
            query = query.filter(Restaurant.city.ilike(f"%{filters.city}%"))
        if filters.price_range:
            query = query.filter(Restaurant.price_range == filters.price_range)
        if filters.q:
            query = query.filter(
                or_(
                    Restaurant.name.ilike(f"%{filters.q}%"),
                    Restaurant.notes.ilike(f"%{filters.q}%"),
                )
            )
        if filters.tag_ids:
            query = (
                query.join(RestaurantTag)
                .filter(RestaurantTag.tag_id.in_(filters.tag_ids))
            )

        return query.order_by(Restaurant.created_at.desc()).all()

    def create(self, user_id: uuid.UUID, data: dict) -> Restaurant:
        restaurant = Restaurant(user_id=user_id, **data)
        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant

    def update(self, restaurant: Restaurant, data: dict) -> Restaurant:
        for key, value in data.items():
            setattr(restaurant, key, value)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant

    def delete(self, restaurant: Restaurant) -> None:
        self.db.delete(restaurant)
        self.db.commit()

    def set_tags(self, restaurant: Restaurant, tag_ids: list[uuid.UUID]) -> None:
        self.db.query(RestaurantTag).filter(
            RestaurantTag.restaurant_id == restaurant.id
        ).delete()
        for tag_id in tag_ids:
            self.db.add(RestaurantTag(restaurant_id=restaurant.id, tag_id=tag_id))
        self.db.commit()

    def get_tags(self, restaurant_id: uuid.UUID) -> list[Tag]:
        return (
            self.db.query(Tag)
            .join(RestaurantTag)
            .filter(RestaurantTag.restaurant_id == restaurant_id)
            .all()
        )