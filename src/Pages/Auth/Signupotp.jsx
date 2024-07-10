import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../Utills/Api";


function Signupotp() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');
  const phone = queryParams.get('phone');
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    if (name && phone) {
      toast.success('OTP has been sent successfully.', {autoClose: 1500});
    }
    else{
      navigate('/signup');
    }
  }, []);

  const setOTP = (e)=>{
    if (!/^\d*$/.test(e.target.value)){
      return;
    }
    setOtp(e.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (otp === "") {
        toast.error('Enter OTP!', {autoClose: 1500});
        
      } else {
        const body = {
          otp_value: otp,
          phone_number: phone,
          name: name,
        };
        const response = await axios.post(
          `${BASE_URL}register/`,
          body
        );
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("access_token", response.data.access);

        toast.success('Registeration completed successfully.', {autoClose: 1000});
        setTimeout(()=>{
          window.location.href = '/';
          setOtp("");
        }, 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error, {autoClose: 1500});
    }
  };

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <>
    <ToastContainer />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "rgb(40, 56, 84)",
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
            onClick={() => navigate("/")}
            style={{alignItems: 'center', cursor: 'pointer'}}
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
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"> </span>
          </button>
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
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          One Time Password (OTP)
        </h3>
        <h6>Enter the OTP</h6>
        <input
          placeholder="Enter the OTP"
          value={otp}
          onChange={setOTP}
          maxLength={6}
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
            backgroundColor: "rgb(40, 56, 84)",
            color: "white",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Submit
        </button>
      </form>
    </div>
    </>
  );
}

export default Signupotp;
