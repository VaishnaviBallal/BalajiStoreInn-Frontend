import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage(){

 const navigate = useNavigate();

 const [username,setUsername] = useState("");
 const [password,setPassword] = useState("");

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

  <div className="login-container">

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

   {/* Toast Container */}
   <ToastContainer
     position="top-right"
     autoClose={2000}
   />

  </div>

 )

}

export default LoginPage;