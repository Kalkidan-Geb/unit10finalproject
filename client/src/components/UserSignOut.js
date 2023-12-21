import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";


const UserSignOut = () =>{
  const { signOut } = useUser();

    useEffect(()=>{
        signOut();
    })
    
    return(<Navigate to="/" replace/>)
}

export default UserSignOut;
