import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AdminPage from './components/AdminPage.jsx';
import './index.css';

// /admin renders the private control center; every other path renders the public site.
const isAdminRoute = window.location.pathname.replace(/\/+$/, '').toLowerCase() === '/admin';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{isAdminRoute ? <AdminPage /> : <App />}</React.StrictMode>
);
