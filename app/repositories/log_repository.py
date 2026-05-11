from datetime import datetime
from typing import Literal, Sequence

from pydantic import BaseModel
from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.functions import count
from sqlmodel import col, select

from app.core.constants.log_constants import LogLevel
from app.models.log_models import Log


class ListLogsQuery(BaseModel):
    service: str | None = None
    logger: str | None = None
    level: LogLevel | None = None

    start_time: datetime | None = None
    end_time: datetime | None = None

    limit: int = 50
    offset: int = 0

    order_by: str = "id"
    order_dir: Literal["asc"] | Literal["desc"] = "asc"


def _filter_logs(stmt: Select[tuple[Log]], q: ListLogsQuery) -> Select[tuple[Log]]:
    if q.service:
        stmt = stmt.where(col(Log.service) == q.service)
    if q.logger:
        stmt = stmt.where(col(Log.logger) == q.logger)
    if q.level:
        stmt = stmt.where(col(Log.level) == q.level)
    if q.start_time:
        stmt = stmt.where(col(Log.created_at) >= q.start_time)
    if q.end_time:
        stmt = stmt.where(col(Log.created_at < q.end_time))
    return stmt


async def list_logs(session: AsyncSession, q: ListLogsQuery) -> Sequence[Log]:
    stmt = select(Log)
    stmt = _filter_logs(stmt, q)

    stmt = stmt.limit(q.limit)
    stmt = stmt.offset(q.offset)

    r = await session.execute(stmt)
    return r.scalars().all()


async def list_services(session: AsyncSession) -> Sequence[str]:
    # TODO: Filter per user / tenant later
    stmt = select(Log.service)
    stmt = stmt.distinct()
    r = await session.execute(stmt)
    return r.scalars().all()


async def list_loggers(session: AsyncSession, service_name: str) -> Sequence[str]:
    # TODO: Filter per user / tenant later
    stmt = select(Log.logger)
    stmt.where(Log.service == service_name)
    stmt = stmt.distinct()
    r = await session.execute(stmt)
    return r.scalars().all()


async def count_frequent_loggers(
    session: AsyncSession,
    max_number: int,
    start: datetime,
    end: datetime,
) -> Sequence[tuple[str, int]]:
    # TODO: Filter per user / tenant later
    stmt = select(col(Log.logger), count().label("count"))
    stmt = stmt.group_by(Log.logger)
    stmt = stmt.order_by(count().desc())
    stmt = stmt.where(col(Log.created_at) >= start)
    stmt = stmt.where(col(Log.created_at < end))
    stmt = stmt.limit(max_number)
    r = await session.execute(stmt)
    return r.scalars().all()


async def count_frequent_levels(
    session: AsyncSession, start: datetime, end: datetime
) -> Sequence[tuple[LogLevel, int]]:
    stmt = select(col(Log.level), count().label("count"))
    stmt = stmt.group_by(col(Log.level))
    stmt = stmt.order_by(count().desc())
    stmt = stmt.where(col(Log.created_at) >= start)
    stmt = stmt.where(col(Log.created_at < end))
    r = await session.execute(stmt)
    return r.scalars().all()
