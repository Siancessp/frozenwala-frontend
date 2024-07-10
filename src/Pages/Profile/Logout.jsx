import { useNavigate } from "react-router-dom";
import React from 'react'

function Logout() {
  const navigate = useNavigate();

  const handelLogOut = () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("access_token");
        localStorage.removeItem("rzp_checkout_anon_id");
        localStorage.removeItem("chakra-ui-color-mode");
        localStorage.removeItem("rzp_device_id");
        localStorage.removeItem("cart");
        window.location.href = '/login';
      };
  return (
    <div style={{display:"grid", justifyContent:"center", alignItems:"center",marginTop:200}}>
    <h3>Do you want to log out?</h3>
        <button
          type="submit"
          onClick={handelLogOut}
          style={{
            backgroundColor: "#F17228",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s ease",
          }}
        >
          Log Out
        </button>
    </div>
  )
}

export default Logout