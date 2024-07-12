import React, { useEffect, useState, useContext } from "react";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import Api from "../Utills/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../Utills/MyContext";


function CartDetails() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [walletApplied, setWalletApplied] = useState(false);
  const uid = localStorage.getItem("user_id");
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [discountPrice, setDiscount] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);
  let delvCharges = localStorage.getItem('deliveryCharges');
  const [finalPrice, setFinalPrice] = useState({
    totalPrice: 0,
    delivery_charges: delvCharges ? delvCharges : 0,
    discount_price: 0,
    finalAmount: 0,
  });
  const { cartGlobalItems, setCartGlobalItems } = useContext(MyContext);
  const access_token = localStorage.getItem('access_token');
  const [cartError, setCartError] = useState(null);


  const getCartItems = async () => {
    try {
      const response = await Api.get(`api/get_cart/?user_id=${uid}`);
      setCartGlobalItems(response.data);
    } catch (error) {
      // error handling;
    }
  };

  useEffect(() => {
    if (!access_token) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartGlobalItems(cart);
    }
    else {
      getCartItems();
    }
  }, [access_token, setCartGlobalItems]);

  useEffect(() => {
    let cart_items = cartGlobalItems?.map(item => {
      item['totalPrice'] = item?.item_new_price * item?.quantity;
      return item;
    });
    let totalPrice = cartGlobalItems?.reduce((total, item) => total + (item.item_new_price * item.quantity), 0);
    setFinalPrice({
      ...finalPrice,
      totalPrice: totalPrice,
      finalAmount: parseFloat(totalPrice) + parseFloat(finalPrice.delivery_charges),
    });
    setCartItems(cart_items);
  }, [cartGlobalItems]);

  const removeCartItem = (itemId) => {
    if (access_token) {
      updateCartItems(itemId, 'remove');
    }
    else {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart?.length === 0 || !cart) {
        return;
      }
      let productIndex = cart.findIndex(prod => prod?.id === itemId);
      if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartGlobalItems(cart);
      }
    }
  }

  const checkoutNow = () => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        navigate("/checkout");
      }else{
        navigate("/login");
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
          action: action
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
      if (action === "add") {
        if (productIndex !== -1) {
          cart[productIndex].quantity += 1;
        } else {
          return;
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
    <div >
      <Navbar />

      <main
        className="main content-main"
        id="top"
        style={{ paddingTop: "100px", margin: 50, textAlign: "center" }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : cartItems.length === 0 ? (
          <p>Your cart is empty. Add something to your cart!</p>
        ) : (
          <div
            style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}
          >
            <div style={{ flex: "1", marginRight: "20px" }}>
              <h2>Your Cart</h2>
              <div
                style={{
                  flex: 1,

                  borderRadius: "10px",
                  marginBottom: "130px",
                  padding: "50px 10px 10px 10px"
                }}
              >
                {cartItems.map((item) => (
                  <div
                    key={item?.id}
                    style={{
                      minWidth: "20%",
                      margin: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      flexDirection: "row",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <img
                      src={`https://app.frozenwala.com${item?.item_photo?.includes('media/') ? item?.item_photo : 'media/' + item?.item_photo}`}
                      alt={item?.title}
                      style={{
                        width: "100px",
                        height: "100px",
                        marginRight: "20px",
                        borderRadius: "10px 0px 0px 10px"
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              marginTop: 2,
                            }}
                          >
                            {item?.title}
                          </h3>
                          <p style={{ color: "#888", marginBottom: "5px", textAlign: 'start' }}>
                            Price: ₹{item?.totalPrice}
                          </p>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <button className="cart-btn" onClick={() => updateCartItems(item?.product_id, 'minus')}>−</button>
                            <span style={{ margin: "0 10px" }}>{item?.quantity}</span>
                            <button className="cart-btn" onClick={() => updateCartItems(item?.product_id, 'add')}>+</button>
                            {cartError === item.product_id ? <p className="text-center" style={{ color: 'red', margin: 0, marginLeft: '5px' }}>Out of stock</p> : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeCartItem(item.product_id)}
                      style={{
                        backgroundColor: "#F17228",
                        color: "white",
                        border: "none",
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "10px",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                flex: "1",
                paddingLeft: "20px",
                minWidth: 300,
              }}
            >
              <div
                style={{
                  marginTop: "5px",
                  borderTop: "1px solid #ccc",
                }}
              >
                <div
                  style={{
                    marginTop: 5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ marginInlineEnd: "10px" }}>Total Price:</p>
                  <span style={{ fontWeight: "bold" }}>₹{finalPrice?.totalPrice}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ marginInlineEnd: "10px" }}>Delivery Charges:</p>
                  <span style={{ fontWeight: "bold" }}>₹{finalPrice?.delivery_charges}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ marginInlineEnd: "10px" }}>Discounted Price:</p>
                  <span style={{ fontWeight: "bold" }}>₹{finalPrice?.discount_price}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ marginInlineEnd: "10px", fontWeight: "bold" }}>
                    Payable Amount:
                  </p>
                  <span style={{ fontWeight: "bold" }}>₹{finalPrice?.finalAmount}</span>
                </div>
                <button
                  onClick={checkoutNow}
                  style={{
                    backgroundColor: "#F17228",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px 20px",
                    marginTop: "20px",
                    cursor: "pointer",
                  }}
                >
                  Proceed To Pay
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default CartDetails;
