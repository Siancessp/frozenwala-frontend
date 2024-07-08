import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Signupotp() {
  let location = useLocation();
  let { name, phone } = location.state;
  console.log(name, phone);

  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (otp === "") {
        alert("Enter OTP!");
      } else {
        const body = {
          otp_value: otp,
          phone_number: phone,
          name: name,
        };
        console.log(body);
        const response = await axios.post(
          "https://app.frozenwala.com/base/register/",
          body
        );
        console.log("Logged in");
        navigate("/login");
        setOtp("");
      }
    } catch (error) {
      console.log(error);
      alert(error);
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
          type="number"
          placeholder="Enter the OTP"
          inputMode="numeric"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
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
          <span>Didn't receive?</span>
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
            Resend
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signupotp;
