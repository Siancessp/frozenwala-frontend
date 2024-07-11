import React, { useEffect, useState } from "react";
import Api, { BASE_URL } from "../Utills/Api";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';


function Menu({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const uid = localStorage.getItem("user_id");
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3;
  const startIndex = currentSlide * itemsPerSlide;
  const visibleCategories = categories.slice(startIndex, startIndex + itemsPerSlide);


  useEffect(() => {
    getMenu();
  }, []);
  
  const getMenu = async () => {
    try {
      if (uid) {
        const response = await Api.get(`api/categories/`);
        setCategories(response.data);
      } else {
        const response = await axios.get(`${BASE_URL}api/auth/categories/`);
        setCategories(response.data);
      }
    } catch (error) {
      // error handling
    }
  };
  

  const handleClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      try {
        const response = await axios.get(`${BASE_URL}api/auth/product-all/`);
        onSelectCategory("all", response.data);
      } catch (error) {
        setError("Error fetching items. Please try again later.");
      }
    } else {
      onSelectCategory(categoryId);
    }
  };

  const handleMouseEnter = (categoryId) => {
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => Math.min(prevSlide + 1, Math.ceil(categories.length / itemsPerSlide) - 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => Math.max(prevSlide - 1, 0));
  };

  return (
    <section className="menu-section">
      <div className="container">
        <div className="text-center mt-7 mb-5">
          <h5 className="fw-bold fs-3 fs-lg-5 lh-sm">Products</h5>
        </div>
        {error && <p>{error}</p>}
        <div className="category-slider">
          <button onClick={handlePrevSlide} disabled={currentSlide === 0} className="arrow-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="category-buttons">
            <button
              key="all"
              className="category-button"
              style={{
                backgroundColor:
                  selectedCategory === "all"
                    ? "#f1722826"
                    : hoveredCategory === "all"
                    ? "#e6e6e6"
                    : "white",
                color:
                  selectedCategory === "all" || hoveredCategory === "all"
                    ? "#F17228"
                    : "gray",
              }}
              onClick={() => handleClick("all")}
              onMouseEnter={() => handleMouseEnter("all")}
              onMouseLeave={handleMouseLeave}
            >
              <span className="category-name">All</span>
            </button>
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                className="category-button"
                style={{
                  backgroundColor:
                    selectedCategory === category.id
                      ? "#f1722826"
                      : hoveredCategory === category.id
                      ? "#e6e6e6"
                      : "white",
                  color:
                    selectedCategory === category.id
                      ? "#F17228"
                      : hoveredCategory === category.id
                      ? "black"
                      : "gray",
                }}
                onClick={() => handleClick(category.id)}
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
          <button onClick={handleNextSlide} disabled={startIndex + itemsPerSlide >= categories.length} className="arrow-button">
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Menu;
