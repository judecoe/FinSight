from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router as api_router
from app.db.session import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://localhost:5173"]  # Update for Vercel domain on deployment

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
