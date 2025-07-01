import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js
import {
  HiOutlineSearch,     // For the search icon
  HiOutlinePencil,      // For the edit/pencil icon
  HiOutlineTrash,       // For the delete/trash icon
  HiOutlineDotsVertical, // For the three dots in the card
  HiX // For closing modals
} from 'react-icons/hi'; // Importing Heroicons
import Title from './components/Title';

// Reusable Dashboard Card Component
const DashboardCard = ({ title, value, change, isPositive }) => (
  <div className="p-6 rounded-lg shadow-md flex flex-col justify-between" style={{ backgroundColor: '#FFFFFF' }}> {/* bg-card-bg */}
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium" style={{ color: '#4B5563' }}>{title}</h3> {/* text-body-text */}
      {/* <HiOutlineDotsVertical
        className="cursor-pointer"
        style={{ color: '#9CA3AF' }} // text-icon-light
        size={20}
      /> */}
      
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-semibold" style={{ color: '#1F2937' }}>{value}</span> {/* text-header-text */}
      <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`} // Using direct Tailwind classes for colors
        style={{ color: isPositive ? '#10B981' : '#EF4444' }} // text-chart-positive / text-chart-negative
      >
        {isPositive ? '▲' : '▼'} {change}
      </span>
    </div>
    <p className="text-xs mt-2" style={{ color: '#4B5563' }}>Last 7 days</p> {/* text-body-text */}
  </div>
);

// Placeholder for ReportChart component (as it was an external import)
const ReportChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'New Customers',
              data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 75, 82],
              borderColor: '#2563EB', // A shade of blue
              backgroundColor: 'rgba(37, 99, 235, 0.1)', // Light blue fill
              tension: 0.4,
              fill: true,
              pointRadius: 3,
              pointBackgroundColor: '#2563EB',
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#6B7280',
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#E5E7EB',
                borderDash: [5, 5],
              },
              ticks: {
                callback: function (value) {
                  return value;
                },
                color: '#6B7280',
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#1F2937' }}>Customers Growth</h2>
      <div className="relative h-64 md:h-80 flex-grow">
        <canvas ref={chartRef} className="w-full h-full"></canvas>
      </div>
    </div>
  );
};


// Edit Customer Modal Component
const EditCustomerModal = ({ customer, onSave, onClose }) => {
  const [editedCustomer, setEditedCustomer] = useState(customer);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedCustomer);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        style={{ animation: 'fadeInScale 0.3s ease-out' }}>
        <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: '#E5E7EB' }}>
          <h2 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Edit Customer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <HiX className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedCustomer.name}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={editedCustomer.phone}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="orderCount" className="block text-sm font-medium text-gray-700">Order Count</label>
              <input
                type="number"
                id="orderCount"
                name="orderCount"
                value={editedCustomer.orderCount}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="totalSpend" className="block text-sm font-medium text-gray-700">Total Spend</label>
              <input
                type="text"
                id="totalSpend"
                name="totalSpend"
                value={editedCustomer.totalSpend}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                value={editedCustomer.status}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="Active">Active</option>
                <option value="VIP">VIP</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </form>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-sm font-medium"
              style={{ borderColor: '#D1D5DB', color: '#4B5563', backgroundColor: '#FFFFFF' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md text-white text-sm font-medium"
              style={{ backgroundColor: '#22C55E' }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ customerName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100"
        style={{ animation: 'fadeInScale 0.3s ease-out' }}>
        <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: '#E5E7EB' }}>
          <h2 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Confirm Deletion</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <HiX className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">Are you sure you want to delete customer <span className="font-semibold">{customerName}</span>? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border text-sm font-medium"
              style={{ borderColor: '#D1D5DB', color: '#4B5563', backgroundColor: '#FFFFFF' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md text-white text-sm font-medium"
              style={{ backgroundColor: '#DC2626' }} // Red for delete
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


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
    { id: '#CUST002', name: 'Jane Smith', phone: '+1234567891', orderCount: 5, totalSpend: '250.00', status: 'VIP' },
    { id: '#CUST003', name: 'Emily Davis', phone: '+1234567892', orderCount: 30, totalSpend: '4,600.00', status: 'Active' },
    { id: '#CUST004', name: 'Michael Brown', phone: '+1234567893', orderCount: 10, totalSpend: '1,200.00', status: 'Inactive' },
    { id: '#CUST005', name: 'Sarah Wilson', phone: '+1234567894', orderCount: 12, totalSpend: '900.00', status: 'Active' },
    { id: '#CUST006', name: 'David Lee', phone: '+1234567895', orderCount: 8, totalSpend: '2,100.00', status: 'VIP' },
    { id: '#CUST007', name: 'Laura Garcia', phone: '+1234567896', orderCount: 18, totalSpend: '1,200.00', status: 'Inactive' },
    { id: '#CUST008', name: 'James Martinez', phone: '+1234567897', orderCount: 7, totalSpend: '500.00', status: 'Active' },
    { id: '#CUST009', name: 'Olivia Rodriguez', phone: '+1234567898', orderCount: 22, totalSpend: '2,500.00', status: 'VIP' },
    { id: '#CUST010', name: 'William Hernandez', phone: '+1234567899', orderCount: 3, totalSpend: '700.00', status: 'Inactive' },
    { id: '#CUST011', name: 'Sophia Lopez', phone: '+1234567800', orderCount: 15, totalSpend: '1,900.00', status: 'Active' },
    { id: '#CUST012', name: 'Daniel Gonzalez', phone: '+1234567801', orderCount: 28, totalSpend: '3,200.00', status: 'VIP' },
    { id: '#CUST013', name: 'Ava Perez', phone: '+1234567802', orderCount: 6, totalSpend: '1,000.00', status: 'Inactive' },
    { id: '#CUST014', name: 'Matthew Sanchez', phone: '+1234567803', orderCount: 19, totalSpend: '2,300.00', status: 'Active' },
    { id: '#CUST015', name: 'Isabella Rivera', phone: '+1234567804', orderCount: 9, totalSpend: '1,100.00', status: 'VIP' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Based on the image's visible rows

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filtered customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxPagesToShow) {
        if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
            endPage = maxPagesToShow;
        } else if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
            startPage = totalPages - maxPagesToShow + 1;
        } else {
            startPage = currentPage - Math.floor(maxPagesToShow / 2);
            endPage = currentPage + Math.floor(maxPagesToShow / 2) - 1;
        }
    }

    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
            pageNumbers.push('...');
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Handlers for Modals
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleSaveCustomer = (updatedCustomer) => {
    setCustomers(customers.map(cust =>
      cust.id === updatedCustomer.id ? updatedCustomer : cust
    ));
    setShowEditModal(false);
    setSelectedCustomer(null);
  };

  const handleConfirmDelete = () => {
    setCustomers(customers.filter(cust => cust.id !== selectedCustomer.id));
    setShowDeleteModal(false);
    setSelectedCustomer(null);
  };


  return (
    <div className="min-h-screen p-6 font-inter" style={{ backgroundColor: '#F3F4F6' }}> {/* bg-dashboard-bg */}
      <header className="mb-4">
        <Title title="Customer Overview" />
        {/* <h1 className="text-3xl font-bold" style={{ color: '#1F2937' }}>Customer Overview</h1> text-header-text */}
      </header>
      <div className="flex flex-col max-w-full lg:flex-row gap-4 pb-2" >
        {/* Top Customer Stats Cards */}
        <div className="w-full md:w-[400px] grid grid-cols-1 gap-4 mb-6">
          <DashboardCard
            title="Total Customers"
            value={customerStats.totalCustomers.value}
            change={customerStats.totalCustomers.change}
            isPositive={customerStats.totalCustomers.isPositive}
          />
          <DashboardCard
            title="New Customers"
            value={customerStats.newCustomers.value}
            change={customerStats.newCustomers.change}
            isPositive={customerStats.newCustomers.isPositive}
          />
          <DashboardCard
            title="Visitors"
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
      <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#FFFFFF' }}> {/* bg-card-bg */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold" style={{ color: '#1F2937' }}>Customer List</h2> {/* text-header-text */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#E5E7EB', outlineColor: '#2563EB', color: '#1F2937' }} // border-light-border, focus:ring-primary-blue, text-header-text
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <HiOutlineSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: '#9CA3AF' }} // text-icon-light
              size={20}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto lg:overflow-x-visible">
          <div className="min-w-[250px] lg:min-w-full"> {/* Increased min-width for small screens */}
            <table className="min-w-full divide-y" style={{ borderColor: '#E5E7EB' }}> {/* divide-light-border */}
              <thead style={{ backgroundColor: '#F0FDF4' }}> {/* bg-customer-table-header-bg */}
                <tr>
                  {['Customer ID', 'Name', 'Phone', 'Order Count', 'Total Spend', 'Status', 'Actions'].map(header => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#065F46' }} // text-customer-table-header-text
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}> {/* divide-light-border bg-card-bg */}
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#1F2937' }}>{customer.id}</td> {/* text-header-text */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4B5563' }}>{customer.name}</td> {/* text-body-text */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4B5563' }}>{customer.phone}</td> {/* text-body-text */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4B5563' }}>{customer.orderCount}</td> {/* text-body-text */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#1F2937' }}>${customer.totalSpend}</td> {/* text-header-text */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                          style={{
                            backgroundColor:
                              customer.status === 'Active' ? '#D1FAE5' : // bg-status-active-bg
                              customer.status === 'VIP' ? '#DBEAFE' : // bg-status-vip-bg
                              customer.status === 'Inactive' ? '#FEE2E2' : '', // bg-status-inactive-bg
                            color:
                              customer.status === 'Active' ? '#065F46' : // text-status-active-text
                              customer.status === 'VIP' ? '#1E40AF' : // text-status-vip-text
                              customer.status === 'Inactive' ? '#991B1B' : '' // text-status-inactive-text
                          }}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-gray-500 hover:text-amber-600" // Hover to amber color
                            title="Edit"
                            onClick={() => handleEditClick(customer)}
                          >
                            <HiOutlinePencil className="h-5 w-5" />
                          </button>
                          <button
                            className="text-gray-500 hover:text-red-600" // Hover to red color
                            title="Delete"
                            onClick={() => handleDeleteClick(customer)}
                          >
                            <HiOutlineTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center" style={{ color: '#4B5563' }}>No customers found.</td> {/* text-body-text */}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <span className="text-sm" style={{ color: '#4B5563' }}> {/* text-body-text */}
            Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, filteredCustomers.length)}</span> of <span className="font-semibold">{filteredCustomers.length}</span> entries
          </span>
          <nav className="flex flex-col md:flex-row justify-between items-center items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#4B5563', backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' }} // text-body-text bg-card-bg border-light-border
            >
              &larr; Previous
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
                    backgroundColor: currentPage === page ? '#22C55E' : '#F3F4F6', // bg-primary-blue for active, bg-gray-100 for inactive
                    color: currentPage === page ? '#FFFFFF' : '#374151', // text-white for active, text-gray-700 for inactive
                    boxShadow: currentPage === page ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
                    borderColor: currentPage === page ? '#22C55E' : '#D1D5DB'
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
              style={{ color: '#4B5563', backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' }} // text-body-text bg-card-bg border-light-border
            >
              Next &rarr;
            </button>
          </nav>
        </div>
      </div>

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          onSave={handleSaveCustomer}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCustomer && (
        <DeleteConfirmationModal
          customerName={selectedCustomer.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
