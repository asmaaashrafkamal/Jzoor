import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import React, { useState, useMemo, useEffect, useCallback } from 'react';

export function OrderHistoryPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

// const orders = [
//     {
//       status: 'Delivered',
//       statusClass: 'bg-green text-white',
//       date: '08/06/2025 02:00PM',
//       orderNo: '5578941201579654',
//       total: '15',
//       items: [
//         { image: '/imges/0c11d118-d0f7-4028-b0d3-c0db53d7f8a2.webp', name: 'Tutreez Mug', price: '35' }
//       ]
//     },
//     {
//       status: 'Cancelled',
//       statusClass: 'bg-red text-white',
//       date: '08/06/2025 02:00PM',
//       orderNo: '5578941201579654',
//       total: '15',
//       items: [
//         { image: '/imges/Enhance your home decor with our unique handmade… (1).webp', name: 'Macramé Leaf Clips', price: '35' }
//       ]
//     },
//     {
//       status: 'Shipped',
//       statusClass: 'bg-yellow-500 text-white',
//       date: '05/06/2025 02:00PM',
//       orderNo: '5578941201579654',
//       total: '15',
//       items: [
//         { image: '89/imges/Gorgeously patterned vibrant glass adds a….webp', name: 'Self-Watering Globe Stakes', price: '35' }
//       ]
//     },
//     // Add more orders as needed for different statuses
//     {
//       status: 'Returned',
//       statusClass: 'bg-gray-500 text-white',
//       date: '04/06/2025 01:00PM',
//       orderNo: '5578941201579655',
//       total: '25',
//       items: [
//         { image: '/imges/flor-saurina-xWijL2q3xAM-unsplash.webp', name: 'Ceramic Pot', price: '25' }
//       ]
//     },
//     {
//       status: 'All', // Represents a generic order that might not fit specific filters
//       statusClass: 'bg-blue-500 text-white', // Example class for 'All' or default status
//       date: '03/06/2025 10:00AM',
//       orderNo: '5578941201579656',
//       total: '45',
//       items: [
//         { image: '/imges/Monstera Macrame Wristlet, Leaf Macrame Wristlet… (1).webp', name: 'Orchid Plant', price: '45' }
//       ]
//     },
//   ];
const fetchOrders = async () => {
  setLoading(true);
  try {
    const res = await axios.get('http://localhost:8000/api/orders');

    // Transform backend data to match your frontend structure
    const formattedOrders = res.data.map((order) => ({
      status: order.status, // e.g., 'Delivered'
      statusClass:
        order.status === 'Delivered' ? 'bg-green text-white'
        : order.status === 'Cancelled' ? 'bg-red text-white'
        : order.status === 'Shipped' ? 'bg-yellow-500 text-white'
        : order.status === 'Returned' ? 'bg-gray-500 text-white'
        : 'bg-blue-500 text-white',

      date: new Date(order.created_at).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      orderId:order.id,
      orderNo: order.order_number || `#ORD${order.id.toString().padStart(8, '0')}`,
      total: order.total_price || '0',

      items: order.items.map((item) => ({
        image: item.product?.image || '/imges/default.jpg',
        name: item.product?.name || 'Unnamed Product',
        price: item.price || '0'
      }))
    }));

    setOrders(formattedOrders);

  } catch (err) {
    console.error("Failed to fetch orders", err);
    toast.error("Failed to load orders. Please try again later.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchOrders();
}, []);


  const filteredOrders = activeFilter === 'All'
    ? orders
    : orders.filter(order => order.status === activeFilter);

  return (
    <div className="bg-gray-100  min-h-screen font-sans">
      <div className="bg-white  rounded-lg shadow-sm  mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Order History</h1>

        {/* Filters */}
        <div className="flex space-x-4 mb-8 text-sm text-gray-600">
          {['All', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map(filter => (
            <button
              key={filter}
              className={`pb-1 ${activeFilter === filter ? 'font-semibold text-gray-900 border-b-2 border-green-700' : 'hover:text-gray-900'}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Order Cards */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className={`px-3 py-1 rounded-full text-md font-medium ${order.statusClass}`}>
                  {order.status}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">{order.date} | Order No: {order.orderNo}</p>
                  <p className="text-lg font-semibold text-gray-900">Total: ${order.total}</p>
                </div>
              </div>

              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between py-3 border-t border-gray-200 first:border-t-0">
                  <div className="flex items-center">
                    <img
                      src={`http://localhost:8000/storage/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <p className="text-base font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-700">${item.unit_price}</p>
                    </div>
                  </div>
                  </div>

    ))}
                <div className="flex items-center justify-between py-3 border-t border-gray-200 first:border-t-0">555888888888866350+
                 <Link
                  to={`/orderDetails/${order.orderId}`}
                  className="px-4 py-2 no-underline border border-gray-300 rounded-md text-green-700 text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  Details
                </Link>
                </div>
                </div>

          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center text-gray-500 py-10">No orders found for this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryPage;
