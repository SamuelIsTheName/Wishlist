from fastapi import Request
from logic.item.item_service import ItemService

def get_item_instance(request: Request) -> ItemService:
    return request.app.state.item_service