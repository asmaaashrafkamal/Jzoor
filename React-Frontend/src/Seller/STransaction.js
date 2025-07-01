import React, { useState, useEffect, useMemo } from 'react';
import Title from './components/Title';

// Dashboard Card Component (كما هو)
const DashboardCard = ({ title, value, change, isPositive }) => (
  <div className="p-6 rounded-lg shadow-md flex flex-col justify-between" style={{ backgroundColor: '#FFFFFF' }}>
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium" style={{ color: '#6B7280' }}>{title}</h3>
      <svg
        className="cursor-pointer"
        style={{ color: '#9CA3AF' }}
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        ></path>
      </svg>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-semibold" style={{ color: '#111827' }}>{value}</span>
      <span className={`ml-2 text-sm font-medium`} style={{ color: isPositive ? '#10B981' : '#EF4444' }}>
        {isPositive ? '▲' : '▼'} {change}
      </span>
    </div>
    <p className="text-xs mt-2" style={{ color: '#6B7280' }}>Last 7 days</p>
  </div>
);

// Payment Method Card Component (كما هو)
const PaymentMethodCard = () => (
  <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium" style={{ color: '#6B7280' }}>Payment Method</h3>
      <svg
        className="cursor-pointer"
        style={{ color: '#9CA3AF' }}
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        ></path>
      </svg>
    </div>

    <div className="flex flex-col md:flex-row items-center gap-4">
      {/* Credit Card Mockup */}
      <div className="relative w-full max-w-sm h-48 rounded-xl shadow-lg p-6 text-white flex flex-col justify-between overflow-hidden"
           style={{ background: 'linear-gradient(to bottom right, #4ADE80, #16A34A)' }}>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://placehold.co/600x400/ffffff/000000?text=Card+Pattern')] bg-repeat opacity-10"></div>
        <div className="flex justify-between items-center z-10">
          <span className="text-sm font-bold tracking-widest">VISA</span>
          [Image of a credit card chip]
        </div>
        <div className="text-2xl tracking-widest font-mono z-10">
          **** **** **** 2345
        </div>
        <div className="flex justify-between items-end z-10">
          <div>
            <div className="text-xs opacity-75">Card Holder</div>
            <div className="text-sm font-semibold">Burhan Moraveh</div>
          </div>
          <div>
            <div className="text-xs opacity-75">Expires</div>
            <div className="text-sm font-semibold">02/30</div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="flex-1 w-full mt-4 md:mt-0">
        <div className="text-sm" style={{ color: '#4B5563' }}>
          <p className="mb-2">
            Status: <span className="font-semibold" style={{ color: '#059669' }}>Active</span>
          </p>
          <p className="mb-2">
            Transactions: <span className="font-semibold">1,250</span>
          </p>
          <p className="mb-4">
            Revenue: <span className="font-semibold">$50,000</span>
          </p>
          <a href="#" className="hover:underline text-sm font-medium" style={{ color: '#2563EB' }}>
            View Transactions
          </a>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button className="flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium"
            style={{ color: '#4B5563', backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' }}>
            <svg className="mr-2 -ml-1 w-5 h-5" style={{ color: '#4B5563' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            Add Card
          </button>
          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
            style={{ backgroundColor: '#EF4444' }}>
            Deactivate
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
const AppTransaction = () => {
  const [transactions, setTransactions] = useState([
    { id: '#CUST001', customerName: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Completed' }, // Changed 'Completo' to 'Completed'
    { id: '#CUST002', customerName: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Completed' }, // Changed 'Completo' to 'Completed'
    { id: '#CUST003', customerName: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Completed' }, // Changed 'Completo' to 'Completed'
    { id: '#CUST004', customerName: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'Bank', status: 'Completed' }, // Changed 'Completo' to 'Completed'
    { id: '#CUST005', customerName: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Canceled' },
    { id: '#CUST006', customerName: 'Emily Davis', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Pending' },
    { id: '#CUST007', customerName: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'Bank', status: 'Canceled' },
    { id: '#CUST008', customerName: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Completed' },
    { id: '#CUST009', customerName: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Pending' },
    { id: '#CUST010', customerName: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'Bank', status: 'Canceled' },
  ]);

  // Changed 'All order' to 'All' for simpler comparison
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // As per the image, about 7 items are visible

  // Filter transactions based on activeTab
  const filteredByTab = useMemo(() => {
    if (activeTab === 'All') {
      return transactions;
    }
    return transactions.filter(transaction => transaction.status === activeTab);
  }, [transactions, activeTab]);

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    return filteredByTab.filter(transaction =>
      Object.values(transaction).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [filteredByTab, searchTerm]);

  // Reset page to 1 whenever tab or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Only show "..." if total pages are more than 5
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always add the first page
      pageNumbers.push(1);

      // Add ellipsis if current page is far from the beginning
      if (currentPage > 3) {
        pageNumbers.push('...');
      }

      // Add pages around the current page
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 1 && i < totalPages) {
          pageNumbers.push(i);
        }
      }

      // Add ellipsis if current page is far from the end
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }

      // Always add the last page if it's not already added
      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }
    // Remove duplicates and sort numerically, pushing '...' to the end
    return [...new Set(pageNumbers)].sort((a, b) => {
        if (typeof a === 'string' && a.includes('...')) return 1;
        if (typeof b === 'string' && b.includes('...')) return -1;
        return a - b;
    });
  };


  return (
    <div className="min-h-screen p-4 font-inter" style={{ backgroundColor: '#F3F4F6' }}>
   
        <Title title="Transaction Overview" />
      

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Dashboard Cards Section */}
        <div className="grid grid-cols-1 w-full  md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DashboardCard
            title="Total Revenue"
            value="$15,045"
            change="14.4%"
            isPositive={true}
          />
          <DashboardCard
            title="Completed Transactions"
            value="3,150"
            change="20%"
            isPositive={true}
          />
          <DashboardCard
            title="Pending Transactions"
            value="150"
            change="05%"
            isPositive={true}
          />
          <DashboardCard
            title="Failed Transactions"
            value="75"
            change="15%"
            isPositive={false}
          />
        </div>

        {/* Payment Method Card */}
        {/* <div className="mb-6 w-full lg:w-1/2 ">
          <PaymentMethodCard />
        </div> */}
      </div>

      {/* Transactions Table Section */}
      <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex flex-wrap gap-2 text-sm font-medium" style={{ color: '#4B5563' }}>
            {/* Adjusted tab names for consistency with data status values */}
            {['All', 'Completed', 'Pending', 'Canceled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)} // Direct use of tab for comparison
                className={`py-2 px-4 rounded-md transition-colors duration-200
                  ${activeTab === tab
                    ? 'text-white shadow-md'
                    : 'text-gray-800'
                  }`}
                style={{
                  backgroundColor: activeTab === tab ? '#3B82F6' : '#F3F4F6',
                  color: activeTab === tab ? '#FFFFFF' : '#1F2937'
                }}
              >
                {/* For 'All' tab, show total count; for others, just the name */}
                {tab === 'All' ? `All (${transactions.length})` : tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search payment history"
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#D1D5DB', outlineColor: '#3B82F6', '--tw-ring-color': '#3B82F6' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: '#9CA3AF' }}
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto lg:overflow-x-visible">
          <div className="max-w-[250px] lg:min-w-full">
            <table className="w-full divide-y" style={{ borderColor: '#E5E7EB' }}>
              <thead style={{ backgroundColor: '#F9FAFB' }}>
                <tr>
                  {['Transaction Id', 'Customer name', 'Date', 'Total', 'Method', 'Status', 'Action'].map(header => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280' }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
                {currentItems.length > 0 ? (
                  currentItems.map((transaction, index) => (
                    <tr key={transaction.id}> {/* Using transaction.id as key for better performance */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#111827' }}>{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{transaction.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{transaction.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{transaction.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                          style={{
                            backgroundColor:
                              transaction.status === 'Completed' ? '#D1FAE5' : // Changed 'Completo' to 'Completed'
                              transaction.status === 'Pending' ? '#FEF3C7' :
                              transaction.status === 'Canceled' ? '#FEE2E2' : '',
                            color:
                              transaction.status === 'Completed' ? '#065F46' : // Changed 'Completo' to 'Completed'
                              transaction.status === 'Pending' ? '#92400E' :
                              transaction.status === 'Canceled' ? '#991B1B' : ''
                          }}
                        >
                          <span className="w-2 h-2 mr-1 rounded-full flex-shrink-0 self-center"
                            style={{
                              backgroundColor:
                                transaction.status === 'Completed' ? '#10B981' : // Changed 'Completo' to 'Completed'
                                transaction.status === 'Pending' ? '#F59E0B' :
                                transaction.status === 'Canceled' ? '#EF4444' : ''
                            }}
                          ></span>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer" style={{ color: '#2563EB' }}>
                        View Details
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center" style={{ color: '#6B7280' }}>No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <span className="text-sm" style={{ color: '#4B5563' }}>
            Showing <span className="font-semibold">{filteredTransactions.length > 0 ? indexOfFirstItem + 1 : 0}</span> to <span className="font-semibold">{indexOfFirstItem + currentItems.length}</span> of <span className="font-semibold">{filteredTransactions.length}</span> entries
          </span>
          <nav className="flex flex-col md:flex-row justify-between items-center items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#4B5563', backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' }}
            >
              ← Previous
            </button>
            <div className="flex space-x-1">
              {renderPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && paginate(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-md
                    ${typeof page !== 'number' ? 'cursor-default border-transparent bg-transparent hover:bg-transparent' : ''}
                  `}
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
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#4B5563', backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' }}
            >
              Next →
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AppTransaction;