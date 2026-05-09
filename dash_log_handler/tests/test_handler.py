import json
import logging
import time
from unittest.mock import MagicMock

from dash_log_handler import DashLogHandler


class MockResponse:
    def __enter__(self):
        return self

    def __exit__(self, *args): ...

    def read(self):
        return b"ok"


def test_handler(monkeypatch):

    captured = {}

    def mock_open(request, timeout):
        captured["url"] = request.full_url
        captured["data"] = request.data
        captured["timeout"] = timeout

        return MockResponse()

    mock_opener = MagicMock()
    mock_opener.open.side_effect = mock_open

    monkeypatch.setattr("dash_log_handler.handler.build_opener", lambda *a: mock_opener)

    logger = logging.getLogger("test")

    logger.setLevel(logging.INFO)

    handler = DashLogHandler(
        "http://localhost:8000",
        "test-service",
    )

    logger.addHandler(handler)

    logger.info("hello world")

    time.sleep(1)

    payload = json.loads(captured["data"])

    assert captured["url"] == "http://localhost:8000/api/log"
    assert payload[0]["message"] == "hello world"
    assert payload[0]["service"] == "test-service"
