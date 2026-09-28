import React from "react";
import { useCallback,useEffect,useMemo,useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS,ArcElement,Tooltip,Legend } from "chart.js";
import api from "../api/client";
import { useSocket } from "../hooks/useSocket";
ChartJS.register(ArcElement,Tooltip,Legend);

export default function Dashboard(){
  const [tasks,setTasks]=useState([]),[teams,setTeams]=useState([]);
  const load=useCallback(async()=>{const [a,b]=await Promise.all([api.get("/tasks"),api.get("/teams")]);setTasks(a.data);setTeams(b.data)},[]);
  useEffect(()=>{load()},[load]); useSocket(load);
  const s=useMemo(()=>({todo:tasks.filter(t=>t.status==="todo").length,progress:tasks.filter(t=>t.status==="in-progress").length,done:tasks.filter(t=>t.status==="done").length}),[tasks]);
  return <><header><h1>Dashboard</h1><p>Project and team overview</p></header>
    <div className="stats"><div className="card"><b>Total</b><strong>{tasks.length}</strong></div><div className="card"><b>To Do</b><strong>{s.todo}</strong></div><div className="card"><b>In Progress</b><strong>{s.progress}</strong></div><div className="card"><b>Completed</b><strong>{s.done}</strong></div></div>
    <div className="twocol"><div className="card"><h2>Task Progress</h2><div className="chart"><Doughnut data={{labels:["To Do","In Progress","Done"],datasets:[{data:[s.todo,s.progress,s.done]}]}}/></div></div>
    <div className="card"><h2>Teams</h2>{teams.map(t=><div className="teamrow" key={t._id}><b>{t.name}</b><span>{t.members.length} members</span></div>)}{!teams.length&&<p>No teams yet.</p>}</div></div></>;
}
