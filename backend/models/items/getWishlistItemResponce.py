from pydantic import BaseModel, Field
from datetime import datetime, timezone
import uuid
from typing import Optional

class GetWishlistItemResponse(BaseModel):
    id: uuid.UUID = Field(..., description="The unique identifier of the wishlist item")    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    item_name: str = Field(..., description="The name of the wishlist item")    
    url: str = Field(..., description="A URL where the wishlist item can be found")
    note: Optional[str] = Field(None, description="A brief description of the wishlist item")

    class Config:
        json_encoders = {
            uuid.UUID: str,
            datetime: lambda v: v.isoformat()
        }