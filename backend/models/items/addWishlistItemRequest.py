from pydantic import BaseModel

class AddWishlistItemRequest(BaseModel):
    item_name: str # TODO: remove name section later if figures out how to extract name from url.
    item_url: str
    note: str