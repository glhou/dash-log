from typing import Annotated

from fastapi import APIRouter, Query

from app.routes.common.message_output import MessageOutput
from app.routes.dependencies.session_dependency import SessionDep
from app.services import dashboard_service
from app.services.dashboard_service import (
    AlertFilter,
    LevelFrequencyFilter,
    OccurenceFilter,
)

dashboard_router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@dashboard_router.get("/stats/alert")
async def get_dashboad_alert_stats(
    alert_filter: Annotated[AlertFilter, Query()], session=SessionDep
):
    alert_logs = await dashboard_service.get_alert_logs(session, alert_filter)
    return MessageOutput(result=alert_logs)


@dashboard_router.get("/stats/logger")
async def get_dashboad_logger_stats(
    occurence_filter: Annotated[OccurenceFilter, Query()], session=SessionDep
):
    occurence = await dashboard_service.get_frequent_logger_occurence(
        session, occurence_filter
    )
    return MessageOutput(result=occurence)


@dashboard_router.get("/stats/level")
async def get_dashboad_level_stats(
    level_frequency_filter: Annotated[LevelFrequencyFilter, Query()], session=SessionDep
):
    level_frequency = await dashboard_service.get_level_frequency(
        session, level_frequency_filter
    )
    return MessageOutput(result=level_frequency)
