import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MyProvider } from './Pages/Utills/MyContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MyProvider>
      {/* <React.StrictMode> */}
        <App />
      {/* </React.StrictMode> */}
    </MyProvider>
);

reportWebVitals();
