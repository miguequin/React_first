import TaskCard from "./TaskCard";

export default function Column({ title, tasks }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      {tasks.length === 0 && <p style={{color: "#6b7280", fontSize: "14px"}}>Sin tareas</p>}
      
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}