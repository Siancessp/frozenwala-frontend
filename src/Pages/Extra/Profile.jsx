import React, { useState } from "react";
import Sidebar from "../Profile/Sidebar";
import MainContent from "../Profile/MainContent";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";

const App = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  return (
    <>
     <Navbar />   
    <div>
     
      <div>
        <main className="main" id="top" style={{ paddingTop: "120px" }}>
          <div className="profile-wrap">
            <Sidebar
              activeButton={activeButton}
              onButtonClick={handleButtonClick}
            />
            <MainContent activeButton={activeButton} />
          </div>
          <Footer />
        </main>
      </div>
     
    </div>
    </>
  );
};

export default App;
