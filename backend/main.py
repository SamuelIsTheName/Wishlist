from fastapi import FastAPI
from routes.wishlist_route import router as wishlist_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Wishlist API")

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
