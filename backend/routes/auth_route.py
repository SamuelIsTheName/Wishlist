from fastapi import APIRouter, Depends, HTTPException, Request
from logic.auth.auth_service import AuthService
from logic.exceptions import UserAlreadyExistsError, InvalidCredentialsError, FailedToRegisterError
from models.auth.registerRequest import RegisterRequest
from models.auth.loginRequest import LoginRequest
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

def get_auth_instance(request: Request) -> AuthService:
    return request.app.state.auth_service

@router.post("/register")
@limiter.limit("5/minute")
async def register_user(request: Request, body: RegisterRequest, auth: AuthService = Depends(get_auth_instance)):
    try:
        user = await auth.register_user(email=body.email, password=body.password)
        return {"message": "User registered successfully", "user_id": user['id']}
    except UserAlreadyExistsError:
        raise HTTPException(status_code=409, detail="Email already registered")
    except FailedToRegisterError:
        raise HTTPException(status_code=500, detail="Failed to register user")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

@router.post("/login")
@limiter.limit("5/minute")
async def login_user(request: Request, body: LoginRequest, auth: AuthService = Depends(get_auth_instance)):
    try:
        token = await auth.login_user(email=body.email, plain_password=body.password)
        return {"access_token": token, "token_type": "bearer"}
    except InvalidCredentialsError:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")