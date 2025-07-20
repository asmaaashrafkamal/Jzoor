import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Helper component for displaying Title (re-defined here for self-containment)
const Title = ({ title }) => <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>;

// Dashboard Card Component
const DashboardCard = ({ title, value, change, isPositive }) => (
  <div className="p-6 rounded-lg shadow-md flex flex-col justify-between bg-white">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-semibold text-gray-900">{value}</span>
      <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '▲' : '▼'} {change}
      </span>
    </div>
    <p className="text-xs mt-2 text-gray-500">Last 7 days</p>
  </div>
);

// Inline SVG Icons (replacing react-icons/fa for compilation stability)
const IconSearch = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM16.707 15.293l3.75 3.75a1 1 0 01-1.414 1.414l-3.75-3.75a1 1 0 011.414-1.414z" />
  </svg>
);

const IconEye = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path d="M12 4.5c-6.627 0-11 7.5-11 7.5s4.373 7.5 11 7.5 11-7.5 11-7.5-4.373-7.5-11-7.5zM12 17a4.5 4.5 0 110-9 4.5 4.5 0 010 9zM12 15a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
  </svg>
);

const IconEdit = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path d="M17.25 6.75L18 7.5l1.75-1.75-1.75-1.75L17.25 6.75zM12 21H3a1 1 0 01-1-1v-9a1 1 0 01.293-.707l12-12a1 1 0 011.414 0l8 8a1 1 0 010 1.414l-12 12A1 1 0 0112 21zM5 18h6.5l8-8-6.5-6.5-8 8V18z" />
  </svg>
);

const IconTrash = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path d="M5 21V8h14v13a1 1 0 01-1 1H6a1 1 0 01-1-1zM10 10v7a1 1 0 002 0v-7a1 1 0 00-2 0zM14 10v7a1 1 0 002 0v-7a1 1 0 00-2 0zM4 6V5a1 1 0 011-1h4V3a1 1 0 011-1h4a1 1 0 011 1v1h4a1 1 0 011 1v1H4z" />
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

// Seller Modal Component
const SellerModal = ({ isOpen, onClose, seller, mode, onSave, onDeleteConfirm }) => {
  const [name, setName] = useState(seller?.name || '');
  const [phone, setPhone] = useState(seller?.phone || '');
  const [productCount, setProductCount] = useState(seller?.productCount || '');
  const [status, setStatus] = useState(seller?.status || '');

  useEffect(() => {
    if (seller) {
      setName(seller.name);
      setPhone(seller.phone);
      setProductCount(seller.productCount);
      setStatus(seller.status);
    }
  }, [seller]);

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isDeleteConfirmMode = mode === 'deleteConfirm';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      onSave({ ...seller, name, phone, productCount: parseInt(productCount, 10), status });
    }
  };

