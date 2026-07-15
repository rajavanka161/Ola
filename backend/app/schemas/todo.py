from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator

Priority = Literal["low", "medium", "high"]


class TodoCreate(BaseModel):
    title: str
    due_date: date | None = None
    priority: Priority | None = None
    label: str | None = None

    @field_validator("title")
    @classmethod
    def title_required(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("title is required")
        return value


class TodoUpdate(BaseModel):
    title: str
    due_date: date | None = None
    priority: Priority | None = None
    label: str | None = None
    completed: bool

    @field_validator("title")
    @classmethod
    def title_required(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("title is required")
        return value


class TodoOut(BaseModel):
    id: UUID
    title: str
    due_date: date | None
    priority: Priority | None
    label: str | None
    completed: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
