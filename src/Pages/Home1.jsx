import React, { useState } from "react";
import Navbar from "./Home/Navbar";
import ParentComponent from "./Home/Parent";
import Footer from "./Home/Footer";


function Home1() {
  return (
    <div>
      <main className="main" id="top">
        <Navbar />
        <ParentComponent page='Home1' />
       <Footer/>
      </main>
    </div>
  );
}
export default Home1;
