import React, { useState } from "react";
import Navbar from "./Home/Navbar";
import ParentComponent from "./Home/Parent";
import Footer from "./Home/Footer";


function Home1() {
  const [refrest, setRefresh] = useState(true)
  const refRestCart = () =>setRefresh(!refrest)

  return (
    <div>
      <main className="main" id="top">
        <Navbar />
        <ParentComponent refRestCart={refRestCart} page='Home1' />
       <Footer/>
      </main>
    </div>
  );
}
export default Home1;
