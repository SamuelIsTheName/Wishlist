from database import Database
async def main():
    db = Database()
    await db.init_client()
    items = await db.fetch_user_wishlist_items(user_id=1)
    print(items)
    
if __name__ == "__main__":
    import asyncio
    asyncio.run(main())