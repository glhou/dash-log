import datetime

from sqlmodel import Field, SQLModel

from app.core.constants.log_constants import LogLevel


class Log(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    service: str
    level: LogLevel
    message: str
    logger: str
    created_at: datetime.datetime = datetime.datetime.now()
