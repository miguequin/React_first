import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [error, setError] = useState(""); // RETO 1: Estado para el error

  function handleSubmit(e) {
    e.preventDefault();
    
    // RETO 1: Validación de campo vacío
    if (title.trim() === "") {
      setError("El título no puede estar vacío");
      return;
    }

    // RETO 2: Recibimos el mensaje de error si está duplicado
    const errorMsg = onAdd(title.trim(), priority);
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setTitle("");
      setError(""); // Limpiamos el error si se agregó bien
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
      
      {/* Muestra el mensaje en rojo si hay error */}
      {error && <p style={{ color: "#dc2626", marginTop: "-10px", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}
    </div>
  );
}