# Crumbs — Backend

FastAPI backend for Crumbs, a personal restaurant tracker.

## Tech Stack

- **Python 3.12** with **uv** for dependency management
- **FastAPI** — REST API framework
- **SQLAlchemy** — ORM for database models
- **Alembic** — database migrations
- **Pydantic** — request/response validation
- **Argon2** — password hashing
- **Supabase** — hosted PostgreSQL database

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   └── v1/
│   │       ├── routers/        # HTTP endpoints (auth, restaurants, reviews, tags)
│   │       └── dependencies.py # Shared FastAPI dependencies (get_current_user)
│   ├── core/
│   │   ├── config.py           # App settings loaded from .env
│   │   ├── database.py         # SQLAlchemy engine and session
│   │   └── security.py         # Password hashing, API key generation
│   ├── models/                 # SQLAlchemy ORM models (DB tables)
│   ├── schemas/                # Pydantic models (API input/output)
│   ├── services/               # Business logic layer
│   ├── repositories/           # Database query layer
│   └── main.py                 # App factory, middleware, router registration
├── migrations/                 # Alembic migration files
│   └── versions/               # One file per migration
├── tests/
├── Dockerfile
├── pyproject.toml
├── alembic.ini
└── .env.example
```

## Getting Started

### 1. Install dependencies

```bash
uv sync
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```dotenv
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key
API_KEY_PREFIX=crumbs
```

### 3. Run migrations

```bash
uv run alembic upgrade head
```

### 4. Start the development server

```bash
uv run uvicorn src.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`

## API Overview

| Method | Endpoint                              | Description                   |
| ------ | ------------------------------------- | ----------------------------- |
| POST   | `/api/v1/auth/register`               | Register a new user           |
| POST   | `/api/v1/auth/login`                  | Login and retrieve API key    |
| GET    | `/api/v1/auth/me`                     | Get current user info         |
| POST   | `/api/v1/restaurants`                 | Create a restaurant           |
| GET    | `/api/v1/restaurants`                 | List restaurants with filters |
| GET    | `/api/v1/restaurants/{id}`            | Get a single restaurant       |
| PATCH  | `/api/v1/restaurants/{id}`            | Update a restaurant           |
| DELETE | `/api/v1/restaurants/{id}`            | Delete a restaurant           |
| POST   | `/api/v1/restaurants/{id}/mark-tried` | Mark as tried + add review    |
| POST   | `/api/v1/restaurants/{id}/mark-saved` | Move back to saved            |
| GET    | `/api/v1/tags`                        | List all tags                 |
| POST   | `/api/v1/tags`                        | Create a tag                  |
| GET    | `/api/v1/config/options`              | Get tags grouped by category  |

## Authentication

All protected endpoints require an API key in the Authorization header:

```
Authorization: Bearer crumbs_your_api_key_here
```

The API key is returned on register and login.

## Running Migrations

```bash
# Apply all pending migrations
uv run alembic upgrade head

# Create a new migration after changing models
uv run alembic revision --autogenerate -m "description of change"

# Roll back one migration
uv run alembic downgrade -1

# Check current migration status
uv run alembic current
```
