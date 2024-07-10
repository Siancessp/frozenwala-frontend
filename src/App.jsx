import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Home1 from "./Pages/Home1";
import Login from "./Pages/Auth/Login";
import "./assets/css/theme.css";
import Signup from "./Pages/Auth/Signup";
import LoginOTP from "./Pages/Auth/LoginOTP";
import Signupotp from "./Pages/Auth/Signupotp";
import Profile from "./Pages/Extra/Profile";
import CartDetails from "./Pages/Cart/CartDetails";
import Checkout from "./Pages/Cart/Checkout";
import OrderDetails from "./Pages/Extra/OrderDetails";
import Terms from "./Pages/Footer.js/Terms";
import Privacy from "./Pages/Footer.js/Privacy";
import Refund from "./Pages/Footer.js/Refund";
import AboutUs from "./Pages/Footer.js/AboutUs";

import FoodMenu from "./Pages/Home/FoodMenu";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const access_token = localStorage.getItem('access_token');
      setLoggedIn(!!access_token);
    };
    checkLoginStatus();
  }, []);

  const loggedInRoutes = (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Home1 />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cart" element={<CartDetails />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orderdetails/:orderId" element={<OrderDetails />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/menu" element={<Navigate to="/" />} />
      <Route path="/foodmenu" element={<Navigate to="/" />} />
    </>
  );

  const loggedOutRoutes = (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/loginotp" element={<LoginOTP />} />
      <Route path="/signupotp" element={<Signupotp />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/cart" element={<CartDetails />} />
      <Route path="/menu" element={<FoodMenu/>} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Home1 />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </>
  );

  return (
    <Router>
      <Routes>
        {loggedIn ? loggedInRoutes : loggedOutRoutes}
      </Routes>
    </Router>
  );
}

export default App;
