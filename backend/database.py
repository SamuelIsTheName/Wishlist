import os
from dotenv import load_dotenv
from logic.exceptions import ItemAlreadyExistsError, FailedToAddItemError
from supabase import create_async_client
from postgrest.exceptions import APIError

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

    async def add_wishlist_item(self, user_id, item_name,item_url, note):
        if self.supabase is None:
            raise RuntimeError("Client not initialized. Call 'await init_client()' first.")

        try:
            response = await self.supabase.table("wishlist_items").insert({                
                "item_name": item_name,
                "url": item_url,
                "note": note,
                "user_id": user_id
            }).execute()
            return response.data[0]
        except APIError as e:
            if getattr(e, "code", None) == "23505":
                raise ItemAlreadyExistsError() from e

            # log internally but don't expose DB details
            print(f"Supabase APIError: {e}")
            raise FailedToAddItemError() from e

        except Exception as e:
            print("UNKNOWN ERROR:", e)
            raise

    async def is_item_already_in_wishlist(self, user_id, item_url):
        if self.supabase is None:
            raise RuntimeError("Client not initialized. Call 'await init_client()' first.")
        
        try:
            response = (
                await self.supabase.table("wishlist_items")
                .select("*")
                .eq("user_id", user_id)
                .eq("url", item_url)
                .execute()
            )
            return len(response.data) > 0
        except Exception as e:
            print(f"Unexpected error: {e}")
            return False

    async def fetch_user_wishlist_items(self,user_id):
        # retrieve all wishlist items for a specific user

        if self.supabase is None:
            raise RuntimeError("Client not initialized. Call 'await init_client()' first.")
        
        try:
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
        
    async def fetch_specific_user_wishlist_item(self, user_id, item_id):
        if self.supabase is None:
            raise RuntimeError("Client not initialized. Call 'await init_client()' first.")
        
        try:
            response = (
                await self.supabase.table("wishlist_items")
                .select("*")
                .eq("user_id", user_id)
                .eq("id", item_id)
                .execute()
            )
            return response.data
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None
        
    async def update_wishlist_item(self, item_id, item_name,item_url, note):
        if self.supabase is None:
            raise RuntimeError("Client not initialized. Call 'await init_client()' first.")
        
        try:
            item_data = {
                "item_name": item_name,
                "url": item_url,
                "note": note
            }
            response = (
                await self.supabase.table("wishlist_items")
                .update(item_data)
                .eq("id", item_id)
                .execute()
            )
            return response.data
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None
        
    async def delete_wishlist_item(self, user_id, item_id):
        if self.supabase is None:
            raise RuntimeError("Client not initialized. Call 'await init_client()' first.")
            
        try:
            response = (
                await self.supabase.table("wishlist_items")
                .delete()
                .eq("user_id", user_id)
                .eq("id", item_id)
                .execute()
            )
            return response.data
        except Exception as e:
                print(f"Unexpected error: {e}")
                return None