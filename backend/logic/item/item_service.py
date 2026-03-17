from database import Database
class ItemService:
    def __init__(self, db: Database):
        self.db = db

    @classmethod
    async def create(cls):
        db = Database()
        await db.init_client()
        return cls(db)

    def get_item(self, item_id):
        return self.item_repository.get_item_by_id(item_id)

    def create_item(self, item_data):
        return self.item_repository.create_item(item_data)

    def update_item(self, item_id, item_data):
        return self.item_repository.update_item(item_id, item_data)

    def delete_item(self, item_id):
        return self.item_repository.delete_item(item_id)