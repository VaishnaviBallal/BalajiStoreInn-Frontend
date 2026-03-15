import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { showSuccess } from "../utils/Toast";

function HomePage(){

 const navigate = useNavigate();

 useEffect(()=>{

  const loggedIn = localStorage.getItem("loggedIn");

  if(!loggedIn){
   navigate("/");
  }

 },[navigate])

 const logout = () =>{

  localStorage.removeItem("loggedIn");

  showSuccess("Logged out successfully");

  navigate("/");

 }

 return(

  <div className="home">

   {/* Logout Button */}
   <button
     className="backBtn"
     onClick={logout}
   >
     Logout
   </button>

   <h1 className="title">
    Balaji Inn Store Management
   </h1>

   <div className="menu">

    <button onClick={()=>navigate("/dashboard")}>
     Dashboard
    </button>

    <button onClick={()=>navigate("/items-entry")}>
     Items Entry
    </button>

    <button onClick={()=>navigate("/daily-entry")}>
     Daily Entry
    </button>

    <button onClick={()=>navigate("/reports")}>
     Reports
    </button>

   </div>

  </div>

 )

}

export default HomePage;