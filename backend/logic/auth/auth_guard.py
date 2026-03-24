from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from logic.auth.auth_service import AuthService
from logic.exceptions import InvalidCredentialsError

bearer_scheme = HTTPBearer()

def get_auth_service(request: Request) -> AuthService:
    return request.app.state.auth_service

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    auth_service: AuthService = Depends(get_auth_service)
):
    try:
        user = auth_service.verify_token(credentials.credentials)
        return user
    except InvalidCredentialsError:
        raise HTTPException(status_code=401, detail="Invalid credentials")