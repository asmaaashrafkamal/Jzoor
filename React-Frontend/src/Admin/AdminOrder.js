import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { HiOutlinePlus, HiOutlineChevronDown, HiOutlineEye, HiOutlinePencil, HiOutlineTrash, HiX } from 'react-icons/hi';
import { GoSearch } from 'react-icons/go';
import { HiDotsVertical } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
// Assuming Title component is defined elsewhere or will be provided.
// For demonstration, a simple Title component is included here if not provided.
const Title = ({ title }) => <h1 className="text-3xl font-bold text-[#1F2937] mb-6 md:mb-0">{title}</h1>;


// Main Orders Dashboard Component
const OrdersDashboard = () => {
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

  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    newOrders: 0,
    completedOrders: 0,
    canceledOrders: 0,
  });
  
  useEffect(() => {
    axios.get("http://localhost:8000/api/order-stats")
      .then((res) => {
        setOrderStats(res.data);
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);
  
  // Dummy data for orders table
 const [orders, setOrders] = useState([]);

const fetchOrders = async () => {
  setLoading(true);
  try {
    const res = await axios.get('http://localhost:8000/api/orders');
    setOrders(res.data);
  } catch (err) {
    console.error("Failed to fetch orders", err);
    toast.error("Failed to load orders. Please try again later.");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchOrders();
}, []);
  const [activeTab, setActiveTab] = useState('All orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyMyOrders, setShowOnlyMyOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Number of items to display per page

  // State for modals
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Stores the order object for modal context
  const [newStatus, setNewStatus] = useState(''); // Stores the new status for editing

  // Admin editable statuses - defining common admin editable states
  const adminStatuses = ['Preparing', 'Shipped' ,'Picked Up','In Transit', 'Delivered', 'Canceled']; // Added delivered and pending to allow changing back if needed

  // Calculate counts for dashboard tabs
  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter(order => order.status === 'Delivered').length;
  const pendingOrdersCount = orders.filter(order => order.status === 'Pending' || order.status === 'Preparing').length;
  const canceledOrdersCount = orders.filter(order => order.status === 'Canceled').length;

  // Effect to reset page to 1 when filters or tabs change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, showOnlyMyOrders]);

  // Memoized filtered orders based on current tab, search term, and "My Orders" filter
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Check if order matches the search term in various fields
    const matchesSearch =
  (order.orderId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
  (order.items?.[0]?.product?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
  (order.status?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
  (order.payment?.payment_method?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
  (order.customer?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      // Check if order matches the active tab filter
      let matchesTab = true;
      if (activeTab === 'Completed') {
        matchesTab = order.status === 'Delivered';
      } else if (activeTab === 'Pending') {
        matchesTab = order.status === 'Pending' || order.status === 'Preparing';
      } else if (activeTab === 'Canceled') {
        matchesTab = order.status === 'Canceled';
      } else if (activeTab === 'All orders') {
        matchesTab = true; // All orders match this tab
      }

      // Dummy logic for "My Orders" - in a real app, this would check against a logged-in user's ID
      // For now, it filters by even `order.id` for demonstration
      const matchesMyOrders = showOnlyMyOrders ? (order.id % 2 === 0) : true;

      return matchesSearch && matchesTab && matchesMyOrders;
    });
  }, [orders, activeTab, searchTerm, showOnlyMyOrders]);

  // Calculate pagination details
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Pagination handler to change current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handlers for previous and next page buttons
  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Function to render pagination numbers with ellipsis for large number of pages
  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Show all pages if total pages are 5 or less
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Logic for showing ellipses for more than 5 pages
      pageNumbers.push(1); // Always show first page
      if (currentPage > 3) {
        pageNumbers.push('...'); // Ellipsis if current page is far from beginning
      }
      // Show current page and its neighbors
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
        pageNumbers.push('...'); // Ellipsis if current page is far from end
      }
      // Always show last page if not already included
      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }
    // Filter out duplicate ellipses or numbers if they appear next to each other
    return pageNumbers.filter((value, index, self) => self.indexOf(value) === index);
  };

  // Handlers for modal actions (View, Edit, Delete)
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  const handleEditStatus = (order) => {
   if(order.status !="Canceled"){
    setSelectedOrder(order);
    setNewStatus(order.status); // Pre-fill modal with current status
    setShowEditStatusModal(true);
    }
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setShowDeleteConfirmationModal(true);
  };

  // Confirms deletion of an order
const confirmDelete = async () => {
  try {
await axios.delete(`http://localhost:8000/api/orders/${selectedOrder.id}`);
    toast.success("Order deleted successfully");
    fetchOrders();
setShowDeleteConfirmationModal(false);
setShowEditStatusModal(false);
  } catch (error) {
    console.error("Failed to delete order:", error);
    toast.error("Error deleting order");
  }
};



  // Saves the new status of an order
const saveStatus = async () => {
  try {
    await axios.put(`http://localhost:8000/api/orders/${selectedOrder.id}/status`, {
      status: newStatus
    });
    toast.success("Order status updated successfully");
    fetchOrders(); // refresh data
    setShowEditStatusModal(false);
  } catch (error) {
    console.error("Failed to update status:", error);
    toast.error("Failed to update status:", error);
  }
};



  // Assigns a delivery person to an order
 const handleAssignDelivery = (orderId, deliveryPerson) => {
  setOrders(prev =>
    prev.map(order =>
      order.id === orderId ? { ...order, deliveryPerson } : order
    )
  );
};

  // Function to get background and text colors for order status pills
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return { bg: '#D1FAE5', text: '#065F46' }; // Light Green / Dark Green
      case 'Pending': return { bg: '#FEF3C7', text: '#92400E' }; // Light Yellow / Dark Yellow-Orange
      case 'Preparing': return { bg: '#DBEAFE', text: '#1E40AF' }; // Light Blue / Dark Blue
      case 'Shipped': return { bg: '#CFFAFE', text: '#0E7490' }; // Light Cyan / Dark Cyan
      case 'Canceled': return { bg: '#FEE2E2', text: '#991B1B' }; // Light Red / Dark Red
      case 'Waiting Picked Up': return { bg: '#EDE9FE', text: '#5B21B6' }; // Light Violet / Dark Violet
      case 'Picked Up': return { bg: '#FEE2E2', text: '#C2410C' }; // Light Red-Orange / Dark Orange-Brown
      case 'In Transit': return { bg: '#ECFDF5', text: '#047857' }; // Very Light Green / Medium Green
      default: return { bg: '#F3F4F6', text: '#4B5563' }; // Light Gray / Gray
    }
  };
{loading && <p className="text-center text-gray-500">Loading orders...</p>}

  return (
<>
  {/* Toast notifications */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    {/* Main dashboard container with padding and background color */}
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-inter bg-[#F3F4F6]">
      {/* Header section with Title and potential action buttons (currently empty as per image) */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <Title title="Order List" />
        {/* Placeholder for "Add New Order" or other global actions if needed in the future */}
        {/* <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center bg-[#047857] text-white py-2 px-4 rounded-md shadow-sm hover:bg-[#065F46] transition-colors duration-200 text-sm">
            <HiOutlinePlus className="mr-2 h-5 w-5" /> Add New Order
          </button>
        </div> */}
      </header>

      {/* Order Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          title="Total Orders"
          value={orderStats.totalOrders.value}
          change={orderStats.totalOrders.change}
          isPositive={orderStats.totalOrders.isPositive}
        />
        <DashboardCard
          title="New Orders"
          value={orderStats.newOrders.value}
          change={orderStats.newOrders.change}
          isPositive={orderStats.newOrders.isPositive}
        />
        <DashboardCard
          title="Completed Orders"
          value={orderStats.completedOrders.value}
          change={orderStats.completedOrders.change}
          isPositive={orderStats.completedOrders.isPositive}
        />
        <DashboardCard
          title="Canceled Orders"
          value={orderStats.canceledOrders.value}
          change={orderStats.canceledOrders.change}
          isPositive={orderStats.canceledOrders.isPositive}
        />
      </div>

      {/* Order List Table Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          {/* Tabs for filtering orders */}
          <div className="flex flex-wrap gap-2 text-sm font-medium text-[#4B5563]">
            {['All orders', 'Completed', 'Pending', 'Canceled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 rounded-md transition-colors duration-200 text-sm font-medium
                  ${activeTab === tab
                    ? 'bg-[#047857] text-white shadow-md' // Active tab styles (Dark Green)
                    : 'bg-[#F3F4F6] text-[#1F2937] hover:bg-[#E5E7EB]' // Inactive tab styles
                  }`}
              >
                {tab} ({ // Display count for each tab
                  tab === 'All orders' ? totalOrdersCount :
                  tab === 'Completed' ? completedOrdersCount :
                  tab === 'Pending' ? pendingOrdersCount :
                  tab === 'Canceled' ? canceledOrdersCount : 0
                })
              </button>
            ))}
          </div>

          {/* Search and "Show Only My Orders" checkbox */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center text-sm text-[#4B5563]">
              <input
                id="showOnlyMyOrders"
                type="checkbox"
                className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-[#047857] text-[#047857]" // Consistent green focus ring
                checked={showOnlyMyOrders}
                onChange={(e) => setShowOnlyMyOrders(e.target.checked)}
              />
              <label htmlFor="showOnlyMyOrders" className="ml-2">Show Only My Orders</label>
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search order report"
                className="pl-10 pr-4 py-2 w-full border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent text-[#1F2937]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <GoSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {/* Added overflow-x-auto for horizontal scrolling on small screens */}
        <div className="w-full overflow-x-auto shadow-sm rounded-lg border border-[#E5E7EB]">
          <table className="min-w-full divide-y divide-[#E5E7EB]">
            <thead className="bg-[#F0FDF4]"> {/* Table header background color */}
              <tr>
                {/* Checkbox column */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                  <input type="checkbox" className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-[#047857] text-[#047857]" />
                </th>
                {/* Table Headers */}
                {['No.', 'Order Id', 'Product', 'Date', 'Price', 'Payment Method', 'Status', 'Action'].map(header => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#065F46]" // Table header text color
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-[#E5E7EB]">
              {currentOrders.length > 0 ? (
                currentOrders.map((order,index) => {
                  const statusColors = getStatusColor(order.status);
                  const firstItem = order.items?.[0]; // Get first item (if exists)
                  const productName = firstItem?.product?.name || 'No Product';
const productImage = firstItem?.product?.image
  ? `http://localhost:8000/storage/${firstItem.product.image}`
  : 'https://placehold.co/24x24/E0E0E0/FFFFFF?text=P';
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        <input type="checkbox" className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-[#047857] text-[#047857]" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{order.id}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{order.id}</td> */}

                      {/* ✅ Correct Product Cell using order.items[0].product */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        <div className="flex items-center">
                          <img src={productImage} alt={productName} className="w-6 h-6 rounded-full mr-2" />
                          {productName}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        ${order.total_price}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        {order.payment?.payment_method || 'N/A'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-[#6B7280] hover:text-[#2563EB]"
                            title="View Details"
                            onClick={() => handleViewDetails(order)}
                          >
                            <HiOutlineEye className="h-5 w-5" />
                          </button>
                          <button
                            className="text-[#6B7280] hover:text-[#F59E0B]"
                            title="Edit Status"
                            onClick={() => handleEditStatus(order)}
                          >
                            <HiOutlinePencil className="h-5 w-5" />
                          </button>
                          <button
                            className="text-[#6B7280] hover:text-[#DC2626]"
                            title="Delete Order"
                            onClick={() => handleDeleteOrder(order)}
                          >
                            <HiOutlineTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-[#6B7280]">No orders found.</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <span className="text-sm text-[#4B5563] mb-4 md:mb-0">
            Showing <span className="font-semibold">{filteredOrders.length > 0 ? indexOfFirstItem + 1 : 0}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, filteredOrders.length)}</span> of <span className="font-semibold">{filteredOrders.length}</span> entries
          </span>
          <nav className="flex flex-col md:flex-row justify-between items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              style={{ color: '#4B5563', backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' }}
            >
              ← Previous
            </button>
            <div className="flex space-x-1 mt-2 md:mt-0"> {/* Added margin for mobile spacing */}
              {renderPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && paginate(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-md
                    ${typeof page !== 'number' // Ellipsis or non-numeric pages
                      ? 'cursor-default border-transparent bg-transparent hover:bg-transparent'
                      : currentPage === page
                        ? 'bg-[#047857] text-white shadow-md' // Active page styles (Dark Green)
                        : 'bg-white text-[#4B5563] border border-[#D1D5DB] hover:bg-gray-50' // Inactive page styles
                    }
                  `}
                  // Ensure only active page has shadow, not just border
                  style={{
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
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors mt-2 md:mt-0" // Added margin for mobile spacing
              style={{ color: '#4B5563', backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' }}
            >
              Next →
            </button>
          </nav>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrder && (
  <OrderDetailsModal
    order={selectedOrder}
    onClose={() => setShowOrderDetailsModal(false)}
    onAssignDelivery={handleAssignDelivery}
  />
)}

      {/* Edit Status Modal */}
      {showEditStatusModal && selectedOrder && (
        <EditStatusModal
          order={selectedOrder.id}
          currentStatus={newStatus}
          onStatusChange={setNewStatus}
          onSave={saveStatus}
          onClose={() => setShowEditStatusModal(false)}
          adminStatuses={adminStatuses}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmationModal && selectedOrder && (
        <DeleteConfirmationModal
          orderId={selectedOrder.id}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirmationModal(false)}
        />
      )}
    </div></>

  );
};

// Component for individual dashboard statistic cards
const DashboardCard = ({ title, value, change, isPositive }) => (
  <div className="p-6 rounded-lg shadow-md flex flex-col justify-between bg-white">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium text-[#6B7280]">{title}</h3>
      {/* HiDotsVertical icon is commented out, uncomment if needed */}
      {/* <HiDotsVertical
        className="cursor-pointer text-[#9CA3AF]"
        size={20}
      /> */}
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-semibold text-[#111827]">{value}</span>
      <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
        {isPositive ? '▲' : '▼'} {change}
      </span>
    </div>
  </div>
);

// Dummy data for delivery personnel
// const deliveryPeople = [
//   { name: 'Mohammed Ahmad', id: '#DLVR234', phone: '0592988762' },
//   { name: 'Ali Hassan', id: '#DLVR235', phone: '0592123456' },
//   { name: 'Fatima Omar', id: '#DLVR236', phone: '0592789012' },
//   { name: 'Sami Khalid', id: '#DLVR237', phone: '0592345678' },
//   { name: 'Layla Mahmoud', id: '#DLVR238', phone: '0592901234' },
//   { name: 'Nour Safi', id: '#DLVR239', phone: '0592567890' },
//   { name: 'Khaled Amer', id: '#DLVR240', phone: '0592234567' },
//   { name: 'Mona Fahed', id: '#DLVR241', phone: '0592890123' },
// ];

// Order Details Modal Component
// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose, onAssignDelivery }) => {
  const [showDeliveryList, setShowDeliveryList] = useState(false);
  const [deliveryPeople, setDeliveryPeople] = useState([]);
  const [localOrder, setLocalOrder] = useState(order);

  useEffect(() => {
    axios.get('http://localhost:8000/api/delivery-people')
      .then(res => setDeliveryPeople(res.data))
      .catch(err => console.error('Failed to fetch delivery people', err));
  }, []);

  const allStatuses = useMemo(() => ([
    'Pending', 'Preparing', 'Shipped', 'Waiting Picked Up',
    'Picked Up', 'In Transit', 'Delivered', 'Canceled'
  ]), []);

  const statusDates = useMemo(() => ({
    'Pending': '01-01-2025', 'Preparing': '01-01-2025',
    'Shipped': '02-01-2025', 'Waiting Picked Up': '02-01-2025',
    'Picked Up': '03-01-2025', 'In Transit': '03-01-2025',
    'Delivered': '04-01-2025', 'Canceled': '05-01-2025'
  }), []);

  const statusesToDisplay = useMemo(() => {
    const currentStatusIndex = allStatuses.indexOf(localOrder.status);
    if (localOrder.status === 'Canceled') {
      const lastNormalStatusIndex = allStatuses.findIndex(s => s === localOrder.status);
      return allStatuses.slice(0, lastNormalStatusIndex + 1);
    }
    return allStatuses;
  }, [localOrder.status, allStatuses]);

  const getStatusCircleClass = useCallback((statusItem, currentOrderStatus) => {
    const statusOrderIndex = allStatuses.indexOf(statusItem);
    const currentOrderIndex = allStatuses.indexOf(currentOrderStatus);
    if (currentOrderStatus === 'Canceled' && statusItem === 'Canceled') {
      return 'bg-[#DC2626] border-[#DC2626]';
    } else if (statusOrderIndex <= currentOrderIndex && currentOrderStatus !== 'Canceled') {
      return 'bg-[#10B981] border-[#10B981]';
    }
    return 'bg-gray-300 border-gray-300';
  }, [allStatuses]);

  const getLineColorClass = useCallback((statusFrom, currentOrderStatus) => {
    const statusFromIndex = allStatuses.indexOf(statusFrom);
    const currentOrderIndex = allStatuses.indexOf(currentOrderStatus);
    if (currentOrderStatus === 'Canceled' && allStatuses[statusFromIndex + 1] === 'Canceled') {
      return 'bg-[#DC2626]';
    } else if (statusFromIndex < currentOrderIndex && currentOrderStatus !== 'Canceled') {
      return 'bg-[#10B981]';
    }
    return 'bg-gray-300';
  }, [allStatuses]);

  const handleDeliveryButtonClick = () => {
    if (localOrder.status === 'Shipped') {
      setShowDeliveryList(!showDeliveryList);
    }
  };

const selectDeliveryPerson = async (person) => {
  try {
    const res = await axios.post(`http://localhost:8000/api/orders/${localOrder.id}/assign-delivery`, {
      delivery_person_id: person.id,
    });

    const updatedDeliveryPerson = res.data.deliveryPerson;

    // Deep update the localOrder state
    setLocalOrder(prev => ({
      ...prev,
      deliveryPerson: updatedDeliveryPerson
    }));

    onAssignDelivery(localOrder.id, updatedDeliveryPerson);
    setShowDeliveryList(false);
  } catch (err) {
    console.error("Failed to assign delivery", err);
  }
};

  const randomDeliveryPeople = useMemo(() => {
    const shuffled = [...deliveryPeople].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [deliveryPeople]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100" style={{ animation: 'fadeInScale 0.3s ease-out' }}>
        <div className="flex justify-between items-center p-5 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#1F2937]">Order Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <HiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative flex justify-between items-center mb-8 px-2 sm:px-4 overflow-x-auto custom-scrollbar">
            {statusesToDisplay.map((statusItem, index) => (
              <React.Fragment key={statusItem}>
                <div className="flex flex-col items-center flex-shrink-0 mx-1 sm:mx-2 z-10 w-24">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 ${getStatusCircleClass(statusItem, localOrder.status)}`} />
                  <span className={`mt-2 text-center text-xs sm:text-sm font-medium whitespace-pre-line ${allStatuses.indexOf(statusItem) <= allStatuses.indexOf(localOrder.status) && localOrder.status !== 'Canceled' ? 'text-[#1F2937]' : statusItem === 'Canceled' && localOrder.status === 'Canceled' ? 'text-[#1F2937]' : 'text-gray-500'}`}>
                    {statusItem.replace(' ', '\n')}
                  </span>
                  <span className={`text-xs text-gray-500 ${statusDates[statusItem] ? '' : 'invisible'}`}>{statusDates[statusItem] || 'N/A'}</span>
                </div>
                {index < statusesToDisplay.length - 1 && (
                  <div className={`flex-1 h-1 ${getLineColorClass(statusItem, localOrder.status)} transition-colors duration-300`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="text-lg font-bold mb-4 text-[#1F2937]">Order Id: <span className="font-normal text-[#4B5563]">{localOrder.id}</span></p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#F9FAFB] p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3 text-[#1F2937]">Order Items</h3>
           {localOrder.items.map((item, index) => (
          <div key={index} className="flex items-center mb-4 space-x-3">
            {/* Product Image */}
            <img
              src={
                item?.product?.image
                  ? `http://localhost:8000/storage/${item.product.image}`
                  : 'https://placehold.co/40x40/E0E0E0/FFFFFF?text=P'
              }
              alt={item?.product?.name || 'Product'}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/40x40/E0E0E0/FFFFFF?text=P';
              }}
            />

            {/* Product Info */}
            <div>
              <p className="text-sm font-medium text-gray-800">{item.product?.name || 'Unnamed Product'}</p>
              <p className="text-xs text-gray-500">
                Seller: {item.product?.creator?.full_name || 'N/A'} (ID: {item.product?.created_by || 'N/A'})
              </p>
            </div>
          </div>
        ))}

            </div>

            <div className="bg-[#F9FAFB] p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3 text-[#1F2937]">Customer</h3>
              <p className="text-sm text-gray-700">{localOrder.user.full_name}</p>
              <p className="text-sm text-gray-500">Address: {localOrder.user.address}</p>
            </div>

            <div className="bg-[#F9FAFB] p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3 text-[#1F2937]">Payment</h3>
              <p className="text-sm text-gray-700">Status: {localOrder.payment.payment_status}</p>
              <p className="text-sm text-gray-700">Method: {localOrder.payment.payment_method}</p>
              <p className="text-sm text-gray-700">Total: ${localOrder.total_price}</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleDeliveryButtonClick}
              className={`py-2 px-4 mt-4 rounded-md text-white font-medium shadow-sm transition-colors duration-200 ${localOrder.status === 'Shipped' ? 'bg-[#047857] hover:bg-[#065F46]' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={localOrder.status !== 'Shipped'}
            >
              {localOrder.deliveryPerson ? 'Change Delivery Person' : 'Assign To Delivery'}
              <HiOutlineChevronDown className={`inline-block ml-2 w-4 h-4 transition-transform duration-200 ${showDeliveryList ? 'rotate-180' : ''}`} />
            </button>

            {showDeliveryList && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {randomDeliveryPeople.map((person) => (
                  <button
                    key={person.id}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => selectDeliveryPerson(person)}
                  >
                    {person.name} ({person.phone})
                  </button>
                ))}
              </div>
            )}

            {localOrder.deliveryPerson && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-2 text-[#1F2937]">Delivery Person</h3>
                <p className="text-sm text-[#4B5563]">
                  {localOrder.deliveryPerson.full_name} (ID: <span className="text-gray-500">{localOrder.deliveryPerson.id}</span>)
                </p>
                <p className="text-sm text-[#4B5563]">
                  Phone: <span className="text-gray-500">{localOrder.deliveryPerson.phone}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



// Edit Status Modal Component
const EditStatusModal = ({ order, currentStatus, onStatusChange, onSave, onClose, adminStatuses }) => {
  return (
    // Modal overlay
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Modal content container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100"
        style={{ animation: 'fadeInScale 0.3s ease-out' }}>
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#1F2937]">Edit Status</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <HiX className="h-6 w-6" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-[#4B5563] mb-2">Order ID: <span className="font-normal">{order.orderId}</span></label>
            <label htmlFor="status" className="block text-sm font-medium text-[#4B5563] mb-2">Select new status:</label>
            <select
              id="status"
              className="mt-1 block w-full py-2 px-3 border border-[#D1D5DB] bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#047857] focus:border-[#047857] sm:text-sm text-[#1F2937]"
              value={currentStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              {adminStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          {/* Modal Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-[#D1D5DB] text-sm font-medium text-[#4B5563] bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 rounded-md text-white text-sm font-medium bg-[#10B981] hover:bg-[#065F46] transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ orderId, onConfirm, onCancel }) => {
  return (
    // Modal overlay
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Modal content container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100"
        style={{ animation: 'fadeInScale 0.3s ease-out' }}>
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#1F2937]">Confirm Deletion</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <HiX className="h-6 w-6" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <p className="text-[#4B5563] mb-6">Are you sure you want to delete order <span className="font-semibold">{orderId}</span>? This action cannot be undone.</p>
          {/* Modal Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-[#D1D5DB] text-sm font-medium text-[#4B5563] bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md text-white text-sm font-medium bg-[#DC2626] hover:bg-[#B91C1C] transition-colors" // Red for delete action
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDashboard;
