import React, { useEffect, useState } from 'react';
import Api from '../Utills/Api';

const QuantityButton = ({ product, getTotalPrice, onPressAddToCart }) => {
  const [quantity, setQuantity] = useState(0);
  const [stock, setStock] = useState();

  const getQuantity = async () => {
    try {
      const uid = localStorage.getItem("user_id");
      const response = await Api.get(
        `api/get_cart/main/?user_id=${uid}&&product_id=${product.id}`
      );
      setQuantity(response.data.quantity);
    } catch (error) {
      // error handling
    }
  };

  const getStock = async () => {
    try {
      const response = await Api.get(`api/stock/?product_id=${product.id}`);
      setStock(response.data[0].openingstock);
    } catch (error) {
      // error handling
    }
  };

  useEffect(() => {
    getStock();
    getQuantity();
  }, []);

  const handlePress = () => {
    if (quantity === 0) {
      getTotalPrice();
      onPressAddToCart(product);
      setQuantity(1);
    }
  };

  const addOne = async (id) => {
    try {
      const uid = localStorage.getItem("user_id");
      if (stock > quantity) {
        await Api.post(`api/increase/main/`, {
          product_id: id,
          user_id: uid,
        });
        getQuantity();
        getTotalPrice();
        // You may replace the toast with a notification component or similar in React.js
      } else if (stock === quantity) {
      }
    } catch (error) {
      // error handling
    }
  };

  const subOne = async (id) => {
    try {
      const uid = localStorage.getItem("user_id");
      if (quantity > 1) {
        await Api.post(`api/decrease/main/`, {
          product_id: id,
          user_id: uid,
        });
        getQuantity();
        getTotalPrice();
      } else if (quantity === 1) {
        await Api.post(`api/decrease/main/`, {
          product_id: id,
          user_id: uid,
        });
        setQuantity(0);
        getTotalPrice();
      }
    } catch (error) {
      // error handling
    }
  };

  return (
    <div>
      {quantity > 0 ? (
        <div style={styles.add}>
          <button onClick={() => subOne(product.id)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => addOne(product.id)}>+</button>
        </div>
      ) : (
        <button style={styles.add} onClick={handlePress}>
          + Add
        </button>
      )}
    </div>
  );
};

export default QuantityButton;

const styles = {
  add: {
    backgroundColor: '#FF4D00',
    padding: '10px',
    borderRadius: '6px',
  },
};
