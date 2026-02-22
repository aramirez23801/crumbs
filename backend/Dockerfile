FROM python:3.12-slim

WORKDIR /app

RUN pip install uv

COPY pyproject.toml .
COPY uv.lock .
RUN uv sync --frozen --no-dev

COPY . .

EXPOSE ${PORT:-8000}

CMD uv run alembic upgrade head && uv run uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}