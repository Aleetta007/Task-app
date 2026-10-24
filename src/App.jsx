
import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  async function loadTasks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load tasks");

      const data = await response.json();
      setTasks(data);
      setApiError("");
    } catch {
      setApiError(
        "Backend unavailable. Check that the server and MongoDB are running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not add task");

      setTasks(previous => [data, ...previous]);
      setNewTask("");
      setApiError("");
    } catch {
      setApiError("Unable to add task. Check your backend connection.");
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API_URL}/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const updated = await response.json();
      if (!response.ok) throw new Error();

      setTasks(previous =>
        previous.map(item => item._id === task._id ? updated : item)
      );
      setApiError("");
    } catch {
      setApiError("Unable to update task. Check your backend connection.");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      setTasks(previous => previous.filter(task => task._id !== id));
      setApiError("");
    } catch {
      setApiError("Unable to delete task. Check your backend connection.");
    }
  }

  function startEditing(task) {
    setEditingId(task._id);
    setEditText(task.title);
  }

  async function saveEdit(id) {
    if (!editText.trim()) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editText.trim() }),
      });

      const updated = await response.json();
      if (!response.ok) throw new Error();

      setTasks(previous =>
        previous.map(task => task._id === id ? updated : task)
      );
      setEditingId(null);
      setEditText("");
      setApiError("");
    } catch {
      setApiError("Unable to edit task. Check your backend connection.");
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <main className="page">
      <section className="todo-card">
        <header className="header">
          <div className="brand-icon">✓</div>
          <p className="eyebrow">YOUR PERSONAL SPACE</p>
          <h1>My Tasks</h1>
          <p className="subtitle">Small steps make big progress.</p>
        </header>

        {apiError && (
          <p role="alert" className="api-error">{apiError}</p>
        )}

        <div className="stats">
          <div>
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total tasks</span>
          </div>
          <div>
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div>
            <span className="stat-number">{tasks.length - completedCount}</span>
            <span className="stat-label">Remaining</span>
          </div>
        </div>

        <form className="add-form" onSubmit={addTask}>
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="What needs to get done?"
            aria-label="New task"
            maxLength={200}
          />
          <button className="add-button" type="submit">+ Add</button>
        </form>

        <nav className="filters" aria-label="Filter tasks">
          {["All", "Active", "Completed"].map(item => (
            <button
              key={item}
              type="button"
              className={filter === item ? "filter active-filter" : "filter"}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="task-list">
          {loading ? (
            <p className="empty-state">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <span>✦</span>
              <p>No tasks here yet.</p>
              <small>Add a task and get started!</small>
            </div>
          ) : (
            filteredTasks.map(task => (
              <article className="task-row" key={task._id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                  aria-label={`Mark ${task.title} as completed`}
                />

                {editingId === task._id ? (
                  <form
                    className="edit-form"
                    onSubmit={e => {
                      e.preventDefault();
                      saveEdit(task._id);
                    }}
                  >
                    <input
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      autoFocus
                      maxLength={200}
                      aria-label="Edit task"
                    />
                    <button className="icon-button" type="submit">Save</button>
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <span className={task.completed ? "task-title completed" : "task-title"}>
                      {task.title}
                    </span>
                    <div className="task-actions">
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => startEditing(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="icon-button delete-button"
                        type="button"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))
          )}
        </div>

        <footer className="footer">
          Keep going, one task at a time.
        </footer>
      </section>
    </main>
  );
}

export default App;
