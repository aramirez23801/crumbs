import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column
from src.core.database import Base
import enum

class RestaurantStatus(str, enum.Enum):
    SAVED = "saved"
    TRIED = "tried"

class Restaurant(Base):
    __tablename__ = "restaurants"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    status: Mapped[RestaurantStatus] = mapped_column(
        Enum(RestaurantStatus), default=RestaurantStatus.SAVED, index=True
    )

    name: Mapped[str] = mapped_column(String, index=True)
    country: Mapped[str] = mapped_column(String, index=True)
    city: Mapped[str] = mapped_column(String, index=True)
    area: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    place_url: Mapped[str] = mapped_column(String)
    price_range: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # 1-4

    notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )