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