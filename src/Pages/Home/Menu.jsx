import React, { useEffect, useState } from "react";
import Api from "../Utills/Api";
import axios from "axios";

function Menu({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  useEffect(() => {
    getMenu();
  }, []);
  const uid = localStorage.getItem("user_id");


  const getMenu = async () => {
    try {
      if (uid) {
        const response = await Api.get(`api/categories/`);
        setCategories(response.data);
      } else {
        const response = await axios.get(`https://app.frozenwala.com/base/api/auth/categories/`);
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  

  const handleClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      try {
        const response = await Api.get(`api/product-all/`);
        onSelectCategory("all", response.data);
      } catch (error) {
        setError("Error fetching items. Please try again later.");
        console.error("Error fetching items:", error);
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

  return (
    <section className="py-0" style={{ flexDirection: "row", display: "flex" }}>
      <div className="container" style={{ maxWidth: "90px !important" }}>
        <div className="col-lg-7 mx-auto text-center mt-7 mb-5">
          <h5 className="fw-bold fs-3 fs-lg-5 lh-sm">Products</h5>
        </div>
        {error && <p>{error}</p>}
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
            borderWidth: 0,
            padding: 10,
            paddingInline: 20,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}
          onClick={() => handleClick("all")}
          onMouseEnter={() => handleMouseEnter("all")}
          onMouseLeave={handleMouseLeave}
        >
          <span className="category-name" style={{ fontWeight: "600" }}>
            All
          </span>
        </button>
        {categories.map((category) => (
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
              borderWidth: 0,
              padding: 10,
              paddingInline: 20,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}
            onClick={() => {
              handleClick(category.id);
              onSelectCategory(category.id); 
            }}
            onMouseEnter={() => handleMouseEnter(category.id)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="category-name" style={{ fontWeight: "600" }}>
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Menu;
