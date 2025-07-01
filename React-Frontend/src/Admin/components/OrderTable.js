import React, { useState } from 'react';

export function OrderTable() {
  const [showOnlyMyOrders, setShowOnlyMyOrders] = useState(false);

  const orders = [
    { no: 1, orderId: '#ORD0001', product: 'Asphodel', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Pending' },
    { no: 2, orderId: '#ORD0002', product: 'Asphodel', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Delivered' },
    { no: 3, orderId: '#ORD0003', product: 'Asphodel', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Preparing' },
    { no: 4, orderId: '#ORD0004', product: 'Asphodel', date: '01-01-2025', price: '49.99', paymentMethod: 'Cash', status: 'Shipped' },
    { no: 5, orderId: '#ORD0005', product: 'Asphodel', date: '01-01-2025', price: '49.99', paymentMethod: 'Cash', status: 'Delivered' },
    { no: 6, orderId: '#ORD0006', product: 'Asphodel', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Cancelled' },
    { no: 7, orderId: '#ORD0007', product: 'Asphodel', date: '01-01-2025', price: '49.99', paymentMethod: 'Cash', status: 'Shipped' },
    { no: 8, orderId: '#ORD0008', product: 'Asphodel', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Delivered' },
    { no: 9, orderId: '#ORD0009', product: 'Asphodel', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Shipped' },
    { no: 10, orderId: '#ORD0010', product: 'Asphodel', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Delivered' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-100 text-orange';
      case 'Delivered':
        return 'bg-green-100 text-green';
      case 'Preparing':
        return 'bg-blue-100 text-blue-600';
      case 'Shipped':
        return 'bg-purple-100 text-purple-600';
      case 'Cancelled':
        return 'bg-red-100 text-red';
      default:
        return 'bg-gray-100 text-gray';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 font-sans">
      {/* Top section: Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button className="px-4 py-2 rounded-lg bg-green text-white text-sm font-medium">All order (240)</button>
          <button className="px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-200">Completed</button>
          <button className="px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-200">Pending</button>
          <button className="px-4 py-2 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-200">Canceled</button>
        </div>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search order report"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLineLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Toggle: Show Only My Orders */}
      <div className="flex items-center mb-6">
        <label htmlFor="toggle" className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              id="toggle"
              type="checkbox"
              className="sr-only"
              checked={showOnlyMyOrders}
              onChange={() => setShowOnlyMyOrders(!showOnlyMyOrders)}
            />
            <div className={`block w-10 h-6 rounded-full ${showOnlyMyOrders ? 'bg-green' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showOnlyMyOrders ? 'translate-x-full' : ''}`}></div>
          </div>
          <div className="ml-3 text-gray-700 text-sm">Show Only My Orders</div>
        </label>
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* <input type="checkbox" className="form-checkbox h-4 w-4 text-green-600 rounded" /> */}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Id</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-green-600 rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.no}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* <img src="imges/Rectangle 41.png" alt="Product" className="w-8 h-8 rounded-full mr-2" /> */}
                    <span className="text-sm text-gray-900">{order.product}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    {order.paymentMethod === 'Visa' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {order.paymentMethod}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z" />
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.927a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165M16.5 3.75V7.5a.75.75 0 0 1-.75.75h-3.75a.75.75 0 0 1-.75-.75V3.75m-3 0V7.5a.75.75 0 0 0 .75.75h3.75a.75.75 0 0 0 .75-.75V3.75M6.75 3.75H4.875c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125h14.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H16.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center justify-between items-center mt-6">
        <button className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Previous
        </button>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg">1</button>
          <button className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">2</button>
          <button className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">3</button>
          <button className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">4</button>
          <button className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">5</button>
          <span className="px-4 py-2 text-gray-700">...</span>
          <button className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">24</button>
        </div>
        <button className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
          Next
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default OrderTable;