from pydantic import BaseModel

class UpdateWishlistItemRequest(BaseModel):
    user_id: str
    item_id: str
    item_name: str 
    item_url: str
    note: str