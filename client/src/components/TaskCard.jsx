import React from "react";
export default function TaskCard({ task, onStatus, onDelete }) {
  return <article className="card task">
    <div className="row"><h3>{task.title}</h3><span className={`badge ${task.priority}`}>{task.priority}</span></div>
    <p>{task.description || "No description"}</p>
    <small>Team: {task.team?.name || "-"}</small>
    <small>Assignee: {task.assignee?.name || "Unassigned"}</small>
    <div className="row actions">
      <select value={task.status} onChange={e => onStatus(task._id,e.target.value)}>
        <option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option>
      </select>
      <button className="danger" onClick={() => onDelete(task._id)}>Delete</button>
    </div>
  </article>;
}
