from pydantic_settings import BaseSettings, SettingsConfigDict


class _APISetting(BaseSettings):
    api_header: str = "X-API-Key"
    api_key: str

    model_config = SettingsConfigDict(
        env_file="./.env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = _APISetting()