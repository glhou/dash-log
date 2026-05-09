from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.staticfiles import StaticFiles

from app.core import settings
from app.core.engine import init_db
from app.core.logging import setup_logging
from app.routes import main_router
from app.routes.common.error_handlers import register_error_handler


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


def create_app():
    setup_logging()
    app = FastAPI(
        title="Log App",
        description="Collect logs, see logs, send alerts",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )
    app = register_error_handler(app)
    app.include_router(main_router)

    app.mount(
        "/assets",
        StaticFiles(directory=settings.base_dir / "frontend" / "dist" / "assets"),
        name="assets",
    )

    return app
