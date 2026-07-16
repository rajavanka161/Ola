from typing import Optional

from pydantic import BaseModel, Field, field_validator


class TodoCreate(BaseModel):
    text: str = Field(..., min_length=1)

    @field_validator("text")
    @classmethod
    def strip_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("text must not be empty")
        return value


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None

    @field_validator("text")
    @classmethod
    def strip_text(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        value = value.strip()
        if not value:
            raise ValueError("text must not be empty")
        return value


class TodoOut(BaseModel):
    id: int
    text: str
    completed: bool
    created_at: str

    model_config = {"from_attributes": True}
