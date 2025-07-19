// OrderDetailsModal.js
import React from 'react';
import { FiX } from 'react-icons/fi'; // Import FiX icon

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#2D3748' }}>Order Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-semibold" style={{ color: '#065F46' }}>Order ID:</p>
            <p>{order.orderId}</p>
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#065F46' }}>Customer Name:</p>
            <p>{order.customerName}</p>
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#065F46' }}>Date:</p>
            <p>{order.date}</p>
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#065F46' }}>Delivery Time:</p>
            <p>{order.deliveryTime}</p>
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#065F46' }}>Destination:</p>
            <p>{order.destination}</p>
          </div>
          {/* Add more order details here as needed */}
          <div>
            <p className="font-semibold" style={{ color: '#065F46' }}>Status:</p>
            <p className="text-green-600">Delivered</p> {/* Example static status */}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#065F46', }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#065F46'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
