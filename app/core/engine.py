from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlmodel import SQLModel

from app.core import settings

engine = None


def get_engine():
    global engine
    if not engine:
        engine = create_async_engine(settings.database_url, echo=True)
    return engine


def get_async_sessionmaker(
    engine: AsyncEngine | None = None,
) -> async_sessionmaker[AsyncSession]:
    if not engine:
        engine = get_engine()
    return async_sessionmaker(engine, expire_on_commit=False)


async def init_db(engine: AsyncEngine | None = None):
    if not engine:
        engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with get_async_sessionmaker()() as session:
        yield session
