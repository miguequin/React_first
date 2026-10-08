import { useState } from "react";
import { useBoard } from "../context/BoardContext";

export default function TaskForm() {
  const { addTask } = useBoard(); // Se conecta directo al contexto
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [error, setError] = useState(""); 

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() === "") {
      setError("El título no puede estar vacío");
      return;
    }

    const errorMsg = addTask(title.trim(), priority);
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setTitle("");
      setError(""); 
    }
  }

  return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea..."
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="alta">alta</option>
          <option value="media">media</option>
          <option value="baja">baja</option>
        </select>
        <button>Agregar</button>
      </form>
      {error && <p style={{ color: "#dc2626", marginTop: "-10px", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}
    </div>
  );
}