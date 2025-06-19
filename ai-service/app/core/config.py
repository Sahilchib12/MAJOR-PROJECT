from pydantic import BaseSettings
# from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Job Service"
    HOST: str = "localhost"
    PORT: int = 5000
    DEBUG: bool = True
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    class Config:
        env_file = ".env"

settings = Settings()