import { createContext, useContext, useEffect, useReducer } from "react";

const BoardContext = createContext(null);
const KEY = "kanban-tasks";

const initialTasks = [
  { id: 1, title: "Diseñar la base de datos", status: "done", priority: "alta" },
  { id: 2, title: "Crear el login", status: "doing", priority: "media" },
];

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, action.task];
    case "move":
      return state.map((t) => (t.id === action.id ? { ...t, status: action.status } : t));
    case "remove":
      return state.filter((t) => t.id !== action.id);
    case "reset":
      return initialTasks;
    case "updateTitle": // RETO 4: Editar tarea
      return state.map(t => t.id === action.id ? { ...t, title: action.newTitle } : t);
    case "vaciarHechos": // RETO 3: Eliminar terminadas
      return state.filter((t) => t.status !== "done");
    default:
      return state;
  }
}

function init() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : initialTasks;
  } catch {
    return initialTasks;
  }
}

export function BoardProvider({ children }) {
  const [tasks, dispatch] = useReducer(reducer, null, init);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Funciones que ahora viven en el contexto
  function addTask(title, priority) {
    // RETO 2: Validación de duplicados
    const existe = tasks.some(t => t.title.toLowerCase() === title.toLowerCase());
    if (existe) return "Ya existe una tarea con ese nombre."; 

    const task = { id: Date.now(), title, status: "todo", priority };
    dispatch({ type: "add", task });
    return null; 
  }

  function moveTask(id, status) { dispatch({ type: "move", id, status }); }
  function removeTask(id) { dispatch({ type: "remove", id }); }
  function resetBoard() { dispatch({ type: "reset" }); }
  function updateTaskTitle(id, newTitle) { dispatch({ type: "updateTitle", id, newTitle }); }
  function vaciarHechos() { dispatch({ type: "vaciarHechos" }); }

  return (
    <BoardContext.Provider value={{ tasks, addTask, moveTask, removeTask, resetBoard, updateTaskTitle, vaciarHechos }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard debe usarse dentro de BoardProvider");
  return ctx;
}