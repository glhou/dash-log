from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from app.core import settings
from app.routes.api import api_router
from app.routes.react import react_router

main_router = APIRouter()

main_router.include_router(api_router, prefix="/api")
main_router.include_router(react_router, prefix="/ui")


@main_router.get("/")
async def redirect_ui():
    return RedirectResponse("/ui")
