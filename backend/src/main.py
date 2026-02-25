from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.v1.routers import auth, restaurants, reviews, tags, places

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Starting {settings.app_name} v{settings.app_version}")
    yield
    print(f"Shutting down {settings.app_name}")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
    lifespan=lifespan,
)

origins = settings.allowed_origins.split(",")
allow_credentials = "*" not in origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(restaurants.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(tags.router, prefix="/api/v1")
app.include_router(places.router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "ok", "version": settings.app_version}