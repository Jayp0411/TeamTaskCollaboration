import React from "react";
import { useEffect,useState } from "react";
import api from "../api/client";

export default function Teams(){
  const [teams,setTeams]=useState([]),[f,setF]=useState({name:"",description:""}),[email,setEmail]=useState("");
  const load=async()=>setTeams((await api.get("/teams")).data); useEffect(()=>{load()},[]);
  const create=async (e)=>{e.preventDefault();await api.post("/teams",f);setF({name:"",description:""});load()};
  const add=async (id)=>{try{await api.post(`/teams/${id}/members`,{email});setEmail("");load()}catch(e){alert(e.response?.data?.message||"Could not add member")}};
  return <><header><h1>Teams</h1><p>Create teams and add collaborators.</p></header>
    <form className="card form" onSubmit={create}><h3>Create Team</h3><input placeholder="Team name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required/><textarea placeholder="Description" value={f.description} onChange={e=>setF({...f,description:e.target.value})}/><button>Create Team</button></form>
    <div className="twocol">{teams.map(t=><div className="card" key={t._id}><h2>{t.name}</h2><p>{t.description}</p><b>Members</b><ul>{t.members.map(m=><li key={m._id}>{m.name} — {m.email}</li>)}</ul><div className="addmember"><input placeholder="Existing user's email" value={email} onChange={e=>setEmail(e.target.value)}/><button onClick={()=>add(t._id)}>Add Member</button></div></div>)}</div></>;
}
