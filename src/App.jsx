import { useState } from "react";
import Column from "./components/Column";
import TaskForm from "./components/TaskForm";

const COLUMNS = [
  { id: "todo", title: "Por hacer" },
  { id: "doing", title: "En progreso" },
  { id: "done", title: "Hecho" },
  { id: "review", title: "En revisión" },
];

const initialTasks = [
  { id: 1, title: "Diseñar la base de datos", status: "done", priority: "alta" },
  { id: 2, title: "Crear el login", status: "doing", priority: "media" },
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem("kanban-tasks");
  return saved ? JSON.parse(saved) : initialTasks;
});
  useEffect(() => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }, [tasks]);


  function addTask(title, priority) {
    // RETO 2: Evitar repetidos (sin importar mayúsculas)
    const existe = tasks.some(t => t.title.toLowerCase() === title.toLowerCase());
    if (existe) {
      return "Ya existe una tarea con ese nombre."; // Retorna el error
    }

    const newTask = { id: Date.now(), title, status: "todo", priority };
    setTasks([...tasks, newTask]);
    return null; // Todo salió bien
  }

  function moveTask(id, newStatus) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  // RETO 3: Eliminar todas las tareas terminadas
  function vaciarHechos() {
    setTasks(tasks.filter((t) => t.status !== "done"));
  }

  // RETO 4: Función para guardar el nuevo título
  function updateTaskTitle(id, newTitle) {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle } : t));
  }

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Kanban ({tasks.length} tareas)</h1>
        <button onClick={vaciarHechos} style={{ background: "#dc2626", color: "white" }}>
          Vaciar columna Hecho
        </button>
      </div>
      
      <TaskForm onAdd={addTask} />
      
      <div className="board">
        {COLUMNS.map((c) => (
          <Column
            key={c.id}
            title={c.title}
            tasks={tasks.filter((t) => t.status === c.id)}
            onMove={moveTask}
            onRemove={removeTask}
            onUpdateTitle={updateTaskTitle}
          />
        ))}
      </div>
    </main>
  );
}