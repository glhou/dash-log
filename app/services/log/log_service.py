from typing import Literal, Sequence

from pydantic import BaseModel
from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import col, select

from app.core.constants.log_constants import LogLevel
from app.models.log_models import Log


class ListLogsQuery(BaseModel):
    service: str | None = None
    level: LogLevel | None = None

    limit: int = 50
    offset: int = 0

    order_by: str = "id"
    order_dir: Literal["asc"] | Literal["desc"] = "asc"


def _filter_logs(stmt: Select[tuple[Log]], q: ListLogsQuery) -> Select[tuple[Log]]:
    if q.service:
        stmt = stmt.where(col(Log.service).ilike(f"%{q.service}%"))
    if q.level:
        stmt = stmt.where(col(Log.level) == q.level)
    return stmt


async def list_logs(session: AsyncSession, q: ListLogsQuery) -> Sequence[Log]:
    stmt = select(Log)
    stmt = _filter_logs(stmt, q)

    stmt = stmt.limit(q.limit)
    stmt = stmt.offset(q.offset)

    r = await session.execute(stmt)
    return r.scalars().all()
