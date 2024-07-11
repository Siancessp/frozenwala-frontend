import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Api from '../Utills/Api';
import { MyContext } from '../Utills/MyContext';
import { FaShoppingCart, FaUser, FaSearch, FaWhatsapp, FaBars, FaTimes, FaChevronDown, FaHome, FaInfoCircle, FaList } from "react-icons/fa";


function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { cartGlobalItems } = useContext(MyContext);
  const [menuOpen, setMenuOpen] = useState(false); // Add this line
  const [name, setName] = useState("");


  useEffect(() => {
    const getProfile = async () => {
      const uid = localStorage.getItem("user_id");

      try {
        const response = await Api.get(`api/profile/?user_id=${uid}`);
        setName(response.data.name);
      } catch (error) {
        // error handling
      }
    }
    getProfile();
  }, []);


  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    setIsLoggedIn(!!userId);
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleClickCart = () => {
    navigate("/cart");
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navigateMenu = (page)=>{
    window.location.href = `menu?foodtype=${page}`;
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top d-lg-block d-none">
        <div className="container">
          <a className="navbar-brand d-inline-flex align-items-center" style={{cursor: 'pointer'}} onClick={() => navigate("/")}>
            <img className="d-inline-block" style={{ height: "50px" }} src="/img/gallery/Frozenwala.png" alt="logo" />
            <span className="text-1000 fs-3 fw-bold ms-2 text-gradient">Frozenwala</span>
          </a>
          <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
            {navbarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className={`collapse navbar-collapse ${navbarOpen ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/")}>
                  Home
                </a>
              </li>
              <li className="nav-item dropdown" onMouseEnter={toggleMenu} onMouseLeave={closeMenu}>
                <a className="nav-link dropdown-toggle" onClick={toggleMenu}>
                  Menu 
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigateMenu('veg')}>
                  Veg
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigateMenu('nonveg')}>
                  Non-Veg
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate("/about")}>
                  About Us
                </a>
              </li>
            </ul>
            <form className="d-flex ms-auto align-items-center">
              <button className="btn btn-white new-blue me-2" type="button" >
                <FaSearch fontSize="24px" />
              </button>
              <button className="btn btn-white new-blue me-2" type="button" onClick={() => window.location.href = "https://wa.me/YOUR_WHATSAPP_NUMBER"}>
                <FaWhatsapp fontSize="24px" />
              </button>
              <button className="btn btn-white new-blue " type="button" onClick={handleClickCart}>
                <FaShoppingCart fontSize="24px" />
                <span className="ms-1">{cartGlobalItems.length}</span>
              </button>
              <button className="btn btn-white new-blue me-2" type="button" onClick={handleClick}>
                <FaUser className="me-2" />
                <span style={{ color: isLoggedIn ? 'rgb(40, 56, 84)' : '' }}>{isLoggedIn ? `Hi, ${name}` : 'Login'}</span>
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar;
