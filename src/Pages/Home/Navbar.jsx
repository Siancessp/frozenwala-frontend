// Import statements and other code above...
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Api from '../Utills/Api';
import { MyContext } from '../Utills/MyContext';
import { FaShoppingCart, FaUser, FaSearch, FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";


function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartGlobalItems } = useContext(MyContext);
  const [name, setName] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const getProfile = async () => {
      const uid = localStorage.getItem("user_id");

      try {
        const response = await Api.get(`api/profile/?user_id=${uid}`);
        setName(response.data.name);
      } catch (error) {
        // Handle error
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

  const navigateMenu = (page) => {
    navigate(`/menu?foodtype=${page}`);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let query = document.getElementsByClassName('search-item')[0].value.trim();
      if (query) {
        searchItem(query);
      }
    }
  }

  const searchItem = (query) => {
    navigate(`/search?search_query=${query}`);
  }

  return (
    <>
      {!isMobile ? <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top d-lg-block d-none">
        <div className="container">
          <a className="navbar-brand d-inline-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => navigate("/")}>
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
                {menuOpen && (
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a className="dropdown-item" href="#" onClick={() => navigateMenu('category1')}>
                      Category 1
                    </a>
                    <a className="dropdown-item" href="#" onClick={() => navigateMenu('category2')}>
                      Category 2
                    </a>
                    <a className="dropdown-item" href="#" onClick={() => navigateMenu('category3')}>
                      Category 3
                    </a>
                    {/* Add more categories as needed */}
                  </div>
                )}
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
              {searchOpen && (
                <input
                  type="text"
                  className="form-control me-2 search-item"
                  onKeyDown={handleSearchInput}
                  placeholder="Search..."
                  autoFocus
                />
              )}
              <button className="btn btn-white new-blue me-2" type="button" onClick={toggleSearch}>
                <FaSearch fontSize="24px" />
              </button>
              <button className="btn btn-white new-blue icon-whatsapp me-2" type="button" onClick={() => window.location.href = "https://wa.me/YOUR_WHATSAPP_NUMBER"}>
                <FaWhatsapp fontSize="24px" />
              </button>
              <button className="btn btn-white new-blue position-relative me-2" type="button" onClick={handleClickCart}>
                <FaShoppingCart fontSize="24px" />
                {cartGlobalItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartGlobalItems.length}
                  </span>
                )}
              </button>
              <button className="btn btn-white new-blue me-2" type="button" onClick={handleClick}>
                <FaUser className="me-2" />
                <span style={{ color: isLoggedIn ? 'rgb(40, 56, 84)' : '' }}>{isLoggedIn ? `Hi, ${name}` : 'Login'}</span>
              </button>
            </form>
          </div>
        </div>
      </nav>
        :
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top d-lg-none d-block">
          <div className="container">
            <a className="navbar-brand d-inline-flex align-items-center d-none" onClick={() => navigate("/home")}>
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
                <li className="nav-item dropdown" onClick={toggleMenu}>
                  <a className="nav-link dropdown-toggle">
                    Menu
                  </a>
                  {menuOpen && (
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <a className="dropdown-item" href="#" onClick={() => navigateMenu('category1')}>
                        Category 1
                      </a>
                      <a className="dropdown-item" href="#" onClick={() => navigateMenu('category2')}>
                        Category 2
                      </a>
                      <a className="dropdown-item" href="#" onClick={() => navigateMenu('category3')}>
                        Category 3
                      </a>
                      {/* Add more categories as needed */}
                    </div>
                  )}
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

            </div>
            <form className="d-flex ms-auto align-items-center">
              {searchOpen && (
                <input
                  type="text"
                  className="form-control me-2 search-item"
                  onKeyDown={handleSearchInput}
                  placeholder="Search..."
                  autoFocus
                />
              )}
              <button className="btn btn-white new-blue me-2" type="button" onClick={toggleSearch}>
                <FaSearch fontSize="24px" />
              </button>
              <button className="btn btn-white new-blue icon-whatsapp me-2" type="button" onClick={() => window.location.href = "https://wa.me/YOUR_WHATSAPP_NUMBER"}>
                <FaWhatsapp fontSize="24px" />
              </button>
              <button className="btn btn-white new-blue position-relative me-2" type="button" onClick={handleClickCart}>
                <FaShoppingCart fontSize="24px" />
                {cartGlobalItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartGlobalItems.length}
                  </span>
                )}
              </button>
              <button className="btn btn-white new-blue me-2" type="button" onClick={handleClick}>
                <FaUser className="me-2" />
                <span style={{ color: isLoggedIn ? 'rgb(40, 56, 84)' : '' }}>{isLoggedIn ? `Hi, ${name}` : 'Login'}</span>
              </button>
            </form>
          </div>
        </nav>
      }
    </>
  );
}

export default Navbar;
