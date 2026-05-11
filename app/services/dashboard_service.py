import datetime
from typing import Sequence

from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants.log_constants import LogLevel
from app.models import Log
from app.repositories import log_repository


class Timespan(BaseModel):
    start_time: datetime.datetime = datetime.datetime.now(
        datetime.UTC
    ) - datetime.timedelta(days=7)
    end_time: datetime.datetime = datetime.datetime.now(datetime.UTC)


class AlertFilter(Timespan):
    log_level: LogLevel = LogLevel.Critical

    limit: int = 50
    offset: int = 0


async def get_alert_logs(
    session: AsyncSession, alert_filter: AlertFilter
) -> Sequence[Log]:
    return await log_repository.list_logs(
        session,
        log_repository.ListLogsQuery(
            level=alert_filter.log_level,
            limit=alert_filter.limit,
            offset=alert_filter.offset,
            start_time=alert_filter.start_time,
            end_time=alert_filter.end_time,
        ),
    )


class OccurenceFilter(Timespan):
    number: int = 10


async def get_frequent_logger_occurence(
    session: AsyncSession, occurence_filter: OccurenceFilter
) -> Sequence[tuple[str, int]]:
    return await log_repository.count_frequent_loggers(
        session,
        occurence_filter.number,
        occurence_filter.start_time,
        occurence_filter.end_time,
    )


class LevelFrequencyFilter(Timespan): ...


async def get_level_frequency(
    session: AsyncSession, level_frequency_filter: LevelFrequencyFilter
) -> Sequence[tuple[LogLevel, int]]:
    return await log_repository.count_frequent_levels(
        session,
        level_frequency_filter.start_time,
        level_frequency_filter.end_time,
    )
