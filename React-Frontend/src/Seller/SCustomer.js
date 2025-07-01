import React, { useState } from 'react';
import ReportChart from './components/ReportChart';

// Main Customer Dashboard Component
const CustomerDashboard = () => {
  // Dummy data for customer dashboard cards
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: { value: '11,040', change: '14.4%', isPositive: true },
    newCustomers: { value: '2,370', change: '20%', isPositive: true },
    visitors: { value: '250k', change: '20%', isPositive: true },
  });

  // Dummy data for customer table
  const [customers, setCustomers] = useState([
    { id: '#CUST001', name: 'John Doe', phone: '+1234567890', orderCount: 35, totalSpend: '3,450.00', status: 'Active' },
    { id: '#CUST002', name: 'John Doe', phone: '+1234567890', orderCount: 35, totalSpend: '3,450.00', status: 'Active' },
    { id: '#CUST003', name: 'John Doe', phone: '+1234567890', orderCount: 35, totalSpend: '3,450.00', status: 'Active' },
    { id: '#CUST004', name: 'John Doe', phone: '+1234567890', orderCount: 35, totalSpend: '3,450.00', status: 'Active' },
    { id: '#CUST005', name: 'Jane Smith', phone: '+1234567890', orderCount: 5, totalSpend: '250.00', status: 'VIP' },
    { id: '#CUST006', name: 'Emily Davis', phone: '+1234567890', orderCount: 30, totalSpend: '4,600.00', status: 'VIP' },
    { id: '#CUST007', name: 'Jane Smith', phone: '+1234567890', orderCount: 5, totalSpend: '250.00', status: 'VIP' },
    { id: '#CUST008', name: 'John Doe', phone: '+1234567890', orderCount: 35, totalSpend: '3,450.00', status: 'Active' },
    { id: '#CUST009', name: 'Jane Smith', phone: '+1234567890', orderCount: 30, totalSpend: '4,600.00', status: 'VIP' },
    { id: '#CUST010', name: 'Jane Smith', phone: '+1234567890', orderCount: 5, totalSpend: '250.00', status: 'Inactive' },
  ]);

  const [chartPeriod, setChartPeriod] = useState('Last 7 days');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Based on the image's visible rows

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      if (currentPage > 2 && currentPage < totalPages - 1) {
        pageNumbers.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pageNumbers.push(currentPage);
      }
      if (currentPage < totalPages - 2) {
        pageNumbers.push(currentPage + 1);
      }
      if (currentPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers.filter((value, index, self) => self.indexOf(value) === index);
  };

  return (
    <div className="min-h-screen p-4 font-inter" style={{ backgroundColor: '#F3F4F6' }}>
      <header className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: '#1F2937' }}>Customer Overview</h1>
      </header>
<div className="flex flex-col max-w-full lg:flex-row gap-4 pb-2" >
      {/* Top Customer Stats Cards */}
      <div className="w-full md:w-[400px] grid grid-cols-1  gap-4 mb-6">
        <DashboardCard
          title="Total Customers"
          value={customerStats.totalCustomers.value}
          change={customerStats.totalCustomers.change}
          isPositive={customerStats.totalCustomers.isPositive}
        />
        <DashboardCard
          title="Repeat Customer"
          value={customerStats.newCustomers.value}
          change={customerStats.newCustomers.change}
          isPositive={customerStats.newCustomers.isPositive}
        />
        <DashboardCard
          title="high Value Customers"
          value={customerStats.visitors.value}
          change={customerStats.visitors.change}
          isPositive={customerStats.visitors.isPositive}
        />
      </div>

      {/* Customer Overview Chart Section */}
      <div className="flex-1">
      <ReportChart />
      </div>
   
    </div>

      {/* Customer Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold" style={{ color: '#1F2937' }}>Customer List</h2>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#D1D5DB', outlineColor: '#3B82F6', '--tw-ring-color': '#3B82F6' }}
              // No search state management implemented for this table for brevity, but can be added
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

        <div className="w-full overflow-x-auto lg:overflow-x-visible">
        <div className="max-w-[250px]  lg:min-w-full ">
          <table className="min-w-full divide-y" style={{ borderColor: '#E5E7EB' }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                {['Customer ID', 'Name', 'Phone', 'Order Count', 'Total Spend', 'Status', 'Actions'].map(header => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: '#6B7280' }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#111827' }}>{customer.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{customer.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{customer.orderCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#111827' }}>${customer.totalSpend}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                      style={{
                        backgroundColor:
                          customer.status === 'Active' ? '#D1FAE5' : // bg-green-100
                          customer.status === 'VIP' ? '#DBEAFE' : // bg-blue-100 (using for VIP as per image for visual distinction)
                          customer.status === 'Inactive' ? '#FEE2E2' : '', // bg-red-100
                        color:
                          customer.status === 'Active' ? '#065F46' : // text-green-800
                          customer.status === 'VIP' ? '#1E40AF' : // text-blue-800
                          customer.status === 'Inactive' ? '#991B1B' : '' // text-red-800
                      }}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Edit Icon */}
                        <button className="text-gray-500 hover:text-gray-700" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z" />
                          </svg>
                        </button>
                        {/* Delete Icon */}
                        <button className="text-gray-500 hover:text-red-600" title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm6 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center" style={{ color: '#6B7280' }}>No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <span className="text-sm text-gray-700 mb-4 md:mb-0" style={{ color: '#4B5563' }}>
            Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, customers.length)}</span> of <span className="font-semibold">{customers.length}</span> entries
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

// Reusing Dashboard Card Component from previous version
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

export default CustomerDashboard;
