import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Helper component for displaying Title (re-defined here for self-containment)
const Title = ({ title }) => <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>;

// Inline SVG Icons (replacing react-icons/hi for compilation stability)
const IconSearch = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 4.71c-.3.04-.6.06-.9.06a8.25 8.25 0 01-14.59-4.71zM19.5 19.5l-3.75-3.75" clipRule="evenodd" />
  </svg>
);

const IconEye = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path d="M12 4.5c-6.627 0-11 7.5-11 7.5s4.373 7.5 11 7.5 11-7.5 11-7.5-4.373-7.5-11-7.5zM12 17a4.5 4.5 0 110-9 4.5 4.5 0 010 9zM12 15a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
  </svg>
);

const IconPencil = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path d="M17.25 6.75L18 7.5l1.75-1.75-1.75-1.75L17.25 6.75zM12 21H3a1 1 0 01-1-1v-9a1 1 0 01.293-.707l12-12a1 1 0 011.414 0l8 8a1 1 0 010 1.414l-12 12A1 1 0 0112 21zM5 18h6.5l8-8-6.5-6.5-8 8V18z" />
  </svg>
);

const IconTrash = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path d="M5 21V8h14v13a1 1 0 01-1 1H6a1 1 0 01-1-1zM10 10v7a1 1 0 002 0v-7a1 1 0 00-2 0zM14 10v7a1 1 0 002 0v-7a1 1 0 00-2 0zM4 6V5a1 1 0 011-1h4V3a1 1 0 011-1h4a1 1 0 011 1v1h4a1 1 0 011 1v1H4z" />
  </svg>
);

const IconDotsVertical = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
  </svg>
);

const IconChevronLeft = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
  </svg>
);

const IconChevronRight = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
  </svg>
);

// Dashboard Card Component
const DashboardCard = ({ title, value, change, isPositive }) => (
  <div className="p-6 rounded-lg shadow-md flex flex-col justify-between bg-white">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <IconDotsVertical
        className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
        size={20}
        title="More options"
      />
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-semibold text-gray-900">{value}</span>
      <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '▲' : '▼'} {change}
      </span>
    </div>
    {/* <p className="text-xs mt-2 text-gray-500">Last 7 days</p> */}
  </div>
);

