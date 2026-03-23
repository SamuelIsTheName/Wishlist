from database import Database
from postgrest.exceptions import APIError
from logic.exceptions import FailedToRegisterError, UserAlreadyExistsError, UserNotFoundError

class AuthRepository:
    def __init__(self, db: Database):
        self.db = db

    async def register_user(self, email: str, hashed_password: str) -> dict:
        if self.db.supabase is None:
            raise RuntimeError("Client not initialized.")
        
        try:
            response = await self.db.supabase.table("Users").insert({
                "email": email,
                "password": hashed_password
            }).execute()
            return response.data[0]
        except APIError as e:
            if getattr(e, "code", None) == "23505":
                raise UserAlreadyExistsError() from e
            print(f"Supabase APIError: {e}")
            raise FailedToRegisterError() from e
        
        except Exception as e:
            print("UNKNOWN ERROR:", e)
            raise

    async def get_user_by_email(self, email: str) -> dict:
        if self.db.supabase is None:
            raise RuntimeError("Client not initialized.")
        try:
            response = await self.db.supabase.table("Users").select("*").eq("email", email).execute()
            if not response.data:
                raise UserNotFoundError()
            return response.data[0]
        except APIError as e:
            print(f"Supabase APIError: {e}")
            raise FailedToRegisterError() from e
        except Exception as e:
            print("UNKNOWN ERROR:", e)
            raise