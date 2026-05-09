import logging
from typing import Annotated

from fastapi import APIRouter, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.log_models import Log
from app.routes.common.message_output import MessageOutput
from app.routes.dependencies.session_dependency import SessionDep
from app.services import log_service

log_router = APIRouter(prefix="/log", tags=["log"])

logger = logging.getLogger(__name__)


@log_router.get("/")
async def list_logs(
    q: Annotated[log_service.ListLogsQuery, Query()], session: AsyncSession = SessionDep
):
    logs = await log_service.list_logs(session, q)
    return MessageOutput(result=logs)


@log_router.get("/services")
async def list_services(session: AsyncSession = SessionDep):
    services = await log_service.list_available_services(session)
    return MessageOutput(result=services)


@log_router.post("/")
async def save_logs(logs: list[Log], session: AsyncSession = SessionDep):
    logs = await log_service.save_logs(session, logs)
    return MessageOutput(result=logs)