// Delivery Modal Component
const DeliveryModal = ({ isOpen, onClose, delivery, mode, onSave, onDeleteConfirm }) => {
  const [name, setName] = useState(delivery?.name || '');
  const [phone, setPhone] = useState(delivery?.phone || '');
  const [activeOrder, setActiveOrder] = useState(delivery?.activeOrder || '');
  const [completed, setCompleted] = useState(delivery?.completed || '');
  const [status, setStatus] = useState(delivery?.status || '');

  useEffect(() => {
    if (delivery) {
      setName(delivery.name);
      setPhone(delivery.phone);
      setActiveOrder(delivery.activeOrder);
      setCompleted(delivery.completed);
      setStatus(delivery.status);
    }
  }, [delivery]);

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isDeleteConfirmMode = mode === 'deleteConfirm';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      onSave({
        ...delivery,
        name,
        phone,
        activeOrder: parseInt(activeOrder, 10),
        completed: parseInt(completed, 10),
        status
      });
    }
  };

  const statusOptions = ['Active', 'Waiting', 'Suspended'];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-scaleIn">
        {isDeleteConfirmMode ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete delivery "<span className="font-semibold">{delivery?.name}</span>"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
               <button
               onClick={onDeleteConfirm}
              className="px-4 py-2 rounded-md text-white text-sm font-medium"
              style={{ backgroundColor: '#DC2626' }} // Red for delete
            >
              Delete
            </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {isViewMode ? 'Delivery Details' : 'Edit Delivery'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery ID</label>
                  <input
                    type="text"
                    value={delivery?.id || ''}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    readOnly={isViewMode}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly={isViewMode}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Active Orders</label>
                  <input
                    type="number"
                    value={activeOrder}
                    onChange={(e) => setActiveOrder(e.target.value)}
                    readOnly={isViewMode}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Completed Deliveries</label>
                  <input
                    type="number"
                    value={completed}
                    onChange={(e) => setCompleted(e.target.value)}
                    readOnly={isViewMode}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  {isViewMode ? (
                    <input
                      type="text"
                      value={status}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    />
                  ) : (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  {isViewMode ? 'Close' : 'Cancel'}
                </button>
                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[rgb(4,120,87)] text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};


// Main Delivery Dashboard Component
const DeliveryDashboard = () => {
  // Dummy data for delivery dashboard cards
  const [deliveryStats, setDeliveryStats] = useState(null);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get("http://localhost:8000/check-login", { withCredentials: true })
      .then(res => {
         console.log(res.data);
        if (res.data.role == "A"||res.data.role == "D") {
         console.log(res.data.user);
          setUser(res.data.user); // session data from backend
        } else {
         // If no session, redirect to login page
          navigate("/admin/login");
        }
      })
      .catch(() => {
        // On any error, redirect to login page
        navigate("/admin/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);
useEffect(() => {
  axios.get('http://localhost:8000/api/delivery-stats')
    .then(res => {
      setDeliveryStats(res.data);
    })
    .catch(err => {
      console.error('Failed to fetch customer stats:', err);
    });
}, []);

const [allDeliveries, setAllDeliveries] = useState([]);

  const [chartPeriod, setChartPeriod] = useState('This week');
  const [activeTab, setActiveTab] = useState('All Delivery');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Based on the image's visible rows

  // State for modal management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDelivery, setModalDelivery] = useState(null);
  const [modalMode, setModalMode] = useState(''); // 'view', 'edit', 'deleteConfirm'

  // Filtered deliveries based on tab and search term
  const filteredDeliveries = useMemo(() => {
    let currentFiltered = allDeliveries;

    // Filter by tab
    if (activeTab === 'Active') {
      currentFiltered = currentFiltered.filter(delivery => delivery.status === 'Active');
    } else if (activeTab === 'Accept Waiting') { // 'Accept Waiting' in UI maps to 'Waiting' status
      currentFiltered = currentFiltered.filter(delivery => delivery.status === 'Waiting');
    } else if (activeTab === 'Suspended') {
      currentFiltered = currentFiltered.filter(delivery => delivery.status === 'Suspended');
    }
    // 'All Delivery' tab doesn't require filtering by status, it's the base list

    // Filter by search term
    const finalFiltered = currentFiltered.filter(delivery =>
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(delivery.activeOrder).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(delivery.completed).toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return finalFiltered;
  }, [allDeliveries, activeTab, searchTerm]);
useEffect(() => {
  const fetchDeliveries = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/get_delivery', {
        params: { searchTerm },
      });

      const formatted = res.data.map((d, index) => ({
        id: `#DEL${d.id}`,
        name: d.full_name || '',
        phone: d.phone || '',
        activeOrder: d.active_orders || 0,
        completed: d.completed_orders || 0,
        status: d.status || 'Active',
      }));

      setAllDeliveries(formatted);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
    }
  };

  fetchDeliveries();
}, [searchTerm]);

  // Reset page to 1 whenever tab or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeliveries = filteredDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const handlePrevious = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  // Dynamically calculate the count for each tab
  const allDeliveryCount = allDeliveries.length;
  const activeCount = allDeliveries.filter(d => d.status === 'Active').length;
  const waitingCount = allDeliveries.filter(d => d.status === 'Waiting').length;
  const suspendedCount = allDeliveries.filter(d => d.status === 'Suspended').length;
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/overview")
      .then(res => setOverviewData(res.data))
      .catch(err => console.error("Failed to fetch overview data:", err));
  }, []);
  const productStatusesData = overviewData ? {
    labels: ['Delivered', 'Returned', 'On The Way'],
    datasets: [
      {
        data: [
          overviewData.productStatuses.Delivered,
          overviewData.productStatuses.Returned,
          overviewData.productStatuses['On The Way']
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 1,
      },
    ],
  } : null;
  
  // const deliveryStatusesData = overviewData ? {
  //   labels: ['Active', 'Suspended'],
  //   datasets: [
  //     {
  //       label: 'Number of Sellers',
  //       data: [
  //         overviewData.sellerStatuses.Active,
  //         overviewData.sellerStatuses.Suspended,
  //       ],
  //       backgroundColor: ['#10B981', '#EF4444'],
  //       borderColor: ['#10B981', '#EF4444'],
  //       borderWidth: 1,
  //     },
  //   ],
  // } : null;
  
  // Chart.js Data and Options
  // const productStatusesData = {
  //   labels: ['Delivered', 'Returned', 'On The Way'],
  //   datasets: [
  //     {
  //       data: [53, 40, 7], // Example percentages
  //       backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
  //       borderColor: ['#10B981', '#F59E0B', '#EF4444'],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const productStatusesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll render custom legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + '%';
            }
            return label;
          }
        }
      }
    },
  };

  // const deliveryStatusesData = {
  //   labels: ['Active', 'Suspended'], // Added 'Top' from original chart, assuming it refers to "best performers"
  //   datasets: [
  //     {
  //       label: 'Number of Deliveries',
  //       data: [640, 480], // Example values
  //       backgroundColor: ['#10B981', '#EF4444'],
  //       borderColor: ['#10B981', '#EF4444'],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const deliveryStatusesOptions = {
  //   indexAxis: 'y', // Horizontal bars
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       beginAtZero: true,
  //       max: 800, // Max value based on example data
  //       ticks: {
  //         stepSize: 200,
  //         color: '#6B7280',
  //       },
  //       grid: {
  //         display: false, // Hide vertical grid lines
  //       },
  //     },
  //     y: {
  //       grid: {
  //         display: false, // Hide horizontal grid lines
  //       },
  //       ticks: {
  //         color: '#1F2937',
  //       }
  //     },
  //   },
  // };
  const deliveryStatusesData = overviewData ? {
    labels: ['Active', 'Suspended'],
    datasets: [
      {
        label: 'Number of Sellers',
        data: [
          overviewData.sellerStatuses.Active,
          overviewData.sellerStatuses.Suspended,
        ],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#10B981', '#EF4444'],
        borderWidth: 1,
      },
    ],
  } : null;
  
  const deliveryStatusesOptions = {
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        // dynamically adjust max based on data
        max: Math.max(
          overviewData?.sellerStatuses?.Active || 0,
          overviewData?.sellerStatuses?.Suspended || 0
        ) + 2, // add padding so bars show clearly
        ticks: {
          stepSize: 1, // step size matches your data
          color: '#6B7280',
        },
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#1F2937',
        },
      },
    },
  };
  
  const renderPageNumbers = useCallback(() => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, maxPagesToShow);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
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

    return pageNumbers.filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  }, [currentPage, totalPages]);


  // Handlers for modal actions for deliveries
  const handleViewDelivery = useCallback((delivery) => {
    setModalDelivery(delivery);
    setModalMode('view');
    setIsModalOpen(true);
  }, []);

  const handleEditDelivery = useCallback((delivery) => {
    setModalDelivery(delivery);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleDeleteDeliveryClick = useCallback((delivery) => {
    setModalDelivery(delivery);
    setModalMode('deleteConfirm');
    setIsModalOpen(true);
  }, []);

  const confirmDeleteDelivery = useCallback(() => {
const id = modalDelivery.id.replace('#DEL', '');

  axios
    .delete(`http://localhost:8000/api/delivery/${id}`)
    .then(() => {
setAllDeliveries(prev => prev.filter(d => d.id !== modalDelivery.id));
  if (currentDeliveries.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
       setIsModalOpen(false);
    setModalDelivery(null);
    })
    .catch(err => {
      console.error('Failed to delete customer', err);
    });
  }, [modalDelivery, currentDeliveries.length, currentPage]);

  const handleSaveDelivery = useCallback((updatedDelivery) => {
  const id = updatedDelivery.id.replace('#DEL', '');
  axios
    .put(`http://localhost:8000/api/delivery/${id}`, {
      full_name: updatedDelivery.name,
      phone: updatedDelivery.phone,
      status: updatedDelivery.status,
    })
    .then(() => {
      setAllDeliveries(prev =>
      prev.map(d => (d.id === updatedDelivery.id ? updatedDelivery : d))
    );
        setIsModalOpen(false);
        setModalDelivery(null);
    })
    .catch(err => {
      console.error('Failed to update customer', err);
    });


  });


  return (
    <div className="min-h-screen p-6 font-inter bg-gray-100">
      <header className="mb-4">
        <Title title="Delivery Overview" />
      </header>
      <div className="flex flex-col lg:flex-row gap-4">
      {deliveryStats && (
        <div className="grid grid-cols-1 w-full md:w-[300px] gap-4 mb-6">
          <DashboardCard
            title="Total Delivery"
            value={deliveryStats.totalDelivery.value}
            change={deliveryStats.totalDelivery.change}
            isPositive={deliveryStats.totalDelivery.isPositive}
          />
          <DashboardCard
            title="New Delivery Last 7 days"
            value={deliveryStats.newDelivery.value}
            change={deliveryStats.newDelivery.change}
            isPositive={deliveryStats.newDelivery.isPositive}
          />
          <DashboardCard
            title="Total Orders Delivered"
            value={deliveryStats.deliveredToday.value}
            change={deliveryStats.deliveredToday.change}
            isPositive={deliveryStats.deliveredToday.isPositive}
          />
        </div>
      )}

        {/* Delivery Overview Chart Section */}
        <div className="bg-white p-6 rounded-lg max-w-full flex-1 flex flex-col shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Delivery Overview</h2>
            <div className="flex gap-2 text-sm font-medium">
              <button
                onClick={() => setChartPeriod('This week')}
                className={`py-1 px-3 rounded-md transition-colors duration-200 ${
                  chartPeriod === 'This week'
                    ? 'text-white shadow-md'
                    : 'text-gray-800'
                }`}
                style={{
                  backgroundColor: chartPeriod === 'This week' ? 'rgb(4,120,87)' : '#F3F4F6',
                  color: chartPeriod === 'This week' ? '#FFFFFF' : '#1F2937'
                }}
              >
                This week
              </button>
              <button
                onClick={() => setChartPeriod('Last week')}
                className={`py-1 px-3 rounded-md transition-colors duration-200 ${
                  chartPeriod === 'Last week'
                    ? 'text-white shadow-md'
                    : 'text-gray-800'
                }`}
                style={{
                  backgroundColor: chartPeriod === 'Last week' ? 'rgb(4,120,87)' : '#F3F4F6',
                  color: chartPeriod === 'Last week' ? '#FFFFFF' : '#1F2937'
                }}
              >
                Last week
              </button>
            </div>
          </div>

{/* Product Statuses and Delivery Statuses Charts */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Product Statuses Chart (Doughnut Chart) */}
  <div className="bg-white p-4 rounded-lg flex flex-col items-center">
    <h3 className="text-md font-semibold mb-4 text-gray-800">Products Statuses</h3>
    <div className="w-48 h-48 mb-4">
      {productStatusesData ? (
        <Doughnut data={productStatusesData} options={productStatusesOptions} />
      ) : (
        <p className="text-gray-400 text-sm">Loading...</p>
      )}
    </div>
    {/* Legend dynamic */}
    <div className="flex flex-col space-y-2 text-sm text-gray-500">
      {productStatusesData?.labels?.map((label, index) => {
        const value = productStatusesData.datasets?.[0]?.data?.[index] || 0;
        const total =
          productStatusesData.datasets?.[0]?.data?.reduce((a, b) => a + b, 0) || 0;
        const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
        const color =
          productStatusesData.datasets?.[0]?.backgroundColor?.[index] || "#ccc";

        return (
          <div key={index} className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: color }}
            ></span>
            {label}: {percentage}%
          </div>
        );
      })}
    </div>
  </div>

  {/* Delivery Statuses Chart (Horizontal Bar Chart) */}
  <div className="bg-white p-4 rounded-lg">
    <h3 className="text-md font-semibold mb-4 text-gray-800">Delivery Statuses</h3>
    <div className="h-64">
      {deliveryStatusesData ? (
        <Bar data={deliveryStatusesData} options={deliveryStatusesOptions} />
      ) : (
        <p className="text-gray-400 text-sm">Loading...</p>
      )}
    </div>
  </div>
</div>

        </div>
      </div>

      {/* Delivery Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex flex-wrap gap-2 text-sm font-medium text-gray-700">
            {/* Tabs for filtering */}
            <button
              onClick={() => setActiveTab('All Delivery')}
              className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                activeTab === 'All Delivery' ? 'text-white shadow-md' : 'text-gray-800'
              }`}
              style={{
                backgroundColor: activeTab === 'All Delivery' ? 'rgb(4,120,87)' : '#F3F4F6',
                color: activeTab === 'All Delivery' ? '#FFFFFF' : '#1F2937'
              }}
            >
              All Delivery ({allDeliveryCount})
            </button>
            <button
              onClick={() => setActiveTab('Active')}
              className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                activeTab === 'Active' ? 'text-white shadow-md' : 'text-gray-800'
              }`}
              style={{
                backgroundColor: activeTab === 'Active' ? 'rgb(4,120,87)' : '#F3F4F6',
                color: activeTab === 'Active' ? '#FFFFFF' : '#1F2937'
              }}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab('Accept Waiting')}
              className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                activeTab === 'Accept Waiting' ? 'text-white shadow-md' : 'text-gray-800'
              }`}
              style={{
                backgroundColor: activeTab === 'Accept Waiting' ? 'rgb(4,120,87)' : '#F3F4F6',
                color: activeTab === 'Accept Waiting' ? '#FFFFFF' : '#1F2937'
              }}
            >
              Accept Waiting ({waitingCount})
            </button>
            <button
              onClick={() => setActiveTab('Suspended')}
              className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                activeTab === 'Suspended' ? 'text-white shadow-md' : 'text-gray-800'
              }`}
              style={{
                backgroundColor: activeTab === 'Suspended' ? 'rgb(4,120,87)' : '#F3F4F6',
                color: activeTab === 'Suspended' ? '#FFFFFF' : '#1F2937'
              }}
            >
              Suspended ({suspendedCount})
            </button>
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by delivery ID or name..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(4,120,87)] border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto lg:overflow-x-visible rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F0FDF4]">
              <tr>
                {['Delivery Id', 'Name', 'Phone', 'Active Order', 'Completed', 'Status', 'Action'].map(header => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#065F46]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDeliveries.length > 0 ? (
                currentDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.activeOrder}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.completed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        delivery.status === 'Active' ? 'bg-green-100 text-green-800' :
                        delivery.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800' // Suspended
                      }`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                          title="View"
                          onClick={() => handleViewDelivery(delivery)}
                        >
                          <IconEye className="h-5 w-5" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-yellow-600 transition-colors"
                          title="Edit"
                          onClick={() => handleEditDelivery(delivery)}
                        >
                          <IconPencil className="h-5 w-5" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete"
                          onClick={() => handleDeleteDeliveryClick(delivery)}
                        >
                          <IconTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No Delivery found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <span className="text-sm text-gray-700 mb-4 md:mb-0">
            Showing <span className="font-semibold">{filteredDeliveries.length > 0 ? indexOfFirstItem + 1 : 0}</span> to <span className="font-semibold">{indexOfFirstItem + currentDeliveries.length}</span> of <span className="font-semibold">{filteredDeliveries.length}</span> entries
          </span>
          <nav className="flex flex-col md:flex-row justify-between items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <IconChevronLeft className="h-4 w-4 mr-1" /> Previous
            </button>
            <div className="flex space-x-1">
              {renderPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && paginate(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${typeof page !== 'number' ? 'cursor-default border-transparent bg-transparent hover:bg-transparent' : ''}`}
                  style={{
                    backgroundColor: currentPage === page ? 'rgb(4,120,87)' : '#FFFFFF',
                    color: currentPage === page ? '#FFFFFF' : '#4B5563',
                    borderColor: currentPage === page ? 'rgb(4,120,87)' : '#D1D5DB',
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
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Next <IconChevronRight className="h-4 w-4 ml-1" />
            </button>
          </nav>
        </div>
      </div>

      {/* Render Delivery Modal */}
      {isModalOpen && (
        <DeliveryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          delivery={modalDelivery}
          mode={modalMode}
          onSave={handleSaveDelivery}
          onDeleteConfirm={confirmDeleteDelivery}
        />
      )}
    </div>
  );
};


export default DeliveryDashboard;
