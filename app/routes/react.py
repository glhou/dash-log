from fastapi import APIRouter
from fastapi.responses import FileResponse

from app.core import settings

react_router = APIRouter(tags=["react"])


@react_router.get("/")
@react_router.get("/{full_path: path}")
async def serve_react(full_path: str = ""):
    return FileResponse(settings.base_dir / "frontend" / "dist" / "index.html")
