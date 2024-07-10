import React, { useState, useEffect } from "react";
import Api from "../Utills/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyProfile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState(null);



  useEffect(() => {
    const getProfile = async () => {
      const uid = localStorage.getItem("user_id");

      try {
        const response = await Api.get(`api/profile/?user_id=${uid}`);
        setPhoto(response.data.profile_photo);
        setEmail(response.data.email);
        setName(response.data.name);
        setPhone(response.data.phone_number);
        setLocation(response.data.bio);
      } catch (error) {
        // error handling;
      }
    }
    getProfile();
  }, []);

  const handleSubmit = async (e) => {
    const uid = localStorage.getItem("user_id");

    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("user_id", uid);
      formData.append("email", email);
      formData.append("phone_number", phone);
      formData.append("bio", location);
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }
      const response = await Api.postFormdata(`api/profile/`, formData);
      toast.success("Profile Updated successfully");
    } catch (error) {
      toast.error("Issue while updateing profile");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  return (

    <div style={{ display: "flex", justifyContent: "center", marginBottom: 50, }}>
      <ToastContainer />
      <div
        className="py-5 overflow-hidden "
        style={{
          maxWidth: "800px",
          padding: "20px",
          backgroundColor: "#FFF",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          alignSelf: "center",
          border: "1px solid #bda7a7",
        }}
      >

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", color: "#F17228" }}>
              Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", color: "#F17228" }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", color: "#F17228" }}>
              Phone:
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", color: "#F17228" }}>
              Location:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", color: "#F17228" }}>
              Profile Picture:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#F17228",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.3s ease",
                textAlign: "center"
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
