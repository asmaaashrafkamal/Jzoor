import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'; // Import icons from Feather Icons
import OrderDetailsModal from './OrderDetailsModal'; // Import the new modal component

const App = () => {
  const [activeTab, setActiveTab] = useState('All order (240)');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterArea, setFilterArea] = useState('');
  // New state for OrderDetailsModal
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const itemsPerPage = 8; // Number of items to display per page

  // Dummy data for archived deliveries
  const [allDeliveries, setAllDeliveries] = useState([]);

useEffect(() => {
  axios
    .get('http://localhost:8000/api/get_delivered_orders', {
      params: { delivery_person_id: 5 },
    })
    .then(res => {
      const transformed = res.data
        .filter(order => order.status === 'Delivered')
        .map(order => {
          const date = new Date(order.updated_at);
          const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;

          return {
            orderId: `#Order${order.id}`,
            customerName: order.user.full_name,
            date: formattedDate,
            deliveryTime: 'N/A',
            destination: order.user.address,
          };
        });

      // ✅ Moved this inside .then()
      setAllDeliveries(transformed);
    })
    .catch(err => console.error('Failed to fetch delivered orders', err));
}, []);
const totalCount = allDeliveries.length;
const byDateCount = allDeliveries.filter(d => filterDate && d.date === filterDate).length;
const byAreaCount = allDeliveries.filter(d => filterArea && d.destination.toLowerCase().includes(filterArea.toLowerCase())).length;

const tabs = [
  `All order (${totalCount})`,
  `By Date (${filterDate ? byDateCount : 0})`,
  `By Area (${filterArea ? byAreaCount : 0})`,
];
  // Filtered data based on search term, date, and area
  const filteredDeliveries = allDeliveries.filter(delivery => {
    const matchesSearch =
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = filterDate ? delivery.date === filterDate : true;
    const matchesArea = filterArea ? delivery.destination.toLowerCase().includes(filterArea.toLowerCase()) : true;

    return matchesSearch && matchesDate && matchesArea;
  });

  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDeliveries = filteredDeliveries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setFilterDate(''); // Reset date filter when changing tabs
    setFilterArea(''); // Reset area filter when changing tabs
    setCurrentPage(1); // Reset to first page
    if (tab === 'By Date') {
      setShowDateModal(true);
    } else if (tab === 'By Area') {
      setShowAreaModal(true);
    }
  };

  const handleDateFilterSubmit = () => {
    setShowDateModal(false);
    // Filtering is handled by filteredDeliveries
  };

  const handleAreaFilterSubmit = () => {
    setShowAreaModal(false);
    // Filtering is handled by filteredDeliveries
  };

  // Function to open the order details modal
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  // Function to close the order details modal
  const handleCloseOrderDetailsModal = () => {
    setShowOrderDetailsModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#F0F2F5' }}> {/* Light gray background */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#2D3748' }}>Archived Deliveries Lists</h1> {/* Dark gray text */}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: activeTab === tab ? '#065F46' : '#F7FAFC', // Green for active, very light gray for inactive
                  color: activeTab === tab ? '#FFFFFF' : '#4A5568', // White for active, gray for inactive
                }}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto md:min-w-[250px]">
            <input
              type="text"
              placeholder="Search in logistic history"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: '#E2E8F0', // Light gray border
                backgroundColor: '#F7FAFC', // Very light gray background
                color: '#2D3748', // Dark gray text
                outlineColor: '#065F46', // Green ring on focus
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <FiSearch size={18} style={{ color: '#A0AEC0' }} /> {/* React Icon: FiSearch */}
            </div>
          </div>
        </div>

        {/* Table of Deliveries */}
        <div className="w-full overflow-x-auto lg:overflow-x-visible" style={{ borderColor: '#E5E7EB', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          <div className="max-w-[250px] lg:min-w-full">
          <table className="min-w-full divide-y" style={{ borderColor: '#E5E7EB' }}> {/* Light gray divider */}
            <thead style={{ backgroundColor: '#F0FDF4' }}> {/* Very light gray header background */}
              <tr>
                {['Order ID','Customer Name' ,'Date','Delivery Time','Destination','Action'].map(header=>(
                  <th  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#065F46' }}
                >
                  {header}
                </th>
                ))}

              </tr>
            </thead>
            <tbody className="bg-white divide-y" style={{ borderColor: '#E2E8F0' }}> {/* Light gray divider */}
              {currentDeliveries.length > 0 ? (
                currentDeliveries.map((delivery, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#2D3748' }}>{delivery.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4A5568' }}>{delivery.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4A5568' }}>{delivery.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4A5568' }}>{delivery.deliveryTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4A5568' }}>{delivery.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        style={{ color: '#065F46' }}
                        onClick={() => handleViewDetails(delivery)} // Call handler on click
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No deliveries found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 rtl:space-x-reverse px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mb-2 sm:mb-0"
            style={{ color: '#4A5568', backgroundColor: 'transparent',  }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#EDF2F7'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FiChevronLeft size={16} /> {/* React Icon: FiChevronLeft */}
            <span>Previous</span>
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium ${
                  currentPage === page ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: currentPage === page ? '#065F46' : '#F7FAFC', // Green for active, very light gray for inactive
                  color: currentPage === page ? '#FFFFFF' : '#4A5568', // White for active, gray for inactive
                }}
              >
                {page}
              </button>
            ))}
            {/* Adding "..." and "Last Page" button if totalPages is large */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="w-9 h-9 flex items-center justify-center text-sm" style={{ color: '#4A5568' }}>...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium ${
                    currentPage === totalPages ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: currentPage === totalPages ? '#065F46' : '#F7FAFC',
                    color: currentPage === totalPages ? '#FFFFFF' : '#4A5568',
                  }}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 rtl:space-x-reverse px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2 sm:mt-0"
            style={{ color: '#4A5568', backgroundColor: 'transparent' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#EDF2F7'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span>Next</span>
            <FiChevronRight size={16} /> {/* React Icon: FiChevronRight */}
          </button>
        </div>
      </div>

      {/* Date Filter Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#2D3748' }}>Filter by Date</h2>
              <button onClick={() => setShowDateModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} /> {/* React Icon: FiX */}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Please enter the date in DD-MM-YYYY format.</p>
            <input
              type="text" // Using text for simpler input validation for DD-MM-YYYY
              placeholder="e.g., 01-01-2023"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 mb-4"
              style={{
                borderColor: '#E2E8F0',
                backgroundColor: '#F7FAFC',
                color: '#2D3748',
                outlineColor: '#065F46',
              }}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setFilterDate('');
                  setShowDateModal(false);
                }}
                className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100"
              >
                Clear
              </button>
              <button
                onClick={handleDateFilterSubmit}
                className="px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: '#065F46', }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#065F46'}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Area Filter Modal */}
      {showAreaModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#2D3748' }}>Filter by Area</h2>
              <button onClick={() => setShowAreaModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} /> {/* React Icon: FiX */}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Please enter the destination city or area.</p>
            <input
              type="text"
              placeholder="e.g., Gaza"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 mb-4"
              style={{
                borderColor: '#E2E8F0',
                backgroundColor: '#F7FAFC',
                color: '#2D3748',
                outlineColor: '#065F46',
              }}
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setFilterArea('');
                  setShowAreaModal(false);
                }}
                className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100"
              >
                Clear
              </button>
              <button
                onClick={handleAreaFilterSubmit}
                className="px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: '#065F46', }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#065F46'}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetailsModal && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseOrderDetailsModal}
        />
      )}
    </div>
  );
};

export default App;
