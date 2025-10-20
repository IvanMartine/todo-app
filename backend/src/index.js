const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Crear tabla si no existe
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
})();

// Endpoints CRUD
app.get("/tasks", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener tareas:", err);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error al crear la tarea:", err);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const { rows } = await pool.query(
      "UPDATE tasks SET completed=$1 WHERE id=$2 RETURNING *",
      [completed, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Error al actualizar la tarea:", err);
    res.status(500).json({ error: "Error al actualizar la tarea" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Error al eliminar la tarea:", err);
    res.status(500).json({ error: "Error al eliminar la tarea" });
  }
});

app.listen(3000, "0.0.0.0", () =>
  console.log("✅ Servidor backend corriendo en el puerto 3000")
);
