import React from "react";
import { useEffect, useState } from "react";

export default function TaskForm({ teams, onCreate }) {
  const [f, setF] = useState({
    title: "",
    description: "",
    team: "",
    priority: "medium",
    dueDate: ""
  });

  useEffect(() => {
    if (teams.length > 0 && !f.team) {
      setF(prev => ({
        ...prev,
        team: teams[0]._id
      }));
    }
  }, [teams, f.team]);

  const set = e => {
    setF({
      ...f,
      [e.target.name]: e.target.value
    });
  };

  const submit = async e => {
    e.preventDefault();

    if (!f.team) {
      alert("Please create or select a team first.");
      return;
    }

    try {
      await onCreate(f);
      setF(prev => ({
        ...prev,
        title: "",
        description: "",
        dueDate: ""
      }));
    } catch (error) {
      console.error("Task creation failed:", error);
      alert(error.response?.data?.message || "Failed to create task.");
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h3>Create Task</h3>

      <input
        name="title"
        placeholder="Task title"
        value={f.title}
        onChange={set}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={f.description}
        onChange={set}
      />

      <select name="team" value={f.team} onChange={set} required>
        <option value="">Select team</option>
        {teams.map(t => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>

      <select name="priority" value={f.priority} onChange={set}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        name="dueDate"
        type="date"
        value={f.dueDate}
        onChange={set}
      />

      <button type="submit">Create Task</button>
    </form>
  );
}
