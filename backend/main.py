# API CONTRACT
# GET  /api/todos
#   response: [ {"id": number, "text": string, "completed": boolean, "created_at": string}, ... ]
# POST /api/todos
#   request:  {"text": string}
#   response: {"id": number, "text": string, "completed": boolean, "created_at": string}
# PATCH /api/todos/{id}
#   request:  {"text": string | null, "completed": boolean | null}
#   response: {"id": number, "text": string, "completed": boolean, "created_at": string}
# DELETE /api/todos/{id}
#   response: 204 no body

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import todos


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Ola API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(todos.router)
