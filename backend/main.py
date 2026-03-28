"""from database import Database
async def main():
    db = Database()
    await db.init_client()
    items = await db.fetch_user_wishlist_items(user_id="30180b66-6168-4d50-bed2-ed4c480b967e")
    print(items)
    
if __name__ == "__main__":
    import asyncio
    asyncio.run(main())"""


from fastapi import FastAPI
from database import Database
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# --- Wishlist Item Imports ---
from logic.item.item_service import ItemService
from repository.wishlistItem_repository import WishlistItemRepository
from routes.wishlist_route import router as wishlist_router

# --- Auth Imports ---
from logic.auth.auth_service import AuthService
from repository.auth_repository import AuthRepository
from routes.auth_route import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = Database()
    await db.init_client()

    wishlist_item_repository = WishlistItemRepository(db)
    item_service = ItemService(wishlist_item_repository)

    auth_repository = AuthRepository(db)
    auth_service = AuthService(auth_repository)

    app.state.item_service = item_service 
    app.state.auth_service = auth_service

    yield

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Wishlist API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(wishlist_router, prefix="/wishlist", tags=["Items"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
