from logic.exceptions import ItemNotFoundError, UpdateFailedError, ItemAlreadyExistsError, FailedToAddItemError

from database import Database
from models.items.addWishlistItemRequest import AddWishlistItemRequest
from models.items.updateWishlistItemRequest import UpdateWishlistItemRequest

class ItemService:
    def __init__(self, db: Database):
        self.db = db

    @classmethod
    async def create(cls):
        db = Database()
        await db.init_client()
        return cls(db)

    async def get_all_user_items(self, user_id) -> list[dict]:
        items =await self.db.fetch_user_wishlist_items(user_id=user_id)
        if not items:
            raise ItemNotFoundError()
        return items

    async def get_specific_item(self, user_id, item_id) -> dict:

        items = await self.db.fetch_specific_user_wishlist_item(user_id=user_id, item_id=item_id)
        if not items:
            raise ItemNotFoundError()
        return items


    async def create_item(self, request: AddWishlistItemRequest) -> dict:
        try:
            new_item = await self.db.add_wishlist_item(
                user_id=request.user_id,
                item_name=request.item_name,
                item_url=request.item_url,
                note=request.note
            )
            return {"id": new_item['id'], "status": "Wishlist item added successfully"}
        except ItemAlreadyExistsError:
            raise ItemAlreadyExistsError()
        except FailedToAddItemError:
            raise FailedToAddItemError()

    async def update_item(self, request: UpdateWishlistItemRequest):
        item = await self.get_specific_item(request.user_id, request.item_id)
        if not item:
            raise ItemNotFoundError()

        success = await self.db.update_wishlist_item(
            item_id=request.item_id,
            item_name=request.item_name,
            item_url=request.item_url,
            note=request.note
        )
        if not success:
            raise UpdateFailedError()
        return success

    async def delete_item(self, user_id, item_id):
        response = await self.db.delete_wishlist_item(user_id=user_id, item_id=item_id)
        if not response:
            raise ItemNotFoundError()
        return response