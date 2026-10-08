import { useState } from "react";
import { COLUMNS } from "../columns";
import { useBoard } from "../context/BoardContext";

export default function TaskCard({ task }) {
  // Traemos las funciones del Cerebro, incluyendo la de editar (RETO 4)
  const { moveTask, removeTask, updateTaskTitle } = useBoard();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  function handleSave() {
    if (editTitle.trim() !== "") {
      updateTaskTitle(task.id, editTitle.trim());
    } else {
      setEditTitle(task.title); 
    }
    setIsEditing(false);
  }

  return (
    <article className={`card prio-${task.priority}`}>
      <div onDoubleClick={() => setIsEditing(true)}>
        {isEditing ? (
          <input 
            autoFocus
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave} 
            onKeyDown={(e) => e.key === 'Enter' && handleSave()} 
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
          onChange={(e) => moveTask(task.id, e.target.value)}
        >
          {COLUMNS.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <button onClick={() => removeTask(task.id)}>Eliminar</button>
      </div>
    </article>
  );
}