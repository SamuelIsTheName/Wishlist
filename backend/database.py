import os
from dotenv import load_dotenv
from supabase import create_async_client

load_dotenv()

class Database:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        self.supabase = None
    
    async def init_client(self):
        self.supabase =await create_async_client(
            self.supabase_url, self.supabase_key
        )

    async def fetch_user_wishlist_items(self,user_id=None):
        # retrieve all wishlist items for a specific user

        if self.supabase is None:
            raise RuntimeError("Client not initialized. Call 'await init_client()' first.")
        
        try:
            #response = await self.supabase.table("wishlist_items").select("*").eq("user_id", user_id).execute()
            response = (
                await self.supabase.table("wishlist_items")
                .select("*")
                .eq("user_id", user_id)
                .execute()
            )
            return response.data
        except Exception as e:
            print(f"Unexpected error: {e}")
            return []