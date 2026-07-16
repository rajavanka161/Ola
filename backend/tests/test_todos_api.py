from datetime import date

# AC-1: A user can create a todo with title and optional due date, priority, and label.
# AC-2: A user can edit an existing todo's content and metadata, and the updated values persist.
# AC-3: A user can delete a todo and it no longer appears in the list after refresh.
# AC-4: A user can toggle a todo between complete and incomplete states, and the state persists.
# AC-5: The app provides search and at least one filter control that narrows the visible todo list based on todo data.
# AC-6: Backend unit tests cover core todo API behavior, including create, update, delete, and completion-state changes.


def _todo_payload(title="Buy milk", due_date=None, priority=None, label=None):
    payload = {"title": title, "due_date": due_date, "priority": priority, "label": label}
    return payload


def _assert_todo_shape(todo):
    assert set(todo) == {
        "id",
        "title",
        "due_date",
        "priority",
        "label",
        "completed",
        "created_at",
        "updated_at",
    }


def test_post_todos_creates_todo_with_optional_metadata(client):
    resp = client.post(
        "/api/todos",
        json=_todo_payload(title="Write tests", due_date="2026-01-20", priority="high", label="work"),
    )

    assert resp.status_code == 201
    data = resp.json()
    _assert_todo_shape(data)
    assert data["title"] == "Write tests"
    assert data["due_date"] == "2026-01-20"
    assert data["priority"] == "high"
    assert data["label"] == "work"
    assert data["completed"] is False


def test_post_todos_creates_todo_with_null_optional_fields(client):
    resp = client.post("/api/todos", json=_todo_payload(title="Plan sprint"))

    assert resp.status_code == 201
    data = resp.json()
    _assert_todo_shape(data)
    assert data["due_date"] is None
    assert data["priority"] is None
    assert data["label"] is None


def test_put_todos_updates_title_metadata_and_completion(client):
    created = client.post(
        "/api/todos",
        json=_todo_payload(title="Initial", due_date="2026-01-01", priority="low", label="home"),
    ).json()

    resp = client.put(
        f"/api/todos/{created['id']}",
        json={
            "title": "Updated",
            "due_date": "2026-02-02",
            "priority": "medium",
            "label": "work",
            "completed": True,
        },
    )

    assert resp.status_code == 200
    data = resp.json()
    _assert_todo_shape(data)
    assert data["title"] == "Updated"
    assert data["due_date"] == "2026-02-02"
    assert data["priority"] == "medium"
    assert data["label"] == "work"
    assert data["completed"] is True


def test_delete_todos_removes_todo_and_returns_204(client):
    created = client.post("/api/todos", json=_todo_payload(title="Delete me")).json()

    resp = client.delete(f"/api/todos/{created['id']}")

    assert resp.status_code == 204
    assert resp.content == b""
    list_resp = client.get("/api/todos")
    assert list_resp.status_code == 200
    assert list_resp.json() == []


def test_put_todos_toggles_completed_state(client):
    created = client.post("/api/todos", json=_todo_payload(title="Toggle me")).json()

    completed_resp = client.put(
        f"/api/todos/{created['id']}",
        json={"title": "Toggle me", "due_date": None, "priority": None, "label": None, "completed": True},
    )
    assert completed_resp.status_code == 200
    assert completed_resp.json()["completed"] is True

    incomplete_resp = client.put(
        f"/api/todos/{created['id']}",
        json={"title": "Toggle me", "due_date": None, "priority": None, "label": None, "completed": False},
    )
    assert incomplete_resp.status_code == 200
    assert incomplete_resp.json()["completed"] is False


def test_get_todos_filters_by_search_completed_priority_and_label(client):
    client.post(
        "/api/todos",
        json=_todo_payload(title="Buy milk", due_date="2026-01-10", priority="high", label="home"),
    )
    client.post(
        "/api/todos",
        json=_todo_payload(title="Write report", due_date="2026-01-11", priority="medium", label="work"),
    )
    completed = client.post(
        "/api/todos",
        json=_todo_payload(title="Buy bread", due_date="2026-01-12", priority="high", label="home"),
    ).json()
    client.put(
        f"/api/todos/{completed['id']}",
        json={"title": "Buy bread", "due_date": "2026-01-12", "priority": "high", "label": "home", "completed": True},
    )

    search_resp = client.get("/api/todos", params={"search": "Buy"})
    assert search_resp.status_code == 200
    assert len(search_resp.json()) == 2

    completed_resp = client.get("/api/todos", params={"completed": True})
    assert completed_resp.status_code == 200
    assert len(completed_resp.json()) == 1
    assert completed_resp.json()[0]["completed"] is True

    priority_resp = client.get("/api/todos", params={"priority": "high"})
    assert priority_resp.status_code == 200
    assert len(priority_resp.json()) == 2

    label_resp = client.get("/api/todos", params={"label": "work"})
    assert label_resp.status_code == 200
    assert len(label_resp.json()) == 1
    assert label_resp.json()[0]["label"] == "work"


def test_post_todos_missing_title_returns_422(client):
    resp = client.post("/api/todos", json={"due_date": None, "priority": None, "label": None})

    assert resp.status_code == 422


def test_post_todos_malformed_due_date_returns_422(client):
    resp = client.post("/api/todos", json=_todo_payload(title="Bad date", due_date="not-a-date"))

    assert resp.status_code == 422


def test_post_todos_unsupported_priority_returns_422(client):
    resp = client.post("/api/todos", json=_todo_payload(title="Bad priority", priority="urgent"))

    assert resp.status_code == 422


def test_put_todos_missing_id_returns_404(client):
    resp = client.put(
        "/api/todos/00000000-0000-0000-0000-000000000000",
        json={"title": "Missing", "due_date": None, "priority": None, "label": None, "completed": False},
    )

    assert resp.status_code == 404
    assert resp.json() == {"detail": "todo not found"}


def test_delete_todos_missing_id_returns_404(client):
    resp = client.delete("/api/todos/00000000-0000-0000-0000-000000000000")

    assert resp.status_code == 404
    assert resp.json() == {"detail": "todo not found"}
