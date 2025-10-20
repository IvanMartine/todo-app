const API_URL = "http://localhost:3000";

async function loadTasks() {
  try {
    const res = await fetch(API_URL + "/tasks");
    const tasks = await res.json();
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    tasks.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t.title;
      li.className = t.completed ? "completed" : "";
      li.onclick = () => toggleTask(t.id, !t.completed);

      const del = document.createElement("button");
      del.textContent = "Eliminar";
      del.onclick = (e) => { e.stopPropagation(); deleteTask(t.id); };

      li.appendChild(del);
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Error cargando tareas");
  }
}

async function addTask(title) {
  try {
    await fetch(API_URL + "/tasks", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({title})
    });
    await loadTasks();
  } catch (err) {
    console.error(err);
    alert("Error creando tarea");
  }
}

async function toggleTask(id, completed) {
  try {
    await fetch(API_URL + `/tasks/${id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({completed})
    });
    await loadTasks();
  } catch (err) {
    console.error(err);
    alert("Error actualizando tarea");
  }
}

async function deleteTask(id) {
  try {
    await fetch(API_URL + `/tasks/${id}`, { method: "DELETE" });
    await loadTasks();
  } catch (err) {
    console.error(err);
    alert("Error eliminando tarea");
  }
}

document.getElementById("addBtn").addEventListener("click", () => {
  const input = document.getElementById("newTask");
  const value = input.value.trim();
  if (!value) return;
  addTask(value);
  input.value = "";
});

loadTasks();
