import React, { useEffect, useState, useContext } from "react";
import Api from "../Utills/Api";
import axios from "axios";
import { MyContext } from "../Utills/MyContext";
import { BASE_URL } from './../Utills/Api';
import { useSearchParams, useLocation } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";


function FoodMenu() {
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const pagedata = 20;
    const uid = localStorage.getItem("user_id");
    const { cartGlobalItems, setCartGlobalItems } = useContext(MyContext);
    const access_token = localStorage.getItem('access_token');
    const [cartError, setCartError] = useState(null);
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const foodType = searchParams.get('foodtype');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getAllProducts();
        if (access_token) {
            getCartItems();
        }
        else {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartGlobalItems(cart);
        }
        return () => {
        };
    }, [location.search]);

    useEffect(() => {
        let pages = Math.ceil(allProducts.length / pagedata);
        setTotalPage((prev) => pages);
        setProducts(allProducts.slice(0, pagedata));
    }, [allProducts]);

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}api/auth/product-all/`
            );
            let products = response?.data.slice(0, response?.data?.length - 1);
            let deliveryCharges = response?.data.slice(response?.data?.length - 1, response?.data?.length);
            products = products?.filter(prod => {
                if (foodType === 'veg') {
                    return !prod.non_veg;
                } else if (foodType === 'nonveg') {
                    return prod.non_veg;
                } else {
                    return false;
                }
            });
            setAllProducts(products);
            localStorage.setItem('deliveryCharges', deliveryCharges[0]?.DeliveryChange ? deliveryCharges[0]?.DeliveryChange : 0);
        } catch (error) {
            // error handling
        }
        finally{
            setLoading(false);
        }
    };

    const getCartItems = async () => {
        try {
            const response = await Api.get(`api/get_cart/?user_id=${uid}`);
            setCartGlobalItems(response.data);
        } catch (error) {
            // error handling
        }
    };

    const updateCartItems = async (productId, action) => {
        setCartError(null);
        if (access_token) {
            try {
                const endpoint = action === "add" ? "increase" : "decrease";
                let response = await Api.post(`api/${endpoint}/main/`, {
                    product_id: productId,
                    user_id: uid,
                });
                if (!response?.data?.error) {
                    setCartGlobalItems(response?.data);
                }
                else if (response?.data?.error?.includes('less than 1')) {
                    setCartGlobalItems(response?.data?.data);
                }
                else {
                    setCartError(productId);
                    setTimeout(() => {
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
                    product = products.find(prod => prod?.id === productId);
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

    const pageChange = (page) => {
        let current_page;
        if (page == 'prev') {
            current_page = currentPage - 1;
        }
        else {
            current_page = currentPage + 1;
        }
        setCurrentPage(prev => current_page);
        let start = (current_page - 1) * pagedata;
        let end = ((current_page - 1) * pagedata) + pagedata;
        setProducts(allProducts.slice(start, end));
    }

    return (
        <>
            <div className="content-main" >
                <Navbar />
                <section id="testimonial"className="test-main" >
                    {
                        !loading ? (products.length > 0 ? <div className="container">
                            <div className="row gx-2">
                                {products.map((product) => (
                                    <div
                                        key={product?.id}
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
                                                    src={product.item_photo ? `https://app.frozenwala.com/${product.item_photo}` : './../../../img/food.png'}
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

                                            <div className="card-body card-new">
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="flex-1 ms-3 text-center">
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
                                                {cartError === product.id ? <p className="text-center" style={{ color: 'red', margin: 0 }}>Out of stock</p> : null}
                                                <div className="text-center" style={{
                                                    alignItems: "center", display: "flex", justifyContent: "center",
                                                }}>
                                                    {product.stock === 0 ? (
                                                        <button
                                                            className="badge bg-soft-success p-2"
                                                            style={{ borderWidth: 0, cursor: "not-allowed", alignItems: "center", justifyContent: "space-between", display: "flex" }}
                                                            type="button"
                                                            disabled
                                                        >
                                                            <span className="fw-bold fs-1 text-success">
                                                                Sold Out
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <>
                                                            {cartGlobalItems.length > 0 && cartGlobalItems?.filter(prod => prod?.product_id === product?.id)[0] ? (
                                                                <div
                                                                    className="badge bg-soft-success p-2"
                                                                    style={{ alignItems: "center", justifyContent: "space-between", display: "flex" }}
                                                                >
                                                                    <button
                                                                        onClick={() => updateCartItems(product?.id, 'minus')}
                                                                        style={{
                                                                            borderWidth: 0,
                                                                            fontSize: 24,
                                                                            backgroundColor: "transparent",
                                                                        }}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span style={{ color: "black", fontSize: 18 }}>
                                                                        {cartGlobalItems.length > 0 && cartGlobalItems?.filter(prod => prod?.product_id === product?.id)[0]?.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => updateCartItems(product?.id, 'add')}
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
                                                                    onClick={() => updateCartItems(product.id, 'add')}
                                                                >
                                                                    <span className="fw-bold fs-1 text-success ">
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
                                <div className="prev" style={{ backgroundColor: currentPage === 1 ? '#80808052' : 'antiquewhite' }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        fill="currentColor"
                                        className="bi bi-chevron-left"
                                        viewBox="0 0 16 16"
                                        style={{ cursor: currentPage === 1 ? '' : 'pointer' }}
                                        onClick={() => currentPage === 1 ? null : pageChange('prev')}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                                        />
                                    </svg>
                                </div>
                                <div className="pages">{currentPage} / {totalPage}</div>
                                <div className="next" style={{ backgroundColor: currentPage === totalPage ? '#80808052' : 'antiquewhite' }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        fill="currentColor"
                                        className="bi bi-chevron-right"
                                        viewBox="0 0 16 16"
                                        style={{ cursor: currentPage === totalPage ? '' : 'pointer' }}
                                        onClick={() => currentPage === totalPage ? null : pageChange('next')}
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                            :
                            <div className="text-center" style={{ fontSize: '30px' }}>No products</div>)
                            :
                            <div class="d-flex justify-content-center align-items-center">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden"></span>
                                </div>
                            </div>
                    }
                </section>
            </div>
            <Footer />
        </>
    );
}

export default FoodMenu;
