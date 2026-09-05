import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db.database import Base, engine

from app.api.profile import router as profile_router
from app.api.dashboard import router as dashboard_router
from app.api.notification import router as notification_router

# Models
from app.models.user import User
from app.models.team import Team
from app.models.application import Application
from app.models.team_member import TeamMember
from app.models.notification import Notification

# Routers
from app.api.auth import router as auth_router
from app.api.team import router as team_router
from app.api.application import router as application_router

# Create Database Tables
try:
    print("Verifying database tables on startup...")
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")
except Exception as e:
    print(f"Warning: Database initialization error on startup: {e}")

app = FastAPI(
    title="TeamMate Finder API",
    version="1.0.0",
    description="College Exclusive Team Finding Platform for Rathinam College",
)

FRONTEND_URL = os.getenv("FRONTEND_URL")

allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
]

if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Create Upload Folder
# ----------------------------

UPLOAD_DIR = "uploads/profile"

os.makedirs(UPLOAD_DIR, exist_ok=True)

# ----------------------------
# Static Files
# ----------------------------

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# ----------------------------
# Routers
# ----------------------------

app.include_router(auth_router)
app.include_router(team_router)
app.include_router(application_router)
app.include_router(profile_router)
app.include_router(notification_router)
app.include_router(dashboard_router)

# ----------------------------
# Root
# ----------------------------

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "TeamMate Finder API Running",
        "version": "1.0.0",
        "status": "healthy",
    }