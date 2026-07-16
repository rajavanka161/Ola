from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoOut, TodoUpdate

router = APIRouter(prefix="/api/todos", tags=["todos"])


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


def _todo_out(todo: Todo) -> TodoOut:
    created_at = todo.created_at
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    return TodoOut(
        id=todo.id,
        text=todo.text,
        completed=todo.completed,
        created_at=created_at.isoformat(),
    )


@router.get("", response_model=list[TodoOut])
async def list_todos(db: Session = Depends(get_db)) -> list[TodoOut]:
    todos = db.query(Todo).order_by(Todo.id.asc()).all()
    return [_todo_out(todo) for todo in todos]


@router.post("", response_model=TodoOut, status_code=status.HTTP_201_CREATED)
async def create_todo(body: TodoCreate, db: Session = Depends(get_db)) -> TodoOut:
    todo = Todo(text=body.text, completed=False)
    db.add(todo)
    db.flush()
    db.refresh(todo)
    return _todo_out(todo)


@router.patch("/{todo_id}", response_model=TodoOut)
async def update_todo(todo_id: int, body: TodoUpdate, db: Session = Depends(get_db)) -> TodoOut:
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="todo not found")
    if body.text is not None:
        todo.text = body.text
    if body.completed is not None:
        todo.completed = body.completed
    db.flush()
    db.refresh(todo)
    return _todo_out(todo)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: int, db: Session = Depends(get_db)) -> Response:
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="todo not found")
    db.delete(todo)
    db.flush()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
