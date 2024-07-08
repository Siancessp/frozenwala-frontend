import React, { useEffect, useState } from "react";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import Api from "../Utills/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function CartDetails() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const access_token = localStorage.getItem('access_token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [walletApplied, setWalletApplied] = useState(false);

  const uid = localStorage.getItem("user_id");
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [discountPrice, setDiscount] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState({
    totalPrice: 0,
    delivery_charges: 30,
    discount_price: 0,
    finalAmount: 0,
  });

  const getProducts = async () => {
    try {
      const response = await Api.get(`api/get_cart/?user_id=${uid}`);
      console.log('+++++++++++++', response?.data);
      for (let data of response?.data){
        data['totalPrice'] = data.price;
      }
      console.log('+++++++++++++', response?.data);
      setCartItems(response.data);
      console.log(response.data);
    } catch (error) {
      setError("Error fetching cart items.");
      console.log("Error fetching cart items:", error);
    }
  };

  const getAllProducts = async () => {
    try {
      if (uid) {
        const response = await Api.get(`api/product-all/`);
        setProducts(response.data);
      } else {
        const response = await axios.get(`https://app.frozenwala.com/base/api/auth/product-all/`);
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  useEffect(() => {
    if (!access_token){
      getAllProducts();
    }
  }, [])

  useEffect(()=>{
    let totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    setFinalPrice({
      ...finalPrice,
      totalPrice: totalPrice,
      finalAmount: totalPrice,
    });
  }, [cartItems]);
  

  useEffect(() => {
    if (access_token) {
      getProducts();
    } else {
      let cartLocalItems = localStorage.getItem('cart');
      if (cartLocalItems) {
        cartLocalItems = JSON.parse(cartLocalItems);
        let itemIds = Object.keys(cartLocalItems);
        const filteredProducts = products?.filter(product => itemIds?.includes(product.id.toString()));
        
        const updatedProducts = filteredProducts.map(prod => {
          let qty = cartLocalItems[prod.id];
          return {
            ...prod,
            quantity: qty,
            price: prod.item_new_price,
            product_image: prod.item_photo,
            product_name: prod.title,
            totalPrice: qty * prod.item_new_price,
          };
        });
        setCartItems(updatedProducts);
      }
    }
  }, [products]);

  const getTotalPrice = async () => {
    setLoading(true);
    try {
        const response = await Api.get(`api/get_total_price/?user_id=${uid}`);
        console.log("Total Price Response:", response.data);
        const totalPrice = response.data.total_price;
        const deliveryCharge = response.data.delivery_charge;
        const discount = response.data.discounted_price;
        const previousPrice = response.data.previous_price;
        setTotalPrice(totalPrice);
        setDeliveryCharge(deliveryCharge);
        setDiscount(discount);
        setPreviousPrice(previousPrice);

        setLoading(false); 
      
    } catch (error) {
      setError("Error fetching total price.");
      console.log("Error fetching total price:", error.response);
      setLoading(false);
    }
  };

  const removeItemFromCart = async (itemId) => {
    try {
      await Api.remove(`api/remove-cart-item/?cart_id=${itemId}`);
      if (!access_token){
        // getTotalPrice();
      }
      
      getProducts();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  
  const updateCartItems = async(id, type, quantity=null)=>{
    if (access_token){
      if (type === 'plus') {
        try {
          await Api.post(`api/increase/`, { cart_id: id });
          getProducts();
        } catch (error) {
          console.log("Error decreasing:", error);
        }
      }
      else {
        if (quantity === 1) {
          await removeItemFromCart(id);
        } else {
          try {
            await Api.post(`api/decrease/`, { cart_id: id });
            if (!access_token){
              // getTotalPrice();
            }
            getProducts();
          } catch (error) {
            console.log("Error decreasing:", error);
          }
        }
      }
    }
    else {
      let updatedItems;
      if (type === 'plus') {
        updatedItems = cartItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          if (!access_token){
            // getTotalPrice();
          }
          return item;
        });
      } else if (type === 'minus') {
        updatedItems = cartItems.map(item => {
          if (item.id === id && item.quantity > 0) {
            return { ...item, quantity: item.quantity - 1 };
          }
          if (!access_token){
            // getTotalPrice();
          }
          return item;
        });
      }
      updatedItems = updatedItems.filter(item => item.quantity > 0);
      updatedItems = updatedItems.map(prod => {
        return {
          ...prod,
          totalPrice: prod.price * prod.quantity
        };
      });
      setCartItems(prevItems => updatedItems);
      const localStorageData = {};
      for (let item of updatedItems) {
        localStorageData[item.id] = item.quantity;
      }
      localStorage.setItem('cart', JSON.stringify(localStorageData));
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

  return (
    <div>
      <Navbar />

      <main
        className="main"
        id="top"
        style={{ paddingTop: "70px", margin: 50, textAlign: "center" }}
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
                  minWidth: "400px",
                  maxWidth: "600px",
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
                      src={`https://app.frozenwala.com/${item?.product_image?.includes('media/') ? item?.product_image : 'media/' + item?.product_image}`}
                      alt={item?.product_name}
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
                            {item?.product_name}
                          </h3>
                          <p style={{ color: "#888", marginBottom: "5px" }}>
                            Price: ₹{item?.totalPrice}
                          </p>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <button onClick={() => updateCartItems(item?.id, 'minus', item?.quantity)}>−</button>
                            <span style={{ margin: "0 10px" }}>{item?.quantity}</span>
                            <button onClick={() => updateCartItems(item?.id, 'plus')}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItemFromCart(item.id)}
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
