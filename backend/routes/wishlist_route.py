from typing import List
import uuid
from fastapi import APIRouter, HTTPException, Body, Depends, Header, Request
from logic.exceptions import ItemAlreadyExistsError, ItemNotFoundError, UpdateFailedError, FailedToAddItemError
from logic.item.item_service import ItemService
from logic.auth.auth_guard import get_current_user


#--- IMPORT MODELS ---
from models.items.addWishlistItemRequest import AddWishlistItemRequest
from models.items.getWishlistItemResponce import GetWishlistItemResponse
from models.items.updateWishlistItemRequest import UpdateWishlistItemRequest
#--- END OF MODEL IMPORTS ---

router = APIRouter()

def get_item_instance(request: Request) -> ItemService:
    return request.app.state.item_service


@router.post("/add_item")
async def add_wishlist_item(request: AddWishlistItemRequest, logic: ItemService = Depends(get_item_instance), user_id: str = Depends(get_current_user)):
    try:
        success = await logic.create_item(user_id,request)
        print(f"Type of success: {type(success)}")
        return {
            "status": success["status"],
            "item_id": success["id"]
        }
    except FailedToAddItemError:
        raise HTTPException(status_code=404, detail="Failed to add item to wishlist")
    except ItemAlreadyExistsError:
        raise HTTPException(status_code=409, detail="Item already exists in wishlist")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add item to wishlist: {e}")
    
@router.get("/get_all_user_items", response_model=List[GetWishlistItemResponse])
async def get_wishlist_items(logic: ItemService = Depends(get_item_instance), user_id: str = Depends(get_current_user)):
    try:
        items = await logic.get_all_user_items(user_id)
        return items
    except ItemNotFoundError:
        raise HTTPException(status_code=404, detail="Wishlist items not found for user")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error occurred: {e}")
    
@router.get("/get_specific_item", response_model=GetWishlistItemResponse)
async def get_specific_wishlist_item(item_id: str, logic: ItemService = Depends(get_item_instance), user_id: str = Depends(get_current_user)):
    try:
        item = await logic.get_specific_item(user_id, item_id)
        return item[0]
    except ItemNotFoundError:
        raise HTTPException(status_code=404, detail="Wishlist items not found for user")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error occurred: {e}")
    
@router.put("/update_item")
async def update_wishlist_item(request: UpdateWishlistItemRequest, logic: ItemService = Depends(get_item_instance), user_id: str = Depends(get_current_user)):
    try:
        success = await logic.update_item(user_id, request)
        return {"status": "Wishlist item updated successfully"}

    except ItemNotFoundError:
        raise HTTPException(status_code=404, detail="Item not found in user's wishlist")
    except UpdateFailedError:
        raise HTTPException(status_code=400, detail="Failed to update wishlist item")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error occurred: {e}")
    
@router.delete("/remove_item")
async def remove_wishlist_item(item_id: str, logic: ItemService = Depends(get_item_instance), user_id: str = Depends(get_current_user)):
    try:
        success = await logic.delete_item(user_id, item_id)
        print(f"removal response: {success}")
        return {"status": "Wishlist item removed successfully"}
    except ItemNotFoundError:
        raise HTTPException(status_code=404, detail="Item not found in user's wishlist")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error occurred: {e}")