import React from 'react'
import Navbar from '../Home/Navbar'
import Footer from '../Home/Footer'

function AboutUs() {
  return (
    <div>
        <Navbar/>
        <section className="py-5 overflow-hidden " id="home">
   
<div className="container mt-8" id="dish_list">
    <div className="row h-100">
        <div className="col-lg-7 mx-auto text-center mb-6">
            <h5 className="fw-bold fs-3 fs-lg-5 lh-sm mb-3">About Us</h5>
        </div>
    </div>
            <h4>FROZENWALA</h4>
           <h4> WHOLESALERS & DISTRIBUTORS</h4>
            <h4>DELIVERY FROM</h4>
            <h4>(CHURCHGATE TO MIRA ROAD)</h4>
            <h4>*NOT FOR OUTSTATION COSTUMER V ONLY DELIVER IN MUMBAI*</h4>
  
       

        </div>
  
</section>
        <Footer/>
    </div>
  )
}

export default AboutUs