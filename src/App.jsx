import { useEffect, useState, useMemo } from "react";
import Column from "./components/Column";
import TaskForm from "./components/TaskForm";
import { COLUMNS } from "./columns";
import { useBoard } from "./context/BoardContext";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  // 1. Añadimos loading y error al destructuring
  const { tasks, loading, error, vaciarHechos, resetBoard } = useBoard();
  const [query, setQuery] = useLocalStorage("kanban-search-query", "");

  useEffect(() => {
    // Validación de seguridad: si tasks aún no carga, no intentamos filtrar
    if (!tasks) return; 
    const pendingTasks = tasks.filter(t => t.status !== "done");
    document.title = `Kanban (${pendingTasks.length} pendientes)`;
  }, [tasks]); 

  const filteredTasks = useMemo(
    () => {
      if (!tasks) return [];
      return tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
    },
    [tasks, query]
  );

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Kanban ({tasks ? tasks.length : 0} tareas)</h1>
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

      {/* 2. Mostramos mensaje de error si la API falla */}
      {error && <p className="error" style={{ color: "#dc2626", fontWeight: "bold", margin: "10px 0" }}>{error}</p>}
      
      {/* 3. Condicional: Muestra texto de carga o el tablero */}
      {loading ? (
        <p style={{ fontSize: "1.2rem", color: "#6b7280", textAlign: "center", marginTop: "20px" }}>
          Cargando tareas...
        </p>
      ) : (
        <div className="board">
          {COLUMNS.map((c) => (
            <Column
              key={c.id}
              title={c.title}
              tasks={filteredTasks.filter((t) => t.status === c.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}