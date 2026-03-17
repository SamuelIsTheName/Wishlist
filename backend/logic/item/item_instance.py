
from logic.item.item_service import ItemService

item_service_instance = None

async def get_item_instance() -> ItemService:
    global item_service_instance
    if item_service_instance is None:
        item_service_instance = await ItemService.create()
    return item_service_instance
