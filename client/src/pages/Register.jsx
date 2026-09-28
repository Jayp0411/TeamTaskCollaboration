import React from "react";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register(){
  const {register}=useAuth(); const nav=useNavigate(); const [f,setF]=useState({name:"",email:"",password:""}); const [err,setErr]=useState("");
  const submit=async e=>{e.preventDefault();try{await register(f.name,f.email,f.password);nav("/")}catch(x){setErr(x.response?.data?.message||"Registration failed")}};
  return <div className="auth"><form className="authcard" onSubmit={submit}><h1>Create account</h1>{err&&<div className="error">{err}</div>}
    <input placeholder="Full name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required/>
    <input type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/>
    <input type="password" placeholder="Password" value={f.password} onChange={e=>setF({...f,password:e.target.value})} minLength="6" required/>
    <button>Create account</button><span>Already registered? <Link to="/login">Login</Link></span></form></div>;
}
