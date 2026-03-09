import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import axios from 'axios';

// Use an environment variable for the backend API URL when deployed on Vercel,
// or use fallback to localhost during local development.
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);