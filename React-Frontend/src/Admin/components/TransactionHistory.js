import React from 'react';
import { Link } from 'react-router-dom';

export function TransactionHistory() {
  const transactions = [
    { no: 1, idCustomer: '#6545', orderDate: '01 Oct | 11:29 am', status: 'Paid', amount: '$64' },
    { no: 2, idCustomer: '#5412', orderDate: '01 Oct | 11:29 am', status: 'Pendle', amount: '$55' },
    { no: 3, idCustomer: '#6622', orderDate: '01 Oct | 11:29 am', status: 'Paid', amount: '$15' },
    { no: 4, idCustomer: '#6462', orderDate: '01 Oct | 11:29 am', status: 'Paid', amount: '$26' },
    { no: 5, idCustomer: '#6462', orderDate: '01 Oct | 11:29 am', status: 'Paid', amount: '$26' },
    // { no: 6, idCustomer: '#6462', orderDate: '01 Oct | 11:29 am', status: 'Paid', amount: '$26' },
    // { no: 7, idCustomer: '#6462', orderDate: '01 Oct | 11:29 am', status: 'Paid', amount: '$26' },
 

  ];

  return (
    <div className="border border-gray-200 rounded-2xl p-4 shadow-md bg-white  font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Transaction</h2>
        <button className="flex items-center px-3 py-1 bg-gray-100 rounded-md text-gray-700 text-sm">
          Filter
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id Customer</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.no}.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.idCustomer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.orderDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  transaction.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <Link to="transaction" className="px-4 py-2 no-underline border border-gray-300 rounded-md text-blue-600 hover:bg-gray-100">Details</Link>
      </div>
    </div>
  );
}