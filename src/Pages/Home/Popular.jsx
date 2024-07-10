import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import Api, { BASE_URL } from "../Utills/Api";
import axios from "axios";
import { MyContext } from "../Utills/MyContext";

function Popular({ refreshCart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProds, setPopularProds] = useState([]);
  const [stock, setStock] = useState({});
  const isMobile = window.innerWidth <= 768;
  const itemsPerPage = isMobile ? 1 : 3;
  const uid = localStorage.getItem("user_id");
  const access_token = localStorage.getItem('access_token');
  const { cartGlobalItems, setCartGlobalItems} = useContext(MyContext);
  const [cartError, setCartError] = useState(null);


  const getMostPopular = async () => {
    try {
      const response = uid
        ? await Api.get("api/most-popular/")
        : await axios.get(`${BASE_URL}api/auth/most-popular/`);
      setPopularProds(response.data);
    } catch (error) {
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
    }
  };

  const getCartItems = async () => {
    try {
      const response = await Api.get(`api/get_cart/?user_id=${uid}`);
      const cartItemsMap = response.data.reduce((acc, item) => {
        acc[item.product_id] = item.quantity;
        return acc;
      }, {});
      setCartGlobalItems(cartItemsMap);
    } catch (error) {
    }
  };

  useEffect(()=>{
    getMostPopular();
    getStock();
    if (access_token){
      getCartItems();
    }
    else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartGlobalItems(cart);
    }
  }, []);

  const handleScroll = useCallback(
    (direction) => {
      setCurrentSlide((prevSlide) =>
        direction === "prev"
          ? prevSlide === 0
            ? Math.ceil(popularProds.length / itemsPerPage) - 1
            : prevSlide - 1
          : prevSlide === Math.ceil(popularProds.length / itemsPerPage) - 1
          ? 0
          : prevSlide + 1
      );
    },
    [popularProds.length]
  );

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < popularProds.length; i += itemsPerPage) {
      items.push(popularProds.slice(i, i + itemsPerPage));
    }
    return items;
  }, [popularProds, itemsPerPage]);

  const updateCartItems = async (productId, action) => {
    setCartError(null);
    if (access_token) {
      try {
        const endpoint = action === "add" ? "increase" : "decrease";
        let response = await Api.post(`api/${endpoint}/main/`, {
          product_id: productId,
          user_id: uid,
        });
        if (!response?.data?.error){
          setCartGlobalItems(response?.data);
        }
        else if (response?.data?.error?.includes('less than 1')){
          setCartGlobalItems(response?.data?.data);
        }
        else{
          setCartError(productId);
          setTimeout(()=>{
            setCartError(null);
          }, 200);
        }
      } catch (error) {
        // error handling;
      }
    } else {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let productIndex = cart.findIndex(prod => prod?.id === productId);
      let product;
      if (action === "add") {
        if (productIndex !== -1) {
          cart[productIndex].quantity += 1;
        } else {
          product = popularProds.find(prod => prod?.id === productId);
          if (product) {
            product = { ...product, product_id: product.id, quantity: 1 };
            cart.push(product);
          }
        }
      } else {
        if (cart?.length === 0 || !cart) {
          return;
        }
        else {
          if (productIndex !== -1) {
            if (cart[productIndex].quantity > 1) {
              cart[productIndex].quantity -= 1;
            }
            else {
              cart.splice(productIndex, 1);
            }
          }
        }
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartGlobalItems(cart);
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
                          <div className="corsosel-new" key={item?.id} style={{ marginRight: 50, maxWidth: "20%", marginLeft: 50 }}>
                            <div className="card card-span h-100 rounded-3">
                              <img
                                src={item.item_photo ? `https://app.frozenwala.com/${item.item_photo}` : './../../../img/food.png'}
                                alt={item.title}
                                style={{
                                  aspectRatio: 1,
                                  width: "100%",
                                  borderRadius: 20,
                                }}
                              />
                              <div className="card-body  card-main" style={{textAlign: 'center'}}>
                                <h5 className="fw-bold text-1000 text-truncate mb-1">
                                  {item.title}
                                </h5>
                                <span className="text-1000 fw-bold">
                                  ₹{item.item_new_price}
                                </span>
                              </div>
                            </div>
                            {cartError === item.id ? <p className="text-center" style={{color: 'red', margin: 0}}>Out of stock</p> : null}
                            <div className="d-grid gap-2">
                              {stock[item?.id] === 0 ? (
                                <button
                                  className="badge bg-soft-success"
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
                                  {cartGlobalItems.length > 0 && cartGlobalItems?.filter(prod=>prod?.product_id===item?.id)[0] ? (
                                    <div
                                      className="badge bg-soft-success"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                        padding: '12px'
                                      }}
                                    >
                                      <button
                                        onClick={() =>
                                          updateCartItems(item?.id, "minus")
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
                                        {cartGlobalItems.length > 0 && cartGlobalItems?.filter(prod=>prod?.product_id===item?.id)[0]?.quantity}
                                      </span>
                                      <button
                                        onClick={() =>
                                          updateCartItems(item?.id, "add")
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
                                        updateCartItems(item.id, 'add')
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
