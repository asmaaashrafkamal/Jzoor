import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './context/AuthLogin';
// import { ProductProvider } from "./context/ProductContext";
import { NotificationProvider } from "./context/NotificationContext";
import { DNotificationProvider } from "./context/DeliveryNotificationContext";
import { SNotificationProvider } from "./context/SNotificationContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>   {/* ✅ Wrap App with ProductProvider */}
      <DNotificationProvider>   {/* ✅ Wrap App with ProductProvider */}
      <SNotificationProvider>   {/* ✅ Wrap App with ProductProvider */}
        <App />
        </SNotificationProvider>
        </DNotificationProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
