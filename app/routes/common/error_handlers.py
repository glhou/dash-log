import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.constants.log_constants import LogLevel
from app.routes.common.message_output import Message, MessageOutput

logger = logging.getLogger(__name__)


def register_error_handler(app: FastAPI) -> FastAPI:
    @app.exception_handler(Exception)
    async def general_error_handler(request: Request, exc: Exception):
        logger.critical("An error occured: %s when calling %s", exc, request.url)
        return JSONResponse(
            MessageOutput(
                result=None,
                messages=[Message(level=LogLevel.Critical, message="An error occured")],
            ).model_dump(mode="json"),
            status_code=500,
        )

    return app
