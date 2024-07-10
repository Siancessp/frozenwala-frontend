import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Offers from "./Home/Offers";
import How from "./Home/How";
import Popular from "./Home/Popular";
import Menu from "./Home/Menu";
import Navbar from "./Home/Navbar";
import Product from "./Home/Product";
import ParentComponent from "./Home/Parent";
import SearchByFood from "./Home/SearchByFood";
import Adv from "./Home/Adv";
import Footer from "./Home/Footer";
import Special from "./Home/Special";


function Home() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Delivery");
  const [refrest, setRefresh] = useState(true)

  const refRestCart = () =>setRefresh(!refrest)

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

 

  const uid = localStorage.getItem("user_id");
  const access = localStorage.getItem("access_token");
  return (
    <div>
      <main className="main" id="top">
        <Navbar refreshCart={refrest} />
        
        <section className="py-5 overflow-hidden bg-primary" id="home">
          <div className="container">
            <div className="row flex-center">
              <div className="col-md-5 col-lg-6 order-0 order-md-1 mt-8 mt-md-0">
                <a className="img-landing-banner" href="#!">
                  <img
                    className="img-fluid"
                    src="/img/gallery/foo.jpeg"
                    alt="hero-header"
                  />
                </a>
              </div>
              <div className="col-md-7 col-lg-6 py-8 text-md-start text-center">
                <h1 className="display-1 fs-md-5 fs-lg-6 fs-xl-8 text-light">
                  Are you starving?
                </h1>
                <h1 className="text-800 mb-5 fs-4">
                  Within a few clicks, find meals that
                  <br className="d-none d-xxl-block" />
                  are accessible near you
                </h1>
              </div>
            </div>
          </div>
        </section>

        <Offers />

       

      <ParentComponent refRestCart={refRestCart} page='Home' />
      <How />
       {/* <SearchByFood/> */}
        <Adv/>

       <Special/>
       
        <section className="py-0">
          <div
            className="bg-holder"
            style={{
              backgroundImage: "url(/img/gallery/cta-two-bg.png)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>

          <div className="container">
            <div className="row flex-center">
              <div className="col-xxl-9 py-7 text-center">
                <h1 className="fw-bold mb-4 text-white fs-6">
                  Are you ready to order <br />
                  with the best deals?{" "}
                </h1>
                <a className="btn btn-danger" href="/products" >
                  {" "}
                  PROCEED TO ORDER<i className="fas fa-chevron-right ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

       <Footer/>
      </main>
    </div>
  );
}
export default Home;
