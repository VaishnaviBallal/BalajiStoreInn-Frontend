import { useNavigate } from "react-router-dom";

import { useState,useEffect } from "react";
import "../styles/Login.css";

import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg from "../assets/login-bg.jpg";

function LoginPage(){

 const navigate = useNavigate();

 const [username,setUsername] = useState("");
 const [password,setPassword] = useState("");

useEffect(() => {

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };

}, [username, password]);
 
 const login = () =>{

  if(username === "" || password === ""){
   toast.warning("Please enter username and password");
   return;
  }

  // Temporary login
  if(username === "admin" && password === "admin123"){

   localStorage.setItem("loggedIn","true");

   toast.success("Login Successful");

   setTimeout(()=>{
     navigate("/home");
   },1500)

  }else{

   toast.error("Invalid login");

  }

 }

 return(

  <div className="login-container"
style={{ backgroundImage: `url(${bg})` }}>
   <div className="login-box">

    <h2>Balaji Inn Store</h2>

    <input
     type="text"
     placeholder="Username"
     value={username}
     onChange={(e)=>setUsername(e.target.value)}
    />

    <input
     type="password"
     placeholder="Password"
     value={password}
     onChange={(e)=>setPassword(e.target.value)}
    />

    <button className="login-btn" onClick={login}>
     Login
    </button>

   </div>

 

  </div>

 )

}

export default LoginPage;