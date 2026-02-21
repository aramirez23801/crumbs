import uuid
from sqlalchemy.orm import Session
from src.models.review import Review


class ReviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_restaurant_id(self, restaurant_id: uuid.UUID) -> Review | None:
        return (
            self.db.query(Review)
            .filter(Review.restaurant_id == restaurant_id)
            .first()
        )

    def create(self, restaurant_id: uuid.UUID, rating: int, review_text: str | None, visited_at) -> Review:
        review = Review(
            restaurant_id=restaurant_id,
            rating=rating,
            review_text=review_text,
            visited_at=visited_at,
        )
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review

    def update(self, review: Review, rating: int, review_text: str | None, visited_at) -> Review:
        review.rating = rating
        review.review_text = review_text
        review.visited_at = visited_at
        self.db.commit()
        self.db.refresh(review)
        return review

    def delete(self, review: Review) -> None:
        self.db.delete(review)
        self.db.commit()