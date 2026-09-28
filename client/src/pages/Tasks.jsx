import React from "react";
import { useCallback,useEffect,useState } from "react";
import api from "../api/client";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { useSocket } from "../hooks/useSocket";

export default function Tasks(){
  const [tasks,setTasks]=useState([]),[teams,setTeams]=useState([]),[f,setF]=useState({search:"",status:"",priority:""});
  const load=useCallback(async()=>{const params=Object.fromEntries(Object.entries(f).filter(([,v])=>v));const [a,b]=await Promise.all([api.get("/tasks",{params}),api.get("/teams")]);setTasks(a.data);setTeams(b.data)},[f]);
  useEffect(()=>{load()},[load]); useSocket(load);
  const create=async data=>{await api.post("/tasks",data);load()};
  const status=async(id,status)=>{await api.patch(`/tasks/${id}`,{status});load()};
  const remove=async id=>{if(confirm("Delete this task?")){await api.delete(`/tasks/${id}`);load()}};
  return <><header><h1>Tasks</h1><p>Create and track project work.</p></header><TaskForm teams={teams} onCreate={create}/>
    <div className="filters card"><input placeholder="Search" value={f.search} onChange={e=>setF({...f,search:e.target.value})}/><select value={f.status} onChange={e=>setF({...f,status:e.target.value})}><option value="">All status</option><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option></select><select value={f.priority} onChange={e=>setF({...f,priority:e.target.value})}><option value="">All priority</option><option>low</option><option>medium</option><option>high</option></select></div>
    <div className="tasks">{tasks.map(t=><TaskCard key={t._id} task={t} onStatus={status} onDelete={remove}/>)}</div></>;
}
