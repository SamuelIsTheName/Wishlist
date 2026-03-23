from fastapi import FastAPI
from database import Database
from logic.item.item_service import ItemService
from contextlib import asynccontextmanager
from repository.wishlistItem_repository import WishlistItemRepository
from routes.wishlist_route import router as wishlist_router
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = Database()
    await db.init_client()

    wishlist_item_repository = WishlistItemRepository(db)
    item_service = ItemService(wishlist_item_repository)

    app.state.item_service = item_service 

    yield

app = FastAPI(title="Wishlist API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(wishlist_router, prefix="/wishlist", tags=["Items"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
