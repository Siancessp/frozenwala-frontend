import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Utills/Api";
import { toast, ToastContainer } from "react-toastify";


function Signup() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!name.trim() || !phone.trim()) {
        toast.error('Name and phone number are required.', {autoClose: 1500});
      } else if (phone.trim().length !== 10 || !/^\d+$/.test(phone.trim())) {
        toast.error('Phone number must be of 10 digits.', {autoClose: 1500});
      } else {
        const body = {
          phone_number: phone,
        };
        await Api.post("api/send_sms/", body);
        navigate(`/signupotp?name=${name}&phone=${phone}`);
        setPhone("");
      }
    } catch (error) {
      if (error?.response?.data?.error?.includes('Phone')){
        toast.error(error?.response?.data?.error, {autoClose: 1500});
      }
      else{
        toast.error('Something went wrong, please try again.', {autoClose: 1500});
      }
    }
  };

  const handleClick = () => {
    navigate("/login");
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
        backgroundColor: "rgb(40 56 84)",
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
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Signup</h3>
        <h6>Enter Your Name</h6>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control input-box form-foodwagon-control"
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ced4da",
            width: "100%",
          }}
        />
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
            backgroundColor: "rgb(40 56 84)",
            color: "white",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Submit
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
          <span>Already have an account?</span>
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
            Login
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

export default Signup;
