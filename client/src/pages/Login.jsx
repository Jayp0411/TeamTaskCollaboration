import React from "react";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login(){
  const {login}=useAuth(); const nav=useNavigate(); const [f,setF]=useState({email:"",password:""}); const [err,setErr]=useState("");
  const submit=async e=>{e.preventDefault();try{await login(f.email,f.password);nav("/")}catch(x){setErr(x.response?.data?.message||"Login failed")}};
  return <div className="auth"><form className="authcard" onSubmit={submit}><h1>TeamFlow</h1><p>Team task management</p>{err&&<div className="error">{err}</div>}
    <input type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/>
    <input type="password" placeholder="Password" value={f.password} onChange={e=>setF({...f,password:e.target.value})} required/>
    <button>Login</button><span>New user? <Link to="/register">Register</Link></span></form></div>;
}
