import React, { useState } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('All order (240)');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of items to display per page

  // Dummy data for archived deliveries
  const allDeliveries = [
    {
      orderId: '#Order001',
      customerName: 'John Doe',
      date: '01-01-2023',
      deliveryTime: '29 min',
      destination: 'Gaza',
    },
    {
      orderId: '#Order002',
      customerName: 'Jane Doe',
      date: '01-01-2023',
      deliveryTime: '42 min',
      destination: 'Rafah',
    },
    {
      orderId: '#Order003',
      customerName: 'John Doe',
      date: '01-01-2023',
      deliveryTime: '28 min',
      destination: 'Ramallah',
    },
    {
      orderId: '#Order004',
      customerName: 'John Doe',
      date: '01-01-2023',
      deliveryTime: '29 min',
      destination: 'Ashqelon',
    },
    {
      orderId: '#Order005',
      customerName: 'Jane Smith',
      date: '01-01-2023',
      deliveryTime: '29 min',
      destination: 'AlQuds',
    },
    {
      orderId: '#Order006',
      customerName: 'Emily Davis',
      date: '01-01-2023',
      deliveryTime: '29 min',
      destination: 'Yafa',
    },
    {
      orderId: '#Order007',
      customerName: 'Jane Smith',
      date: '01-01-2023',
      deliveryTime: '29 min',
      destination: 'Jabalya',
    },
    {
      orderId: '#Order008',
      customerName: 'John Doe',
      date: '01-01-2023',
      deliveryTime: '29 min',
      destination: 'Gaza',
    },
    {
      orderId: '#Order009',
      customerName: 'Emily Davis',
      date: '01-01-2023',
      deliveryTime: '29 min',
      destination: 'AlMaghazi',
    },
    {
      orderId: '#Order010',
      customerName: 'Jane Smith',
      date: '01-01-2023',
      deliveryTime: '29 min',
      destination: 'Rafah',
    },
    // Duplicate data to simulate more entries for pagination
    ...Array(15).fill(null).map((_, i) => ({
      orderId: `#Order${11 + i}`,
      customerName: `Customer ${11 + i}`,
      date: '01-01-2023',
      deliveryTime: `${30 + i} min`,
      destination: `City ${Math.floor(i / 3) + 1}`,
    })),
  ];

  // Helper function for Lucide-like icons using inline SVGs
  const Icon = ({ name, size = 20, color = 'currentColor', className = '' }) => {
    switch (name) {
      case 'Search':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        );
      case 'ChevronLeft':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        );
      case 'ChevronRight':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        );
      default:
        return null;
    }
  };

  // Filtered and paginated data
  const filteredDeliveries = allDeliveries.filter(delivery =>
    delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDeliveries = filteredDeliveries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#F0F2F5' }}> {/* Light gray background */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#2D3748' }}>Archived Deliveries Lists</h1> {/* Dark gray text */}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-wrap gap-2">
            {['All order (240)', 'By Date', 'By Area', 'By Delivery Time'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: activeTab === tab ? '#065F46' : '#F7FAFC', // Blue for active, very light gray for inactive
                  color: activeTab === tab ? '#FFFFFF' : '#4A5568', // White for active, gray for inactive
                }}
                onClick={() => setActiveTab(tab)}
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
                outlineColor: '#065F46', // Blue ring on focus
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Icon name="Search" size={18} style={{ color: '#A0AEC0' }} /> {/* Gray icon */}
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
                  <th  key={header}
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
              {currentDeliveries.map((delivery, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#2D3748' }}>{delivery.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4A5568' }}>{delivery.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4A5568' }}>{delivery.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4A5568' }}>{delivery.deliveryTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4A5568' }}>{delivery.destination}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800" style={{ color: '#065F46' }}>View Details</button>
                  </td>
                </tr>
              ))}
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
            style={{ color: '#4A5568', backgroundColor: 'transparent',  hover: {backgroundColor: '#EDF2F7'} }} // Gray text, transparent bg, light gray on hover
          >
            <Icon name="ChevronLeft" size={16} />
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
                  backgroundColor: currentPage === page ? '#065F46' : '#F7FAFC', // Blue for active, very light gray for inactive
                  color: currentPage === page ? '#FFFFFF' : '#4A5568', // White for active, gray for inactive
                }}
              >
                {page}
              </button>
            ))}
            {/* Adding "..." and "34" button if totalPages is large, similar to the image */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="w-9 h-9 flex items-center justify-center text-sm" style={{ color: '#4A5568' }}>...</span>
            )}
            {totalPages > 5 && currentPage < totalPages - 2 && (
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
            )}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 rtl:space-x-reverse px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2 sm:mt-0"
            style={{ color: '#4A5568', backgroundColor: 'transparent', hover: {backgroundColor: '#EDF2F7'} }} // Gray text, transparent bg, light gray on hover
          >
            <span>Next</span>
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
