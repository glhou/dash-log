from pydantic import BaseModel

from app.core.constants.log_constants import LogLevel


class Message(BaseModel):
    level: LogLevel
    message: str


class MessageOutput[T](BaseModel):
    result: T
    messages: list[Message] = []
