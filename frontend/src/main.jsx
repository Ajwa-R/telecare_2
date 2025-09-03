import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="986251103378-v6l4785dvfl7ulg8o9hj0c0qp34foq7n.apps.googleusercontent.com">
    <Provider store={ store }>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);
