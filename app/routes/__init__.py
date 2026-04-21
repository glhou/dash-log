from fastapi import APIRouter

from app.routes.api import api_router

main_router = APIRouter()

main_router.include_router(api_router, prefix="/api")
