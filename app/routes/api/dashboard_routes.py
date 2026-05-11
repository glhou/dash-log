import logging
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

logger = logging.getLogger(__name__)


@dashboard_router.get("/stats/alert")
async def get_dashboard_alert_stats(
    alert_filter: Annotated[AlertFilter, Query()], session=SessionDep
):
    alert_logs = await dashboard_service.get_alert_logs(session, alert_filter)
    return MessageOutput(result=alert_logs)


@dashboard_router.get("/stats/logger-occurence")
async def get_dashboard_logger_stats(
    occurence_filter: Annotated[OccurenceFilter, Query()], session=SessionDep
):
    occurence = await dashboard_service.get_frequent_logger_occurence(
        session, occurence_filter
    )
    print(occurence)
    return MessageOutput(
        result=[{"logger": freq[0], "occurence": freq[1]} for freq in occurence]
    )


@dashboard_router.get("/stats/level")
async def get_dashboard_level_stats(
    level_frequency_filter: Annotated[LevelFrequencyFilter, Query()], session=SessionDep
):
    level_frequency = await dashboard_service.get_level_frequency(
        session, level_frequency_filter
    )
    return MessageOutput(
        result=[{"level": freq[0], "occurence": freq[1]} for freq in level_frequency]
    )
