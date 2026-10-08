import { useLocalStorage } from "./hooks/useLocalStorage";
// 1. Añadimos useState y useMemo a las importaciones
import { useEffect, useState, useMemo } from "react";
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
  const [tasks, setTasks] = useLocalStorage("kanban-tasks", initialTasks);
  
  // 2. NUEVO: Estado para guardar lo que el usuario escribe en el buscador
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 3. NUEVO: useMemo filtra las tareas y recuerda el resultado para ahorrar memoria
  const filteredTasks = useMemo(
    () =>
      tasks.filter((t) =>
        t.title.toLowerCase().includes(query.toLowerCase())
      ),
    [tasks, query]
  );

  function addTask(title, priority) {
    const existe = tasks.some(t => t.title.toLowerCase() === title.toLowerCase());
    if (existe) {
      return "Ya existe una tarea con ese nombre."; 
    }

    const newTask = { id: Date.now(), title, status: "todo", priority };
    setTasks([...tasks, newTask]);
    return null; 
  }

  function moveTask(id, newStatus) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function vaciarHechos() {
    setTasks(tasks.filter((t) => t.status !== "done"));
  }

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
      
      {/* 4. NUEVO: Barra de búsqueda conectada al estado 'query' */}
      <input
        className="search"
        placeholder="Buscar tareas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ margin: "15px 0", padding: "8px", width: "100%", maxWidth: "300px", display: "block" }}
      />

      <div className="board">
        {COLUMNS.map((c) => (
          <Column
            key={c.id}
            title={c.title}
            /* ¡Clave! Cambiamos tasks por filteredTasks para que el tablero obedezca al buscador */
            tasks={filteredTasks.filter((t) => t.status === c.id)}
            onMove={moveTask}
            onRemove={removeTask}
            onUpdateTitle={updateTaskTitle}
          />
        ))}
      </div>
    </main>
  );
}