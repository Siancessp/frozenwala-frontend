import React, { useEffect, useState } from "react";
import Api from "../Utills/Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "./../Utills/ProductsContext";

function Product({ categoryId, refreshCart }) {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [stock, setStock] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const pagedata = 20;
  const uid = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    setCartItems(cart);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([getProducts(categoryId), getCartItems(), getStock()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (categoryId) {
      getProducts(categoryId);
    } else {
      getAllProducts();
    }
  }, [categoryId]);

  useEffect(() => {
    let pages = Math.ceil(allProducts.length / pagedata);
    setTotalPage((prev) => pages);
    setProducts(allProducts.slice(0, pagedata));
  }, [allProducts]);

  const getProducts = async (categoryId) => {
    try {
      if (uid) {
        if (categoryId === "all") {
          await getAllProducts();
        } else {
          const response = await Api.get(
            `api/auth/category/product-all/?category_id=${categoryId}`
          );
          setAllProducts(response.data);
        }
      } else {
        const response = await axios.get(
          `https://app.frozenwala.com/base/api/auth/category/product-all/?category_id=${categoryId}`
        );
        setAllProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getAllProducts = async () => {
    try {
      if (uid) {
        const response = await Api.get(`api/product-all/`);
        setAllProducts(response.data);
      } else {
        const response = await axios.get(
          `https://app.frozenwala.com/base/api/auth/product-all/`
        );
        setAllProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const getCartItems = async () => {
    try {
      const response = await Api.get(`api/get_cart/?user_id=${uid}`);
      const cartItemsMap = {};
      response.data.forEach((item) => {
        cartItemsMap[item.product_id] = item.quantity;
      });
      setCartItems(cartItemsMap);
    } catch (error) {
      console.log("Error fetching cart items:", error);
    }
  };

  const getStock = async () => {
    try {
      const response = await Api.get(`api/stock/`);
      const stockMap = {};
      response.data.forEach((item) => {
        stockMap[item.item_id] = item.openingstock;
      });
      setStock(stockMap);
    } catch (error) {
      console.log("Error getting stock:", error);
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
        refreshCart();
        console.log("Product added to cart:", response.data);
        setCartItems((prevCartItems) => ({
          ...prevCartItems,
          [productId]: (prevCartItems[productId] || 0) + 1,
        }));
      } catch (error) {
        console.log("Error adding product to cart:", error);
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

  const addOne = async (productId) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        if (stock[productId] > cartItems[productId]) {
          const response = await Api.post(`api/increase/main/`, {
            product_id: productId,
            user_id: uid,
          });
          setCartItems((prevCartItems) => ({
            ...prevCartItems,
            [productId]: (prevCartItems[productId] || 0) + 1,
          }));
          console.log("Quantity increased:", response.data);
        } else {
          console.log(
            "Only",
            stock["item_id"],
            "available. You cannot add more"
          );
        }
      } catch (error) {
        console.log("Error increasing quantity:", error);
      }
    } else {
      let cart = JSON.parse(localStorage.getItem("cart")) || {};
      if (stock[productId] > (cart[productId] || 0)) {
        cart[productId] = (cart[productId] || 0) + 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartItems(cart);
        console.log("Quantity increased in localStorage");
      } else {
        console.log("Only", stock["item_id"], "available. You cannot add more");
      }
    }
  };

  const subOne = async (productId) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        if (cartItems[productId] > 1) {
          const response = await Api.post(`api/decrease/main/`, {
            product_id: productId,
            user_id: uid,
          });
          setCartItems((prevCartItems) => ({
            ...prevCartItems,
            [productId]: prevCartItems[productId] - 1,
          }));
          console.log("Quantity decreased:", response.data);
        } else {
          const response = await Api.post(`api/decrease/main/`, {
            product_id: productId,
            user_id: uid,
          });
          setCartItems((prevCartItems) => {
            const updatedCartItems = { ...prevCartItems };
            delete updatedCartItems[productId];
            return updatedCartItems;
          });
          console.log("Quantity decreased:", response.data);
        }
        refreshCart();
      } catch (error) {
        console.log("Error decreasing quantity:", error);
      }
    } else {
      let cart = JSON.parse(localStorage.getItem("cart")) || {};
      if (cart[productId] > 1) {
        cart[productId] = cart[productId] - 1;
      } else {
        delete cart[productId];
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);

      console.log("Quantity decreased in localStorage");
    }
  };

  const pageChange = (page)=>{
    let current_page;
    if (page == 'prev'){
      current_page = currentPage - 1;
    }
    else {
      current_page = currentPage + 1;
    }
    setCurrentPage(prev=>current_page);
    let start = (current_page - 1) * pagedata;
    let end = ((current_page - 1) * pagedata) + pagedata;
    setProducts(allProducts.slice(start, end));
  }

  return (
    <div>
      <section id="testimonial">
        <div className="container">
          <div className="row gx-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="col-6 col-sm-6 col-md-6 col-lg-3 mb-5"
              >
                <div style={{ width: "90%" }}>
                  <div style={{ position: "relative", width: "100%" }}>
                    <img
                      style={{
                        aspectRatio: 1,
                        width: "100%",
                        borderRadius: 20,
                      }}
                      src={`https://app.frozenwala.com/${product.item_photo}`}
                      alt={product.title}
                    />
                    {product.stock === 0 && (
                      <img
                        src="https://png.pngtree.com/png-clipart/20190401/ourlarge/pngtree-sold-out-png-image_859393.jpg"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          borderRadius: 20,
                        }}
                        alt="Sold Out"
                      />
                    )}
                    <div
                      className="badge bg-danger p-2"
                      style={{ position: "absolute", top: 10, left: 10 }}
                    >
                      <i className="fas fa-tag me-2 fs-0"></i>
                      <span className="fs-0">{product.discount}% off</span>
                    </div>
                    {product.most_popular && (
                      <div
                        className="badge bg-soft-success p-2"
                        style={{ position: "absolute", bottom: 10, left: 10 }}
                      >
                        <span className="fw-bold fs-1 text-success">
                          Most Popular
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card-body ps-0">
                    <div className="d-flex align-items-center mb-3">
                      <div className="flex-1 ms-3">
                        <h5
                          className="mb-0 fw-bold text-1000"
                          style={{
                            lineHeight: "1.5em",
                            height: "3em",
                            overflow: "hidden",
                          }}
                        >
                          {product.title}
                        </h5>
                        <span
                          className="mb-0 "
                          style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: "#79B93C",
                          }}
                        >
                          ₹{product.item_new_price}
                        </span>
                      </div>
                    </div>
                    <div>
                      {product.stock === 0 ? (
                        <button
                          className="badge bg-soft-success p-2"
                          style={{ borderWidth: 0, cursor: "not-allowed" }}
                          type="button"
                          disabled
                        >
                          <span className="fw-bold fs-1 text-success">
                            Sold Out
                          </span>
                        </button>
                      ) : (
                        <>
                          {cartItems[product.id] ? (
                            <div
                              className="badge bg-soft-success p-2"
                              style={{ alignItems: "center" }}
                            >
                              <button
                                onClick={() => subOne(product.id)}
                                style={{
                                  borderWidth: 0,
                                  fontSize: 24,
                                  backgroundColor: "transparent",
                                }}
                              >
                                -
                              </button>
                              <span style={{ color: "black", fontSize: 18 }}>
                                {cartItems[product.id]}
                              </span>
                              <button
                                onClick={() => addOne(product.id)}
                                style={{
                                  borderWidth: 0,
                                  fontSize: 24,
                                  backgroundColor: "transparent",
                                }}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              className="badge bg-soft-success p-2"
                              style={{ borderWidth: 0 }}
                              type="button"
                              onClick={() => onPressAddToCart(product.id)}
                            >
                              <span className="fw-bold fs-1 text-success">
                                + Add to cart
                              </span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <div className="prev" style={{backgroundColor: currentPage === 1 ? '#80808052' : 'antiquewhite'}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-chevron-left"
                viewBox="0 0 16 16"
                style={{cursor: currentPage === 1 ? '' : 'pointer'}}
                onClick={()=> currentPage === 1 ? null : pageChange('prev')}
              >
                <path
                  fill-rule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                />
              </svg>
            </div>
            <div className="pages">{currentPage} / {totalPage}</div>
            <div className="next" style={{backgroundColor: currentPage === totalPage ? '#80808052' : 'antiquewhite'}}>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  class="bi bi-chevron-right"
                  viewBox="0 0 16 16"
                  style={{cursor: currentPage === totalPage ? '' : 'pointer'}}
                  onClick={()=> currentPage === totalPage ? null : pageChange('next')}
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                  />
                </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Product;
