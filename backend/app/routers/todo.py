from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoOut, TodoUpdate

# API CONTRACT
# GET  /api/todos
#   query: search?: str, completed?: bool, priority?: 'low'|'medium'|'high', label?: str
#   response: [TodoOut]
# POST /api/todos
#   request: {title: str, due_date: string|null, priority: 'low'|'medium'|'high'|null, label: string|null}
#   response: TodoOut
# PUT  /api/todos/{id}
#   request: {title: str, due_date: string|null, priority: 'low'|'medium'|'high'|null, label: string|null, completed: bool}
#   response: TodoOut
# DELETE /api/todos/{id}
#   response: 204 No Content

router = APIRouter(prefix="/api/todos", tags=["todos"])


@router.get("", response_model=list[TodoOut])
async def list_todos(
    search: str | None = None,
    completed: bool | None = None,
    priority: str | None = Query(default=None, pattern="^(low|medium|high)$"),
    label: str | None = None,
    db: Session = Depends(get_db),
) -> list[Todo]:
    stmt = select(Todo)
    if search:
        like = f"%{search}%"
        stmt = stmt.where(Todo.title.ilike(like))
    if completed is not None:
        stmt = stmt.where(Todo.completed.is_(completed))
    if priority is not None:
        stmt = stmt.where(Todo.priority == priority)
    if label is not None:
        stmt = stmt.where(Todo.label == label)
    return list(db.scalars(stmt).all())


@router.post("", response_model=TodoOut, status_code=status.HTTP_201_CREATED)
async def create_todo(body: TodoCreate, db: Session = Depends(get_db)) -> Todo:
    todo = Todo(
        title=body.title,
        due_date=body.due_date,
        priority=body.priority,
        label=body.label,
        completed=False,
    )
    db.add(todo)
    db.flush()
    return todo


@router.put("/{todo_id}", response_model=TodoOut)
async def update_todo(todo_id: UUID, body: TodoUpdate, db: Session = Depends(get_db)) -> Todo:
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="todo not found")
    todo.title = body.title
    todo.due_date = body.due_date
    todo.priority = body.priority
    todo.label = body.label
    todo.completed = body.completed
    db.flush()
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: UUID, db: Session = Depends(get_db)) -> None:
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="todo not found")
    db.delete(todo)
