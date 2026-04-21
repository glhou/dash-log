from fastapi import APIRouter

from app.routes.api.log_routes import log_router

api_router = APIRouter()

api_router.include_router(log_router)
