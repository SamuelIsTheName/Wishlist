import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from logic.exceptions import FailedToRegisterError, UserNotFoundError, InvalidCredentialsError
from jose import JWTError, jwt
from datetime import datetime, timezone, timedelta
from repository.auth_repository import AuthRepository

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class AuthService:
    def __init__(self, db: AuthRepository):
        self.db = db

    # -- Password Hashing --
    def hash_password(self, password: str) -> str:
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        result = pwd_context.verify(plain_password, hashed_password)
        print(f"password verification result: {result}")
        return result
    
    # --- JWT ---

    def generate_token(self, user_id: int) -> str:
        payload = {
            "sub": str(user_id),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    def verify_token(self, token: str) -> str:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise InvalidCredentialsError()
            return user_id
        except JWTError:
            raise InvalidCredentialsError("Invalid token")
        
    # --- Auth Logic ---

    async def register_user(self, email: str, password: str) -> dict:
        email = email.lower().strip()
        hashed_password = self.hash_password(password)
        user = await self.db.register_user(email=email, hashed_password=hashed_password)
        return user
    
    async def login_user(self, email: str, plain_password: str) -> str:
        email = email.lower().strip()
        print(f"Attempting login for email: {email}, password: {plain_password}")
        user = await self.db.get_user_by_email(email=email)
        print(f"SAM!! User found: {user}")
        if not self.verify_password(plain_password, user['password']):
            raise InvalidCredentialsError()
        token = self.generate_token(user_id=user['id'])
        return token