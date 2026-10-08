import { useEffect, useState, useMemo } from "react";
import Column from "./components/Column";
import TaskForm from "./components/TaskForm";
import { COLUMNS } from "./columns";
import { useBoard } from "./context/BoardContext";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  // Tomamos los datos y funciones del Cerebro
  const { tasks, vaciarHechos, resetBoard } = useBoard();
  const [query, setQuery] = useLocalStorage("kanban-search-query", "");

  useEffect(() => {
    const pendingTasks = tasks.filter(t => t.status !== "done");
    document.title = `Kanban (${pendingTasks.length} pendientes)`;
  }, [tasks]); 

  const filteredTasks = useMemo(
    () => tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())),
    [tasks, query]
  );

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Kanban ({tasks.length} tareas)</h1>
        <button onClick={vaciarHechos} style={{ background: "#dc2626", color: "white" }}>
          Vaciar columna Hecho
        </button>
      </div>
      
      <TaskForm />
      
      <input
        className="search"
        placeholder="Buscar tareas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ margin: "15px 0", padding: "8px", width: "100%", maxWidth: "300px", display: "block" }}
      />

      <button onClick={() => { resetBoard(); setQuery(""); }} style={{ margin: "10px 0", padding: "8px 12px", cursor: "pointer", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "4px" }}>
        Restablecer tablero
      </button>

      <div className="board">
        {COLUMNS.map((c) => (
          <Column
            key={c.id}
            title={c.title}
            tasks={filteredTasks.filter((t) => t.status === c.id)}
          />
        ))}
      </div>
    </main>
  );
}