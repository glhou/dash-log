from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.staticfiles import StaticFiles

from app.core import settings
from app.core.engine import init_db
from app.routes import main_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


def create_app():
    app = FastAPI(
        title="Log App",
        description="Collect logs, see logs, send alerts",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )
    app.include_router(main_router)

    app.mount(
        "/assets",
        StaticFiles(directory=settings.base_dir / "frontend" / "dist" / "assets"),
        name="assets",
    )

    return app
