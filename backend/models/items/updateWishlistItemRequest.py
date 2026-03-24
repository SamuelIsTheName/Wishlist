from pydantic import BaseModel

class UpdateWishlistItemRequest(BaseModel):
    item_id: str
    item_name: str 
    item_url: str
    note: str