import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TransactionTable = ({
transactions,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  handlePrevious,
  handleNext,
  renderPageNumbers,
  paginate,
  activeTab,
  setActiveTab,
  indexOfFirstItem,
  totalFilteredItems
}) => {


  return (
    <div className="p-6 rounded-lg shadow-md bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex flex-wrap gap-2 text-sm font-medium text-gray-700">
          {['All', 'Completed', 'Pending', 'Canceled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                activeTab === tab ? 'text-white shadow-md' : 'text-gray-800'
              }`}
              style={{
                backgroundColor: activeTab === tab ? '#3B82F6' : '#E5E7EB',
                color: activeTab === tab ? '#FFFFFF' : '#374151'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search payment history"
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Transaction ID', 'Customer Name', 'Date', 'Total', 'Method', 'Status', 'Action'].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'Canceled' ? 'bg-red-100 text-red-800' : ''
                    }`}>
                      <span className={`w-2 h-2 mr-1 rounded-full flex-shrink-0 self-center ${
                        transaction.status === 'Completed' ? 'bg-green-500' :
                        transaction.status === 'Pending' ? 'bg-yellow-500' :
                        transaction.status === 'Canceled' ? 'bg-red-500' : ''
                      }`}></span>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer text-blue-600 hover:text-blue-800 transition-colors">
                    View Details
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        <span className="text-sm text-gray-700 mb-4 md:mb-0">
          Showing <span className="font-semibold">{totalFilteredItems > 0 ? indexOfFirstItem + 1 : 0}</span> to{' '}
          <span className="font-semibold">{indexOfFirstItem + transactions.length}</span> of{' '}
          <span className="font-semibold">{totalFilteredItems}</span> entries
        </span>

        <nav className="flex flex-col md:flex-row justify-between items-center items-center space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
          >
            ← Previous
          </button>
          <div className="flex space-x-1">
            {renderPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && paginate(page)} // هنا يتم استدعاء paginate
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  typeof page !== 'number' ? 'cursor-default border-transparent bg-transparent hover:bg-transparent' : ''
                }`}
                style={{
                  backgroundColor: currentPage === page ? '#2563EB' : '#FFFFFF',
                  color: currentPage === page ? '#FFFFFF' : '#4B5563',
                  borderColor: currentPage === page ? '#2563EB' : '#D1D5DB',
                  boxShadow: currentPage === page ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
                }}
                disabled={typeof page !== 'number'}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
          >
            Next →
          </button>
        </nav>
      </div>
    </div>
  );
};

export default TransactionTable;
