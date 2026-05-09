from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://user:pass@localhost:5432/logapp"
    base_dir: Path = Path(__file__).parent.parent.parent
    dash_log_url: str = ""

    model_config = SettingsConfigDict(
        env_file=(".env.local", ".env.dev", ".env", ".env.prod")
    )
