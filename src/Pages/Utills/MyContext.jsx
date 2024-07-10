import React, { createContext, useState } from 'react';

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [cartGlobalItems, setCartGlobalItems] = useState([]);

  return (
    <MyContext.Provider value={{ cartGlobalItems, setCartGlobalItems }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };
