import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Utills/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../Spinner"; 

function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!phone.trim()) {
        toast.error("Enter Phone Number");
      } else if (phone.trim().length !== 10 || !/^\d+$/.test(phone.trim())) {
        toast.error("Phone number must be of 10 digits");
      } else {
        setLoading(true);
        const body = {
          phone_number: phone,
        };

        const response = await Api.post("api/login-send_sms/", body);
        setLoading(false);
        console.log("OTP sent successfully");
        navigate("/loginotp", { state: { phone: phone } });
        setPhone("");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Phone Number does not exist");
      console.log(error);
    }
  };

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#FFB30E",
        padding: "10px",
      }}
    >
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
        data-navbar-on-scroll="data-navbar-on-scroll"
      >
        <div className="container">
          <a
            className="navbar-brand d-inline-flex"
            onClick={() => navigate("/home")}
          >
            <img
              className="d-inline-block"
              style={{ height: "50px" }}
              src="/img/gallery/Frozenwala.png"
              alt="logo"
            />
            <span className="text-1000 fs-3 fw-bold ms-2 text-gradient">
              Frozenwala
            </span>
          </a>
          {/* <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"> </span>
          </button> */}
        </div>
      </nav>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "500px",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
          backgroundColor: "#F9FAFD",
          margin: "20px",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h3>
        <h6>Enter the Phone Number</h6>
        <input
          type="text"
          placeholder="Enter the Phone Number"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="form-control input-box form-foodwagon-control"
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ced4da",
            width: "100%",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#F17228",
            color: "white",
            cursor: "pointer",
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? <Spinner /> : "Submit"}
        </button>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            marginTop: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>Don't have an account?</span>
          <button
            className="btn text-warning"
            type="button"
            onClick={handleClick}
            style={{
              backgroundColor: "transparent",
              border: "none",
              marginLeft: "5px",
              padding: "0",
              textDecoration: "underline",
            }}
          >
            Signup
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
