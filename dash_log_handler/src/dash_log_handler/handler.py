import json
import logging
import queue
import threading
from typing import TypedDict
from urllib.parse import urljoin
from urllib.request import HTTPRedirectHandler, Request, build_opener


class LogType(TypedDict):
    service: str
    message: str
    level: int
    logger: str


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        # Re-issue as POST instead of silently switching to GET
        return Request(
            newurl,
            data=req.data,
            headers=dict(req.headers),
            method=req.get_method(),
        )


class DashLogHandler(logging.Handler):
    """
    A handler class to use with dash-log: https://github.com/glhou/dash-log
    """

    def __init__(
        self,
        url: str,
        service_name: str,
        queue_max_size=10000,
        batch_size=10,
        *args,
        **kwargs,
    ):
        """
        Args:
            url (str): root url to dash-log instance
        """
        super().__init__(*args, **kwargs)
        self.url = url
        self.q: queue.Queue[LogType] = queue.Queue(queue_max_size)
        self.batch_size = batch_size
        self.worker = threading.Thread(
            target=self._worker_loop,
            daemon=True,
        )
        self.service_name = service_name
        self._opener = build_opener(NoRedirect())
        self.worker.start()

    def emit(self, record: logging.LogRecord):
        msg = record.getMessage()
        try:
            log: LogType = {
                "service": self.service_name,
                "message": msg,
                "level": record.levelno,
                "logger": record.name,
            }
            self.q.put(item=log)
        except queue.Full:
            print("Queue full can't send log: " + msg)

    def _worker_loop(self):
        while True:
            batch: list[LogType] = []

            try:
                item = self.q.get(timeout=1)

                batch.append(item)

                while not self.q.empty() and len(batch) < self.batch_size:
                    batch.append(self.q.get_nowait())

                try:
                    self._send_batch(batch)
                except Exception as e:
                    print("dash-log send failed:", e)

            except queue.Empty:
                continue

    def _send_batch(self, batch: list[LogType]):

        data = json.dumps(batch).encode("utf-8")

        url = urljoin(self.url, "/api/log")

        request = Request(
            url,
            data=data,
            headers={
                "Content-Type": "application/json",
            },
            method="POST",
        )

        with self._opener.open(request, timeout=5) as response:
            response.read()
