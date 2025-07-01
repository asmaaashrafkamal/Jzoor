import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js

const App = () => {
  // Placeholder data for demonstration
  const originalOrders = [
    {
      orderId: '00075',
      clientName: 'Yara Yazgi',
      avatar: 'https://placehold.co/40x40/B3E5FC/2196F3?text=YY',
      date: '10Oct2025',
      address: 'Ramallah, Al-Tireh St',
      assignedTime: '12:30 PM',
      status: 'Picked Up',
      progress: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered'],
      currentProgressIndex: 1,
    },
    {
      orderId: '00076',
      clientName: 'Nael Abd',
      avatar: 'https://placehold.co/40x40/FFCCBC/E64A19?text=NA',
      date: '10Oct2025',
      address: 'Gaza, Al-Rimail St',
      assignedTime: '10:30 PM',
      status: 'In Transit',
      progress: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered'],
      currentProgressIndex: 2,
    },
    {
      orderId: '00077',
      clientName: 'Yara Yazgi',
      avatar: 'https://placehold.co/40x40/B3E5FC/2196F3?text=YY',
      date: '10Oct2025',
      address: 'Ramallah, Al-Tireh St',
      assignedTime: '12:30 PM',
      status: 'In Transit',
      progress: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered'],
      currentProgressIndex: 2,
    },
    {
      orderId: '00078',
      clientName: 'Ahmed Ali',
      avatar: 'https://placehold.co/40x40/C8E6C9/4CAF50?text=AA',
      date: '11Oct2025',
      address: 'Nablus, Main St',
      assignedTime: '09:00 AM',
      status: 'Waiting Picked up',
      progress: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered'],
      currentProgressIndex: 0,
    },
    {
      orderId: '00079',
      clientName: 'Sara Omar',
      avatar: 'https://placehold.co/40x40/F8BBD0/E91E63?text=SO',
      date: '11Oct2025',
      address: 'Jenin, University Rd',
      assignedTime: '01:00 PM',
      status: 'Delivered',
      progress: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered'],
      currentProgressIndex: 3,
    },
    {
      orderId: '00080',
      clientName: 'Omar Khaled',
      avatar: 'https://placehold.co/40x40/D1C4E9/673AB7?text=OK',
      date: '12Oct2025',
      address: 'Hebron, Old City',
      assignedTime: '02:00 PM',
      status: 'Canceled', // Added a canceled status for testing
      progress: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered', 'Canceled'], // Adding canceled to progress for this one
      currentProgressIndex: 4, // Index for Canceled
    },
    {
      orderId: '00081',
      clientName: 'Layla Said',
      avatar: 'https://placehold.co/40x40/CFD8DC/607D8B?text=LS',
      date: '12Oct2025',
      address: 'Ramallah, An-Najah St',
      assignedTime: '03:00 PM',
      status: 'Waiting Picked up',
      progress: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered'],
      currentProgressIndex: 0,
    },
    {
      orderId: '00082',
      clientName: 'Khaled Nader',
      avatar: 'https://placehold.co/40x40/DCEDC8/8BC34A?text=KN',
      date: '13Oct2025',
      address: 'Gaza, Beach Rd',
      assignedTime: '09:30 AM',
      status: 'Picked Up',
      progress: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered'],
      currentProgressIndex: 1,
    },
    {
      orderId: '00083',
      clientName: 'Fatima Yousef',
      avatar: 'https://placehold.co/40x40/FFEBEE/F44336?text=FY',
      date: '13Oct2025',
      address: 'Bethlehem, Manger Sq',
      assignedTime: '11:45 AM',
      status: 'In Transit',
      progress: ['Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered'],
      currentProgressIndex: 2,
    },
  ];

  // Duplicate data to create more pages for demonstration
  const duplicatedOrders1 = originalOrders.map((o, index) => ({
    ...o,
    orderId: `DUP1_${o.orderId}`,
    clientName: `${o.clientName} (Dupe1)`,
    currentProgressIndex: o.currentProgressIndex, // Maintain original progress index
    status: o.status, // Maintain original status
  }));

  const duplicatedOrders2 = originalOrders.map((o, index) => ({
    ...o,
    orderId: `DUP2_${o.orderId}`,
    clientName: `${o.clientName} (Dupe2)`,
    currentProgressIndex: o.currentProgressIndex, // Maintain original progress index
    status: o.status, // Maintain original status
  }));

  const allOrdersData = [...originalOrders, ...duplicatedOrders1, ...duplicatedOrders2];

  const [recentOrders, setRecentOrders] = useState(allOrdersData);
  const [activeTab, setActiveTab] = useState('All orders'); // Changed from 'All order' to 'All orders' for consistency
  const [searchTerm, setSearchTerm] = useState(''); // Global search term

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3; // Display 3 orders per page

  // Calculate filtered orders based on activeTab and searchTerm
  const filteredOrders = useMemo(() => {
    let currentFiltered = recentOrders.filter(order => {
      // Global search filter
      const matchesSearch =
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Tab filter
    switch (activeTab) {
      case 'All orders':
        return currentFiltered;
      case 'Picked Up':
      case 'In Transit':
      case 'Delivered':
      case 'Canceled':
      case 'Waiting Picked up':
        return currentFiltered.filter(order => order.status === activeTab);
      default:
        return currentFiltered;
    }
  }, [recentOrders, activeTab, searchTerm]);

  // Calculate total counts for tabs dynamically
  const totalCounts = useMemo(() => {
    const counts = {
      'All orders': recentOrders.length,
      'Picked Up': recentOrders.filter(order => order.status === 'Picked Up').length,
      'In Transit': recentOrders.filter(order => order.status === 'In Transit').length,
      'Canceled': recentOrders.filter(order => order.status === 'Canceled').length,
      'Waiting Picked up': recentOrders.filter(order => order.status === 'Waiting Picked up').length,
      'Delivered': recentOrders.filter(order => order.status === 'Delivered').length, // Added Delivered count
    };
    return counts;
  }, [recentOrders]);


  // Calculate orders for the current page from filteredOrders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Calculate total pages for filtered orders
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const chartRef = useRef(null); // Ref for the chart canvas
  const chartInstance = useRef(null); // Ref for the chart instance

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy existing chart instance before creating a new one
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [
            {
              label: 'Deliveries',
              data: [15, 20, 30, 54, 35, 25, 40], // Dummy data, Thursday is 54 to match image
              borderColor: '#34D399', // Green color (equivalent to Tailwind green-500/600 sometimes)
              backgroundColor: 'rgba(52, 211, 153, 0.2)', // Light green fill
              tension: 0.4, // Smooth curve
              fill: true,
              pointRadius: 0, // Hide points by default, could be increased for small circles if desired
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false, // Hide legend
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false, // Hide x-axis grid lines
              },
              ticks: {
                color: '#6B7280', // Gray text for labels (equivalent to Tailwind gray-500)
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#E5E7EB', // Light gray grid lines (equivalent to Tailwind gray-200)
                borderDash: [5, 5], // Dashed grid lines
              },
              ticks: {
                callback: function (value) {
                  return value + 'k'; // Add 'k' to y-axis labels
                },
                color: '#6B7280', // Gray text (equivalent to Tailwind gray-500)
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Cleanup chart on component unmount
      }
    };
  }, []);

  // Function to handle clicking on a progress step
  const handleProgressStepClick = useCallback((orderId, newStatus) => {
    setRecentOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.orderId === orderId) {
          const newProgressIndex = order.progress.indexOf(newStatus);
          // Special handling for Canceled status
          if (newStatus === 'Canceled') {
            return {
              ...order,
              status: newStatus,
              currentProgressIndex: newProgressIndex,
            };
          } else {
            // For non-canceled statuses, ensure progress only moves forward or to a specific previous step
            // This prevents "un-canceling" by clicking an early step if the order was genuinely canceled
            // If the current order is Canceled and a non-Canceled step is clicked, it's a valid change.
            const currentCanceledIndex = order.progress.indexOf('Canceled');
            if (order.status === 'Canceled' && newProgressIndex < currentCanceledIndex) {
                 // If was canceled and now a non-canceled previous step is clicked, "uncancel"
                return {
                    ...order,
                    status: newStatus,
                    currentProgressIndex: newProgressIndex,
                };
            } else if (newProgressIndex >= order.currentProgressIndex) {
                // Otherwise, allow normal forward progression or setting to an earlier step if already passed.
                return {
                    ...order,
                    status: newStatus,
                    currentProgressIndex: newProgressIndex,
                };
            }
            // If trying to go backward to a step before currentProgressIndex for a non-canceled order,
            // or if the order is not canceled and the newStatus is after Canceled in array but Canceled is not current, do nothing.
            return order;
          }
        }
        return order;
      })
    );
  }, []);


  // Helper function to render Lucide-like icons using inline SVGs
  const Icon = ({ name, size = 20, color = 'currentColor', className = '' }) => {
    switch (name) {
      case 'Truck':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
          >
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
            <path d="M15 18H9"></path>
            <path d="M19 18h2a1 2 0 0 0 1-1v-3.82a1 1 0 0 0-.84-1l-3.32-1.66A2 2 0 0 0 15 8.16V6a2 2 0 0 0-2-2h-3"></path>
            <circle cx="7" cy="18" r="2"></circle>
            <circle cx="17" cy="18" r="2"></circle>
          </svg>
        );
      case 'Package':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
          >
            <path d="M12.89 1.45L19.22 4c.82.32 1.25 1.22.9 2.05l-4.4 10.59a1 1 0 0 1-.92.65H8.38a1 1 0 0 1-.92-.65L3.88 6.05c-.34-.83.08-1.73.9-2.05l6.33-2.55a2 2 0 0 1 1.78 0z"></path>
            <path d="M2.89 15.5L7 17.5l4.33 2.16c.82.32 1.78.32 2.6 0L17 17.5l4.11-2"></path>
          </svg>
        );
      case 'Clock':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        );
      case 'MapPin':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        );
      case 'Search':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        );
      case 'Phone':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        );
      case 'LocateFixed': // Using this for "Track" as it represents location
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
          >
            <line x1="2" x2="5" y1="12" y2="12"></line>
            <line x1="19" x2="22" y1="12" y2="12"></line>
            <line x1="12" x2="12" y1="2" y2="5"></line>
            <line x1="12" x2="12" y1="19" y2="22"></line>
            <circle cx="12" cy="12" r="7"></circle>
          </svg>
        );
      case 'MoreVertical':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        );
      case 'ChevronLeft':
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"></polyline></svg>
        );
      case 'ChevronRight':
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>
        );
      case 'Filter': // Added Filter icon SVG
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        );
      case 'Edit': // Added Edit icon SVG
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        );
      case 'Eye': // Added Eye icon SVG
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        );
      case 'Check': // Added Check icon SVG for timeline
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        );
      case 'X': // Added X icon SVG for canceled status
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        );
      default:
        return null;
    }
  };

  const SummaryCard = ({ iconName, value, label }) => ( // Changed iconName to IconComponent
    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm w-full">
      <div className="p-3 rounded-full" style={{ backgroundColor: '#D1FAE5' }}> {/* bg-green-100 */}
        <Icon name={iconName} size={24} style={{ color: '#059669' }} /> {/* text-green-600 */}
      </div>
      <div>
        <p className="text-xl font-semibold" style={{ color: '#1F2937' }}>{value}</p> {/* text-gray-800 */}
        <p className="text-sm" style={{ color: '#6B7280' }}>{label}</p> {/* text-gray-500 */}
      </div>
    </div>
  );

  const OrderItem = ({ order, onStatusClick }) => { // Added onStatusClick prop
    const isCallEnabled = useMemo(() => {
        // Enable Call button if status is Waiting Picked up, Picked Up, or In Transit
        return ['Waiting Picked up', 'Picked Up', 'In Transit'].includes(order.status);
    }, [order.status]);

    const isTrackEnabled = useMemo(() => {
        // Enable Track button if status is Picked Up or In Transit
        return ['Picked Up', 'In Transit'].includes(order.status);
    }, [order.status]);

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src={order.avatar}
              alt={order.clientName}
              className="w-10 h-10 rounded-full border"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/B3E5FC/2196F3?text=YY'; }} // Fallback for avatar
              style={{ borderColor: '#E5E7EB' }} // border-gray-200
            />
            <div>
              <p className="font-medium" style={{ color: '#1F2937' }}>{order.clientName}</p> {/* text-gray-800 */}
              <p className="text-sm" style={{ color: '#6B7280' }}>Order#{order.orderId}</p> {/* Changed order.id to order.orderId */}
            </div>
          </div>
          <div className="cursor-pointer" style={{ color: '#9CA3AF' }}> {/* text-gray-400 */}
            <Icon name="MoreVertical" size={20} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm mb-4" style={{ color: '#4B5563' }}> {/* text-gray-600 */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2 md:mb-0">
            <Icon name="MapPin" size={16} style={{ color: '#9CA3AF' }} /> {/* Using FaMapMarkerAlt */}
            <span>{order.address}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="Clock" size={16} style={{ color: '#9CA3AF' }} /> {/* Using FaClock */}
            <span>Assigned: {order.assignedTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <span
            className={`font-medium px-2 py-1 rounded-full text-xs`}
            style={{
              backgroundColor:
                order.status === 'Picked Up' ? '#FFF7ED' : // bg-orange-100 (light orange)
                order.status === 'In Transit' ? '#FFFBEB' : // bg-yellow-100 (light yellow)
                order.status === 'Delivered' ? '#D1FAE5' : // bg-green-100 (light green)
                order.status === 'Waiting Picked up' ? '#DBEAFE' : // bg-blue-100 (light blue)
                '#FEE2E2', // default for other statuses like Canceled (red-100)
              color:
                order.status === 'Picked Up' ? '#EA580C' : // text-orange-600
                order.status === 'In Transit' ? '#D97706' : // text-yellow-600
                order.status === 'Delivered' ? '#059669' : // text-green-600
                order.status === 'Waiting Picked up' ? '#2563EB' : // text-blue-600
                '#DC2626', // default for other statuses like Canceled (red-600)
            }}
          >
            {order.status}
          </span>
          <div className="flex space-x-2">
            <button
              className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-md transition-colors ${!isCallEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-100'}`}
              style={{ backgroundColor: '#F0FDF4', color: '#065F46' }}
              disabled={!isCallEnabled}
            >
              <Icon name="Phone" size={16} />
              <span>Call</span>
            </button>
            <button
              className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-md transition-colors ${!isTrackEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-100'}`}
              style={{ backgroundColor: '#F0FDF4', color: '#065F46' }}
              disabled={!isTrackEnabled}
            >
              <Icon name="LocateFixed" size={16} />
              <span>Track</span>
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="flex justify-between items-center relative py-2 mt-4">
          {order.progress.map((step, index) => {
            // Determine if the current order's status is 'Canceled'
            const isCanceledOrder = order.status === 'Canceled';
            // Determine if the current step in the progress array is 'Canceled'
            const isCurrentStepCanceled = step === 'Canceled';

            // Logic for active styling (green circles/lines) for non-canceled orders
            const isActiveStepInNormalFlow = index <= order.currentProgressIndex && !isCanceledOrder;

            // Define colors based on conditions
            let circleBgColor = '#FFFFFF'; // Default inactive circle background
            let circleBorderColor = '#D1D5DB'; // Default inactive circle border
            let textColor = '#6B7280'; // Default inactive text color
            let fontWeight = 'normal'; // Default text weight
            let lineColor = '#D1D5DB'; // Default inactive line color

            if (isCanceledOrder && isCurrentStepCanceled) {
                // If the order is Canceled and this is the 'Canceled' step
                circleBgColor = '#DC2626'; // Red
                circleBorderColor = '#DC2626'; // Red
                textColor = '#1F2937';
                fontWeight = '500';
            } else if (isActiveStepInNormalFlow) {
                // If it's an active step in a non-canceled order
                circleBgColor = '#22C55E'; // Green
                circleBorderColor = '#22C55E';
                textColor = '#1F2937';
                fontWeight = '500';
            }

            // Line color logic
            if (index < order.progress.length - 1) { // Only for lines between steps
              // Check if the current segment (from 'step' to 'nextStep') should be active
              const nextStep = order.progress[index + 1];
              const nextStepIsCanceled = nextStep === 'Canceled';

              if (isCanceledOrder && (isCurrentStepCanceled || (order.currentProgressIndex > index && nextStepIsCanceled))) {
                lineColor = '#DC2626'; // Red line if current order is canceled and this line leads to or is part of canceled path
              } else if (index < order.currentProgressIndex && !isCanceledOrder) {
                lineColor = '#22C55E'; // Green for active lines in normal flow
              }
            }


            return (
              <React.Fragment key={step}>
                <div
                    className="flex flex-col items-center flex-1 min-w-0 cursor-pointer" // Added cursor-pointer
                    // Removed whitespace-nowrap here to allow text to wrap
                    onClick={() => onStatusClick(order.orderId, step)} // Added onClick handler
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`}
                    style={{
                      backgroundColor: circleBgColor,
                      borderColor: circleBorderColor,
                    }}
                  >
                    {isCurrentStepCanceled && isCanceledOrder ? (
                        <Icon name="X" size={12} color="white" /> // 'X' for Canceled
                    ) : isActiveStepInNormalFlow ? (
                        <Icon name="Check" size={12} /> // Check for active non-canceled steps
                    ) : null}
                  </div>
                  <p
                    className={`mt-2 text-xs text-center overflow-hidden text-ellipsis`} // Removed whitespace-nowrap
                    style={{
                      color: textColor,
                      fontWeight: fontWeight,
                    }}
                  >
                    {step.replace(' ', '\n')} {/* Break long status names for better fit */}
                  </p>
                </div>
                {index < order.progress.length - 1 && (
                  <div
                    className={`flex-1 h-0.5`}
                    style={{
                      backgroundColor: lineColor,
                    }}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // Pagination page numbers rendering function
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
      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers.filter((value, index, self) => self.indexOf(value) === index);
  };


  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#F3F4F6', color: '#1F2937' }}> {/* bg-gray-100 text-gray-900 */}
      {/* Header - Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard iconName="Truck" value="25" label="Active Orders" />
        <SummaryCard iconName="Package" value="10" label="Delivered Today" />
        <SummaryCard iconName="Clock" value="30min" label="Avg. Delivery Time" />
      </div>

      {/* Next Delivery */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4 sm:mb-0">
          <div className="p-3 rounded-full" style={{ backgroundColor: '#FEE2E2' }}> {/* bg-red-100 */}
            <Icon name="MapPin" size={24} style={{ color: '#DC2626' }} />
          </div>
          <div>
            <p className="text-lg font-semibold" style={{ color: '#1F2937' }}>10:30 AM - Al-Balou', Ramallah</p> {/* text-gray-800 */}
            <p className="text-sm" style={{ color: '#6B7280' }}>Next Delivery</p> {/* text-gray-500 */}
          </div>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-12 h-12 flex flex-col items-center justify-center rounded-lg font-bold text-lg relative"
               style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}> {/* bg-blue-100 text-blue-700 */}
            <span className="text-xs absolute top-1" style={{ color: '#6B7280' }}>July</span> {/* text-gray-500 */}
            <span className="mt-3">17</span>
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>remaining orders</p> {/* text-gray-500 */}
          <p className="text-lg font-semibold" style={{ color: '#1F2937' }}>5</p> {/* text-gray-800 */}
        </div>
      </div>

      {/* Order List Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-4">Order List</h2>

        {/* Global Search Bar */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search by Order ID, Client Name, or Address"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#D1D5DB', color: '#1F2937', outlineColor: '#22C55E' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3 rtl:pr-3 pointer-events-none">
            <Icon name="Search" size={18} style={{ color: '#9CA3AF' }} />
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            {['All orders', 'Waiting Picked up', 'Picked Up', 'In Transit', 'Delivered', 'Canceled'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors`}
                style={{
                  backgroundColor: activeTab === tab ? '#22C55E' : '#F3F4F6', // bg-green-500 or bg-gray-100
                  color: activeTab === tab ? '#FFFFFF' : '#374151', // text-white or text-gray-700
                  boxShadow: activeTab === tab ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
                }}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1); // Reset to first page on tab change
                }}
              >
                {tab} ({totalCounts[tab] || 0}) {/* Dynamic counts */}
              </button>
            ))}
          </div>
          {/* Search bar removed from here, now global */}
        </div>

        {/* Order Items */}
        <div>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => ( // Display orders for the current page
              <OrderItem key={order.orderId} order={order} onStatusClick={handleProgressStepClick} />
            ))
          ) : (
            <p className="text-center text-gray-600">No orders found matching your criteria.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}> {/* border-gray-200 */}
          <button
            className="flex items-center space-x-1 rtl:space-x-reverse hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed mb-2 sm:mb-0"
            style={{ color: '#4B5563' }}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <Icon name="ChevronLeft" size={20} />
            <span>Previous</span>
          </button>
          <div className="flex space-x-2">
            {renderPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium
                  ${typeof page !== 'number' ? 'cursor-default border-transparent bg-transparent hover:bg-transparent' : ''}
                `}
                style={{
                  backgroundColor: currentPage === page ? '#22C55E' : '#F3F4F6', // Active page styling
                  color: currentPage === page ? '#FFFFFF' : '#374151',
                }}
                disabled={typeof page !== 'number'}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="flex items-center space-x-1 rtl:space-x-reverse hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed mt-2 sm:mt-0"
            style={{ color: '#4B5563' }}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <span>Next</span>
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
