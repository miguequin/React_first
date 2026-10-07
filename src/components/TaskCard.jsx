import { useState } from "react";

const COLUMNS = [
  { id: "todo", title: "Por hacer" },
  { id: "doing", title: "En progreso" },
  { id: "done", title: "Hecho" },
  { id: "review", title: "En revisión" },
];

export default function TaskCard({ task, onMove, onRemove, onUpdateTitle }) {
  // RETO 4: Estados para manejar la edición
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  function handleSave() {
    if (editTitle.trim() !== "") {
      onUpdateTitle(task.id, editTitle.trim());
    } else {
      setEditTitle(task.title); // Revierte si lo dejas en blanco
    }
    setIsEditing(false);
  }

  return (
    // Las comillas invertidas (``) aplican el color correctamente
    <article className={`card prio-${task.priority}`}>
      
      <div onDoubleClick={() => setIsEditing(true)}>
        {isEditing ? (
          <input 
            autoFocus
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave} // Guarda al hacer clic afuera
            onKeyDown={(e) => e.key === 'Enter' && handleSave()} // Guarda con Enter
            style={{ width: "100%", padding: "4px", boxSizing: "border-box" }}
          />
        ) : (
          <strong style={{ cursor: "pointer" }} title="Doble clic para editar">
            {task.title}
          </strong>
        )}
      </div>

      <small style={{ color: "#6b7280" }}>Prioridad: {task.priority}</small>
      
      <div className="card-actions">
        <select 
          value={task.status}
          onChange={(e) => onMove(task.id, e.target.value)}
        >
          {COLUMNS.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        
        <button onClick={() => onRemove(task.id)}>Eliminar</button>
      </div>
    </article>
  );
}