//   const statusOptions = ['Active', 'Waiting', 'Suspended'];
  const statusOptions = ['active', 'inactive'];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-scaleIn">
        {isDeleteConfirmMode ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete seller "<span className="font-semibold">{seller?.name}</span>"? This action cannot be undone.</p>
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
              {/* <button
                type="button"
                className="text-gray-500 hover:text-red-600" // Hover to red color
                title="Delete"
                onClick={onDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button> */}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {isViewMode ? 'Seller Details' : 'Edit Seller'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seller ID</label>
                  <input
                    type="text"
                    value={seller?.id || ''}
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
                  <label className="block text-sm font-medium text-gray-700">Product Count</label>
                  <input
                    type="number"
                    value={productCount}
                    onChange={(e) => setProductCount(e.target.value)}
                    readOnly={isViewMode}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Join Date</label>
                  <input
                    type="text"
                    value={seller?.joinDate || ''}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
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


// Main Sellers Dashboard Component
const SellersDashboard = () => {
  // Dummy data for seller dashboard cards
  const [sellerStats, setSellerStats] = useState(null);
useEffect(() => {
  axios.get('http://localhost:8000/api/seller-stats')
    .then(res => {
      setSellerStats(res.data);
    })
    .catch(err => {
      console.error('Failed to fetch customer stats:', err);
    });
}, []);
  // Dummy data for sellers table
//   const [sellers, setSellers] = useState([
//     { id: '#SELL001', name: 'John Doe', phone: '+1234567890', productCount: 25, joinDate: '01-01-2025', status: 'Active' },
//     { id: '#SELL002', name: 'John Doe', phone: '+1234567890', productCount: 25, joinDate: '01-01-2025', status: 'Active' },
//     { id: '#SELL003', name: 'John Doe', phone: '+1234567890', productCount: 25, joinDate: '01-01-2025', status: 'Active' },
//     { id: '#SELL004', name: 'John Doe', phone: '+1234567890', productCount: 25, joinDate: '01-01-2025', status: 'Active' },
//     { id: '#SELL005', name: 'Jane Smith', phone: '+1234567890', productCount: 5, joinDate: '01-01-2025', status: 'Suspended' },
//     { id: '#SELL006', name: 'Emily Davis', phone: '+1234567890', productCount: 30, joinDate: '01-01-2025', status: 'Waiting' },
//     { id: '#SELL007', name: 'Jane Smith', phone: '+1234567890', productCount: 5, joinDate: '01-01-2025', status: 'Suspended' },
//     { id: '#SELL008', name: 'John Doe', phone: '+1234567890', productCount: 25, joinDate: '01-01-2025', status: 'Active' },
//     { id: '#SELL009', name: 'Emily Davis', phone: '+1234567890', productCount: 30, joinDate: '01-01-2025', status: 'Waiting' },
//     { id: '#SELL010', name: 'Jane Smith', phone: '+1234567890', productCount: 5, joinDate: '01-01-2025', status: 'Suspended' },
//   ]);

const [sellers, setSellers] = useState([]);



  const [chartPeriod, setChartPeriod] = useState('This week');
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Based on the image's visible rows

  // State for modal management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSeller, setModalSeller] = useState(null);
  const [modalMode, setModalMode] = useState(''); // 'view', 'edit', 'deleteConfirm'
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
  axios
    .get('http://localhost:8000/api/get_seller', {
      params: { searchTerm } // ✅ Send searchTerm as query string
    })
    .then(res => {
      const users = res.data;

      const transformed = users.map(user => {
        let totalSpend = 0;
        let orderCount = 0;
        let latestDate = null;

        user.orders?.forEach(order => {
          totalSpend += parseFloat(order.total_price) || 0;
          orderCount += 1;

          const orderDate = new Date(order.updated_at);
          if (!latestDate || orderDate > new Date(latestDate)) {
            latestDate = order.updated_at;
          }
        });

        const formattedDate = latestDate
          ? new Date(latestDate).toLocaleDateString('en-GB')
          : 'N/A';

        return {
          id: `#SELL${user.id}`,
          name: user.full_name,
          phone: user.phone,
          productCount: user.products?.length || 0,
          joinDate: user.created_at
            ? new Date(user.created_at).toLocaleDateString('en-GB')
            : 'N/A',
          orderCount,
          totalSpend: totalSpend.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }),
          status: user.status || (
            totalSpend >= 3000
              ? 'VIP'
              : totalSpend > 0
              ? 'Active'
              : 'Inactive'
          ),
          date: formattedDate,
        };
      });

      setSellers(transformed);
    })
    .catch(err => console.error('Failed to fetch sellers with orders:', err));
}, [searchTerm]); // ✅ re-run fetch when searchTerm changes


  // Calculate counts for each status using useMemo for efficiency
  const sellerCounts = useMemo(() => {
    const counts = {
      All: sellers.length,
      Active: sellers.filter(seller => seller.status === 'Active').length,
      Waiting: sellers.filter(seller => seller.status === 'Waiting').length,
      Suspended: sellers.filter(seller => seller.status === 'Suspended').length,
    };
    return counts;
  }, [sellers]);

  // Dummy data for Product Statuses chart
  const productStatusData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [53, 40, 7], // Percentages from the image
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
        borderWidth: 2,
      },
    ],
  };

  const productStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We will render a custom legend
      },
      tooltip: {
        callbacks: {
          label: function(context) {
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
    cutout: '70%', // Creates the doughnut effect
  };

  // Dummy data for Sellers Statuses chart
  const sellersStatusData = {
    labels: ['Active', 'Top', 'Suspended'],
    datasets: [
      {
        data: [640, 240, 480], // Values from the image
        backgroundColor: ['#10B981', '#2563EB', '#EF4444'],
        borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
        borderWidth: 1,
      },
    ],
  };

  const sellersStatusOptions = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            return context.parsed.x; // Display the value
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
            callback: function(value) {
                return value; // Display raw numbers
            }
        }
      },
      y: {
        grid: {
          display: false,
        }
      },
    },
  };

  // Filter sellers based on activeTab and search term using useMemo
 const filteredSellers = useMemo(() => {
  let currentFiltered = sellers;

  // Filter by tab
  if (activeTab === 'Active') {
    currentFiltered = currentFiltered.filter(seller => seller.status === 'Active');
  } else if (activeTab === 'Waiting') {
    currentFiltered = currentFiltered.filter(seller => seller.status === 'Waiting');
  } else if (activeTab === 'Suspended') {
    currentFiltered = currentFiltered.filter(seller => seller.status === 'Suspended');
  }

  // Filter by search term
  const lowerSearch = searchTerm.toLowerCase();
  const finalFiltered = currentFiltered.filter(seller =>
    String(seller.id).toLowerCase().includes(lowerSearch) ||
    (seller.name && seller.name.toLowerCase().includes(lowerSearch)) ||
    (seller.phone && seller.phone.toLowerCase().includes(lowerSearch)) ||
    String(seller.productCount).toLowerCase().includes(lowerSearch) ||
    (seller.joinDate && seller.joinDate.toLowerCase().includes(lowerSearch)) ||
    (seller.status && seller.status.toLowerCase().includes(lowerSearch))
  );

  return finalFiltered;
}, [sellers, activeTab, searchTerm]);


  // Reset page to 1 whenever tab or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSellers = filteredSellers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
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
      pageNumbers.push(
        <button
          key={1}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === 1 ? 'bg-[rgb(4,120,87)] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => paginate(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsis-start" className="px-1 py-2 text-gray-700 text-sm">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === i ? 'bg-[rgb(4,120,87)] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => paginate(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsis-end" className="px-1 py-2 text-gray-700 text-sm">...</span>);
      }
      pageNumbers.push(
        <button
          key={totalPages}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === totalPages ? 'bg-[rgb(4,120,87)] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    return pageNumbers.filter((value, index, self) => self.indexOf(value) === index);
  }, [totalPages, currentPage, paginate]);


  // Handlers for modal actions for sellers
  const handleViewSeller = useCallback((seller) => {
    setModalSeller(seller);
    setModalMode('view');
    setIsModalOpen(true);
  }, []);

  const handleEditSeller = useCallback((seller) => {
    setModalSeller(seller);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleDeleteSellerClick = useCallback((seller) => {
    setModalSeller(seller);
    setModalMode('deleteConfirm');
    setIsModalOpen(true);
  }, []);

  const confirmDeleteSeller = useCallback(() => {
    setSellers(prev => prev.filter(s => s.id !== modalSeller.id));
    // Adjust page if current page becomes empty
axios
  .delete(`http://localhost:8000/api/seller/${modalSeller.id.replace('#SELL', '')}`)
  .then(() => {
    setSellers(prev => prev.filter(s => s.id !== modalSeller.id));
    setIsModalOpen(false);
    setModalSeller(null);
  })
  .catch(err => {
    console.error('Failed to delete seller', err);
  });

    if (currentSellers.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
    setIsModalOpen(false);
    setModalSeller(null);
  }, [modalSeller, currentSellers.length, currentPage]);
const handleSaveSeller = useCallback((updatedSeller) => {
  axios
    .put(`http://localhost:8000/api/sellers/${updatedSeller.id.replace('#SELL', '')}`, {
      full_name: updatedSeller.name,
      phone: updatedSeller.phone,
      status: updatedSeller.status,
    })
    .then(() => {
      setSellers(prev =>
        prev.map(s => (s.id === updatedSeller.id ? updatedSeller : s))
      );
      setIsModalOpen(false);
      setModalSeller(null);
    })
    .catch(err => {
      console.error('Failed to update seller', err);
    });
}, []);


  return (
    <div className="min-h-screen p-6 font-inter bg-gray-100">
      <header className="mb-4">
        <Title title="Sellers Overview" />
      </header>
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Top Seller Stats Cards */}
      {sellerStats && (

        <div className="grid grid-cols-1 w-full md:w-[300px] gap-4 mb-6">

          <DashboardCard
            title="Total Sellers"
            value={sellerStats.totalSellers.value}
            change={sellerStats.totalSellers.change}
            isPositive={sellerStats.totalSellers.isPositive}
          />
          <DashboardCard
            title="New Sellers"
            value={sellerStats.newSellers.value}
            change={sellerStats.newSellers.change}
            isPositive={sellerStats.newSellers.isPositive}
          />
          <DashboardCard
            title="Total Sales Value"
            value={sellerStats.totalSalesValue.value}
            change={sellerStats.totalSalesValue.change}
            isPositive={sellerStats.totalSalesValue.isPositive}
          />
        </div>
      )};
        {/* Sellers Overview Chart Section */}
        <div className="bg-white p-6 rounded-lg max-w-full flex-1 flex flex-col shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Sellers Overview</h2>
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

          {/* Product Statuses and Sellers Statuses Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Statuses Chart (Doughnut Chart) */}
            <div className="bg-white p-4 rounded-lg flex flex-col items-center">
              <h3 className="text-md font-semibold mb-4 text-gray-800">Products Statuses</h3>
              <div className="w-48 h-48 mb-4">
                <Doughnut data={productStatusData} options={productStatusOptions} />
              </div>
              <div className="flex flex-col space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span> Approved: 53%
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></span> Pending: 40%
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-red-500"></span> Rejected: 7%
                </div>
              </div>
            </div>

            {/* Sellers Statuses Chart (Bar Chart) */}
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-md font-semibold mb-4 text-gray-800">Sellers Statuses</h3>
              <div className="h-64"> {/* Increased height for better visibility of bars */}
                <Bar data={sellersStatusData} options={sellersStatusOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex flex-wrap gap-2 text-sm font-medium text-gray-700">
            {/* Tabs for filtering - adjusted to show dynamic counts */}
            {[
              { label: `All Sellers (${sellerCounts.All})`, status: 'All' },
              { label: `Active (${sellerCounts.Active})`, status: 'Active' },
              { label: `Accept Waiting (${sellerCounts.Waiting})`, status: 'Waiting' },
              { label: `Suspended (${sellerCounts.Suspended})`, status: 'Suspended' }
            ].map(tabInfo => (
              <button
                key={tabInfo.status}
                onClick={() => setActiveTab(tabInfo.status)}
                className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                  activeTab === tabInfo.status
                    ? 'text-white shadow-md'
                    : 'text-gray-800'
                }`}
                style={{
                  backgroundColor: activeTab === tabInfo.status ? 'rgb(4,120,87)' : '#F3F4F6',
                  color: activeTab === tabInfo.status ? '#FFFFFF' : '#1F2937'
                }}
              >
                {tabInfo.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by seller id, name, or status..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="w-full overflow-x-auto lg:overflow-x-visible rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F0FDF4]">
              <tr>
                {['Seller Id', 'Name', 'Phone', 'Product Count', 'Join Date', 'Status', 'Action'].map(header => (
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
              {currentSellers.length > 0 ? (
                currentSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{seller.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{seller.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{seller.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{seller.productCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{seller.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        seller.status === 'Active' ? 'bg-green-100 text-green-800' :
                        seller.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800' // Suspended
                      }`}>
                        {seller.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                          title="View"
                          onClick={() => handleViewSeller(seller)}
                        >
                          <IconEye className="h-5 w-5" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-yellow-600 transition-colors"
                          title="Edit"
                          onClick={() => handleEditSeller(seller)}
                        >
                          <IconEdit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600" // Hover to red color
                          title="Delete"
                          onClick={() => handleDeleteSellerClick(seller)}
                        >
                          <IconTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No sellers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <span className="text-sm text-gray-700 mb-4 md:mb-0">
            Showing <span className="font-semibold">{filteredSellers.length > 0 ? indexOfFirstItem + 1 : 0}</span> to <span className="font-semibold">{indexOfFirstItem + currentSellers.length}</span> of <span className="font-semibold">{filteredSellers.length}</span> entries
          </span>
          <nav className="flex flex-col md:flex-row justify-between items-center items-center space-x-2">
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

      {/* Render Seller Modal */}
      {isModalOpen && (
        <SellerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          seller={modalSeller}
          mode={modalMode}
          onSave={handleSaveSeller}
          onDeleteConfirm={confirmDeleteSeller}
        />
      )}
    </div>
  );
};

export default SellersDashboard;
