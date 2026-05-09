import logging
import sys

import dash_log_handler
from app.core import settings


def setup_logging():
    logging.raiseExceptions = True
    root_logger = logging.getLogger()

    root_logger.handlers.clear()

    root_logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    stream_handler = logging.StreamHandler(sys.stdout)

    stream_handler.setFormatter(formatter)

    root_logger.addHandler(stream_handler)

    if settings.dash_log_url:
        dl_handler = dash_log_handler.DashLogHandler(settings.dash_log_url, "dash-log")
        root_logger.addHandler(dl_handler)

    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
