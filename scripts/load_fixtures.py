import logging
import random
from enum import IntEnum

import niquests


class LogLevel(IntEnum):
    Debug = logging.DEBUG
    Info = logging.INFO
    Warning = logging.WARNING
    Error = logging.ERROR
    Critical = logging.CRITICAL


services = ["marketplace", "shipping", "dashboard", "backend"]
messages = [
    "An unexpected error occurred.",
    "Something went wrong while processing the request.",
    "Please try again later.",
    "The order was expected to exist, but no matching record was found.",
    "The operation could not be completed.",
    "A server-side error occurred.",
    "The request failed due to an internal error.",
    "Unable to process the request at this time.",
    "The resource could not be found.",
    "An invalid state was detected.",
    "The transaction could not be completed.",
    "A database error occurred while processing the request.",
    "The requested operation is not available.",
    "The request timed out before completion.",
    "An authentication error occurred.",
    "You do not have permission to perform this action.",
    "A required field is missing.",
    "The provided data is invalid.",
    "The service is temporarily unavailable.",
    "Failed to establish a connection to the server.",
    "An unexpected condition prevented completion of the request.",
]
loggers = [
    "app.core",
    "app.routes.api.special_routes",
    "sqlalchemy.error",
    "uvicorn.error",
]


def make_logs(n: int) -> list[dict]:
    return [
        {
            "service": random.choice(services),
            "level": random.choice(list(LogLevel)),
            "message": random.choice(messages),
            "logger": random.choice(loggers),
        }
        for _ in range(n)
    ]


def send_fixture(n: int = 1000):
    logs = make_logs(n)
    niquests.post("http://localhost:8000/api/log", json=logs)


if __name__ == "__main__":
    send_fixture()
