import { useEffect, useMemo, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const API = "http://localhost:3000/tasks";

  // Obtener tareas
  const fetchTasks = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Agregar tarea
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTasks();
  };

  // Cambiar estado completado
  const toggleTask = async (id, completed) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    fetchTasks();
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  // Contadores
  const pendingCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

  // Filtrar tareas
  const filteredTasks = useMemo(() => {
    if (filter === "pending") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: 420,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: 24,
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 12 }}>TODO App</h1>

        {/* Contador */}
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 16 }}>
          {pendingCount} pendientes · {completedCount} completadas
        </p>

        {/* Formulario */}
        <form
          onSubmit={addTask}
          style={{ display: "flex", gap: 8, marginBottom: 12 }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe una tarea..."
            style={{
              flex: 1,
              padding: "8px 10px",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Agregar
          </button>
        </form>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: 8,
              border: filter === "all" ? "2px solid #2563eb" : "1px solid #d1d5db",
              background: filter === "all" ? "#eff6ff" : "#fff",
              cursor: "pointer",
            }}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("pending")}
            style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: 8,
              border: filter === "pending" ? "2px solid #2563eb" : "1px solid #d1d5db",
              background: filter === "pending" ? "#eff6ff" : "#fff",
              cursor: "pointer",
            }}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter("completed")}
            style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: 8,
              border: filter === "completed" ? "2px solid #2563eb" : "1px solid #d1d5db",
              background: filter === "completed" ? "#eff6ff" : "#fff",
              cursor: "pointer",
            }}
          >
            Completadas
          </button>
        </div>

        {/* Lista */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "8px 10px",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                marginBottom: 8,
                background: "#fafafa",
              }}
            >
              <span
                onClick={() => toggleTask(task.id, !task.completed)}
                title="Click para completar"
                style={{
                  flex: 1,
                  cursor: "pointer",
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#6b7280" : "#111827",
                }}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
          {filteredTasks.length === 0 && (
            <li style={{ textAlign: "center", color: "#9ca3af", padding: 10 }}>
              No hay tareas para este filtro.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
