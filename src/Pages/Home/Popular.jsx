import React, { useEffect, useState, useCallback, useMemo } from "react";
import Api from "../Utills/Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Popular({ refreshCart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [getProduct, setGetProduct] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [stock, setStock] = useState({});
  const uid = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    setCartItems(cart);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([getMostPopular(), getCartItems(), getStock()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getMostPopular = async () => {
    try {
      const response = uid
        ? await Api.get("api/most-popular/")
        : await axios.get("https://app.frozenwala.com/base/api/auth/most-popular/");
        console.log("skdufye ysfuid nu9odsgurdi fhfu", response.data);
      setGetProduct(response.data);
    } catch (error) {
      console.error("Error fetching most popular products:", error);
    }
  };

  const handleScroll = useCallback(
    (direction) => {
      setCurrentSlide((prevSlide) =>
        direction === "prev"
          ? prevSlide === 0
            ? Math.ceil(getProduct.length / itemsPerPage) - 1
            : prevSlide - 1
          : prevSlide === Math.ceil(getProduct.length / itemsPerPage) - 1
          ? 0
          : prevSlide + 1
      );
    },
    [getProduct.length]
  );

  const isMobile = window.innerWidth <= 768; // Example condition for mobile view

  const itemsPerPage = isMobile ? 1 : 3;

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < getProduct.length; i += itemsPerPage) {
      items.push(getProduct.slice(i, i + itemsPerPage));
    }
    return items;
  }, [getProduct, itemsPerPage]);

  const getCartItems = async () => {
    try {
      const response = await Api.get(`api/get_cart/?user_id=${uid}`);
      const cartItemsMap = response.data.reduce((acc, item) => {
        acc[item.product_id] = item.quantity;
        return acc;
      }, {});
      setCartItems(cartItemsMap);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const getStock = async () => {
    try {
      const response = await Api.get(`api/stock/`);
      const stockMap = response.data.reduce((acc, item) => {
        acc[item.item_id] = item.openingstock;
        return acc;
      }, {});
      setStock(stockMap);
    } catch (error) {
      console.error("Error getting stock:", error);
    }
  };

  const onPressAddToCart = async (productId) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        const response = await Api.post(`api/add_to_cart/`, {
          product_id: productId,
          u_id: uid,
        });
        setCartItems((prevCartItems) => ({
          ...prevCartItems,
          [productId]: (prevCartItems[productId] || 0) + 1,
        }));
        refreshCart();
        console.log("Product added to cart:", response.data);
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      let cart = JSON.parse(localStorage.getItem("cart")) || {};
      cart[productId] = (cart[productId] || 0) + 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      refreshCart();
      console.log("Product added to cart in localStorage");
    }
  };
  
  const updateCartItem = async (productId, action) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        const endpoint = action === "add" ? "increase" : "decrease";
        const response = await Api.post(`api/${endpoint}/main/`, {
          product_id: productId,
          user_id: uid,
        });
  
        setCartItems((prevCartItems) => {
          const newQuantity =
            action === "add"
              ? (prevCartItems[productId] || 0) + 1
              : prevCartItems[productId] - 1;
          if (newQuantity <= 0) {
            const updatedCartItems = { ...prevCartItems };
            delete updatedCartItems[productId];
            return updatedCartItems;
          } else {
            return { ...prevCartItems, [productId]: newQuantity };
          }
        });
        refreshCart();
        console.log(`${action === "add" ? "Increased" : "Decreased"} quantity:`, response.data);
      } catch (error) {
        console.error(`Error ${action === "add" ? "increasing" : "decreasing"} quantity:`, error);
      }
    } else {
      // Save updated cart details to localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || {};
      if (action === "add") {
        cart[productId] = (cart[productId] || 0) + 1;
      } else {
        cart[productId] = (cart[productId] || 0) - 1;
        if (cart[productId] <= 0) {
          delete cart[productId];
        }
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      refreshCart();
      console.log(`${action === "add" ? "Increased" : "Decreased"} quantity in localStorage`);
    }
  };

  

  return (
    <div>
      <section className="py-4 overflow-hidden">
        <div className="container">
          <div className="row h-100">
            <div className="col-lg-7 mx-auto text-center mt-7 mb-5">
              <h5 className="fw-bold fs-3 fs-lg-5 lh-sm">Popular items</h5>
            </div>
            <div className="col-12">
              <div className="carousel slide" id="carouselPopularItems">
                <div className="carousel-inner">
                  {visibleItems.map((slideItems, slideIndex) => (
                    <div
                      key={slideIndex}
                      className={`carousel-item ${slideIndex === currentSlide ? "active" : ""}`}
                    >
                      <div className="row gx-3 h-100 align-items-center justify-content-center">
                        {slideItems.map((item) => (
                          <div key={item.id} style={{ marginRight: 50, maxWidth: "20%" }}>
                            <div className="card card-span h-100 rounded-3">
                              <img
                                src={`http://app.frozenwala.com/${item.item_photo}`}
                                alt={item.title}
                                style={{
                                  aspectRatio: 1,
                                  width: "100%",
                                  borderRadius: 20,
                                }}
                              />
                              <div className="card-body ps-0">
                                <h5 className="fw-bold text-1000 text-truncate mb-1">
                                  {item.title}
                                </h5>
                                <span className="text-1000 fw-bold">
                                  ₹{item.item_new_price}
                                </span>
                              </div>
                            </div>
                            <div className="d-grid gap-2">
                              {stock[item.id] === 0 ? (
                                <button
                                  className="badge bg-soft-success p-2"
                                  style={{
                                    borderWidth: 0,
                                    cursor: "not-allowed",
                                  }}
                                  type="button"
                                  disabled
                                >
                                  <span className="fw-bold fs-1 text-success">
                                    Sold Out
                                  </span>
                                </button>
                              ) : (
                                <>
                                  {cartItems[item.id] ? (
                                    <div
                                      className="badge bg-soft-success p-2"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                      }}
                                    >
                                      <button
                                        onClick={() =>
                                          updateCartItem(item.id, "subtract")
                                        }
                                        style={{
                                          borderWidth: 0,
                                          fontSize: 24,
                                        }}
                                      >
                                        -
                                      </button>
                                      <span
                                        style={{
                                          color: "black",
                                          fontSize: 18,
                                        }}
                                      >
                                        {cartItems[item.id]}
                                      </span>
                                      <button
                                        onClick={() =>
                                          updateCartItem(item.id, "add")
                                        }
                                        style={{
                                          borderWidth: 0,
                                          fontSize: 24,
                                        }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      style={{ borderWidth: 0 }}
                                      type="button"
                                      onClick={() =>
                                        onPressAddToCart(item.id)
                                      }
                                      className="btn btn-lg btn-danger"
                                    >
                                      Order now
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev carousel-icon"
                  type="button"
                  data-bs-target="#carouselPopularItems"
                  data-bs-slide="prev"
                  onClick={() => handleScroll("prev")}
                  style={{ left: 10 }}
                >
                  <span
                    className="carousel-control-prev-icon hover-top-shadow"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next carousel-icon"
                  type="button"
                  data-bs-target="#carouselPopularItems"
                  data-bs-slide="next"
                  onClick={() => handleScroll("next")}
                  style={{ right: 10 }}
                >
                  <span
                    className="carousel-control-next-icon hover-top-shadow"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Popular;
