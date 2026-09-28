import React from "react";
import { useEffect,useState } from "react";
import api from "../api/client";

export default function Notifications(){
  const [items,setItems]=useState([]);
  const load=async()=>setItems((await api.get("/notifications")).data); useEffect(()=>{load()},[]);
  const read=async id=>{await api.patch(`/notifications/${id}/read`);load()};
  const all=async()=>{await api.patch("/notifications/read-all");load()};
  return <><header className="row"><div><h1>Notifications</h1><p>Task and team activity.</p></div><button onClick={all}>Mark all read</button></header><div className="notes">{items.map(n=><div className={`card note ${!n.read?"unread":""}`} key={n._id}><div><b>{n.message}</b><small>{new Date(n.createdAt).toLocaleString()}</small></div>{!n.read&&<button onClick={()=>read(n._id)}>Read</button>}</div>)}</div></>;
}
