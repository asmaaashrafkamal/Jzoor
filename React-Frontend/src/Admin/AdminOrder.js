import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { HiOutlinePlus, HiOutlineChevronDown, HiOutlineEye, HiOutlinePencil, HiOutlineTrash, HiX } from 'react-icons/hi';
import { GoSearch } from 'react-icons/go';
import { HiDotsVertical } from 'react-icons/hi';
// Assuming Title component is defined elsewhere or will be provided.
// For demonstration, a simple Title component is included here if not provided.
const Title = ({ title }) => <h1 className="text-3xl font-bold text-[#1F2937] mb-6 md:mb-0">{title}</h1>;


// Main Orders Dashboard Component
const OrdersDashboard = () => {
  // Dummy data for order dashboard cards (using useState for potential future dynamic updates)
  const [orderStats, setOrderStats] = useState({
    totalOrders: { value: '1,240', change: '14.4%', isPositive: true },
    newOrders: { value: '240', change: '20%', isPositive: true },
    completedOrders: { value: '960', change: '8%', isPositive: true },
    canceledOrders: { value: '87', change: '5%', isPositive: false },
  });

  // Dummy data for orders table
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderId: '#ORD0001',
      product: 'Apploido',
      date: '01-01-2025',
      price: '49.99',
      paymentMethod: 'Visa',
      status: 'Waiting Picked Up',
      customer: { name: 'Mariam Eqdaih', id: '#CU234', address: 'Palestine, Gaza, Al-Nusirat, 20 Street' },
      sellers: [{ name: 'Ahmad Bakir', id: '#Seller1234' }, { name: 'Huda Akram', id: '#Seller1234' }, { name: 'Admin', id: '#Seller1234' }],
      deliveryPerson: null, // Initially null
      items: [
        { name: 'Jasmine & Linen Set', price: 28.00, quantity: 2, img: 'https://placehold.co/40x40/FF7F50/FFFFFF?text=J' },
        { name: 'Olive Tree', price: 5.00, quantity: 1, img: 'https://placehold.co/40x40/8FBC8F/FFFFFF?text=O' },
        { name: 'Tetraat Mug', price: 35.00, quantity: 1, img: 'https://placehold.co/40x40/ADD8E6/FFFFFF?text=M' },
        { name: 'Tulip', price: 18.00, quantity: 1, img: 'https://placehold.co/40x40/FFB6C1/FFFFFF?text=T' },
      ],
      subtotal: 126,
      shippingCost: 0,
      discount: 0,
      total: 126,
      creditCard: '**** **** **** 5075',
    },
    { id: 2, orderId: '#ORD0002', product: 'Apploido', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Delivered', customer: { name: 'John Doe', id: '#CU235', address: '123 Main St, Anytown' }, sellers: [{ name: 'Jane Smith', id: '#Seller1235' }], items: [{ name: 'Item A', price: 10, quantity: 1 }], subtotal: 10, shippingCost: 2, discount: 0, total: 12, creditCard: '**** **** **** 1234', deliveryPerson: { name: 'Ali Hassan', id: '#DLVR235', phone: '0592123456' } },
    { id: 3, orderId: '#ORD0003', product: 'Apploido', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Preparing', customer: { name: 'Jane Doe', id: '#CU236', address: '456 Oak Ave, Somewhere' }, sellers: [{ name: 'Bob Johnson', id: '#Seller1236' }], items: [{ name: 'Item B', price: 20, quantity: 2 }], subtotal: 40, shippingCost: 5, discount: 0, total: 45, creditCard: '**** **** **** 5678', deliveryPerson: null },
    { id: 4, orderId: '#ORD0004', product: 'Apploido', date: '01-01-2025', price: '49.99', paymentMethod: 'Cash', status: 'Shipped', customer: { name: 'Alice Smith', id: '#CU237', address: '789 Pine Ln, Nowhere' }, sellers: [{ name: 'Charlie Brown', id: '#Seller1237' }], items: [{ name: 'Item C', price: 15, quantity: 3 }], subtotal: 45, shippingCost: 0, discount: 5, total: 40, creditCard: 'N/A', deliveryPerson: null },
    { id: 5, orderId: '#ORD0005', product: 'Apploido', date: '01-01-2025', price: '49.99', paymentMethod: 'Cash', status: 'Delivered', customer: { name: 'Bob White', id: '#CU238', address: '101 Elm St, Anywhere' }, sellers: [{ name: 'David Green', id: '#Seller1238' }], items: [{ name: 'Item D', price: 25, quantity: 1 }], subtotal: 25, shippingCost: 3, discount: 0, total: 28, creditCard: 'N/A', deliveryPerson: { name: 'Layla Mahmoud', id: '#DLVR238', phone: '0592901234' } },
    { id: 6, orderId: '#ORD0006', product: 'Apploido', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Canceled', customer: { name: 'Eve Black', id: '#CU239', address: '202 Birch Rd, Somewhere Else' }, sellers: [{ name: 'Frank Blue', id: '#Seller1239' }], items: [{ name: 'Item E', price: 30, quantity: 2 }], subtotal: 60, shippingCost: 0, discount: 10, total: 50, creditCard: '**** **** **** 9012', deliveryPerson: null },
    { id: 7, orderId: '#ORD0007', product: 'Apploido', date: '01-01-2025', price: '49.99', paymentMethod: 'Cash', status: 'Shipped', customer: { name: 'Grace Green', id: '#CU240', address: '303 Cedar Dr, Everywhere' }, sellers: [{ name: 'Hannah Purple', id: '#Seller1240' }], items: [{ name: 'Item F', price: 5, quantity: 5 }], subtotal: 25, shippingCost: 1, discount: 0, total: 26, creditCard: 'N/A', deliveryPerson: { name: 'Khaled Amer', id: '#DLVR240', phone: '0592234567' } },
    { id: 8, orderId: '#ORD0008', product: 'Apploido', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Delivered', customer: { name: 'Ivan Red', id: '#CU241', address: '404 Willow Ct, Anyplace' }, sellers: [{ name: 'Judy Orange', id: '#Seller1241' }], items: [{ name: 'Item G', price: 40, quantity: 1 }], subtotal: 40, shippingCost: 0, discount: 0, total: 40, creditCard: '**** **** **** 3456', deliveryPerson: { name: 'Mona Fahed', id: '#DLVR241', phone: '0592890123' } },
    { id: 9, orderId: '#ORD0009', product: 'Apploido', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Shipped', customer: { name: 'Kevin White', id: '#CU242', address: '505 Maple Ave, Someplace' }, sellers: [{ name: 'Liam Black', id: '#Seller1242' }], items: [{ name: 'Item H', price: 12, quantity: 2 }], subtotal: 24, shippingCost: 4, discount: 0, total: 28, creditCard: '**** **** **** 7890', deliveryPerson: null },
    { id: 10, orderId: '#ORD0010', product: 'Apploido', date: '01-01-2025', price: '49.99', paymentMethod: 'Visa', status: 'Preparing', customer: { name: 'Mia Green', id: '#CU243', address: '606 Spruce St, Nowhere Fast' }, sellers: [{ name: 'Noah Brown', id: '#Seller1243' }], items: [{ name: 'Item I', price: 8, quantity: 3 }], subtotal: 24, shippingCost: 0, discount: 2, total: 22, creditCard: '**** **** **** 1098', deliveryPerson: null },
    { id: 11, orderId: '#ORD0011', product: 'Product X', date: '01-02-2025', price: '25.00', paymentMethod: 'PayPal', status: 'Pending', customer: { name: 'Olivia Gray', id: '#CU244', address: '707 Poplar Ln, Just Here' }, sellers: [{ name: 'Peter White', id: '#Seller1244' }], items: [{ name: 'Item J', price: 70, quantity: 1 }], subtotal: 70, shippingCost: 5, discount: 0, total: 75, creditCard: 'N/A', deliveryPerson: null },
    { id: 12, orderId: '#ORD0012', product: 'Product Y', date: '01-03-2025', price: '75.50', paymentMethod: 'Credit Card', status: 'Delivered', customer: { name: 'Quinn Blue', id: '#CU245', address: '808 Fir Ave, Way Out' }, sellers: [{ name: 'Rachel Red', id: '#Seller1245' }], items: [{ name: 'Item K', price: 15, quantity: 1 }], subtotal: 15, shippingCost: 0, discount: 0, total: 15, creditCard: '**** **** **** 2345', deliveryPerson: { name: 'Sara Kamal', id: '#DLVR245', phone: '0592345678' } },
    { id: 13, orderId: '#ORD0013', product: 'Product Z', date: '01-04-2025', price: '120.00', paymentMethod: 'Bank Transfer', status: 'Canceled', customer: { name: 'Sam Yellow', id: '#CU246', address: '909 Palm St, Near Here' }, sellers: [{ name: 'Tina Green', id: '#Seller1246' }], items: [{ name: 'Item L', price: 200, quantity: 1 }], subtotal: 200, shippingCost: 10, discount: 20, total: 190, creditCard: 'N/A', deliveryPerson: null },
    { id: 14, orderId: '#ORD0014', product: 'Apploido', date: '01-05-2025', price: '30.00', paymentMethod: 'Visa', status: 'Shipped', customer: { name: 'Uma Brown', id: '#CU247', address: '111 Sycamore Ln, The Place' }, sellers: [{ name: 'Victor Orange', id: '#Seller1247' }], items: [{ name: 'Item M', price: 50, quantity: 1 }], subtotal: 50, shippingCost: 0, discount: 0, total: 50, creditCard: '**** **** **** 6789', deliveryPerson: null },
    { id: 15, orderId: '#ORD0015', product: 'Widget A', date: '01-06-2025', price: '15.00', paymentMethod: 'Cash', status: 'Preparing', customer: { name: 'Will White', id: '#CU248', address: '222 Cedar Rd, Elsewhere' }, sellers: [{ name: 'Xavier Black', id: '#Seller1248' }], items: [{ name: 'Item N', price: 5, quantity: 10 }], subtotal: 50, shippingCost: 2, discount: 0, total: 52, creditCard: 'N/A', deliveryPerson: null },
    { id: 16, orderId: '#ORD0016', product: 'Gadget B', date: '01-07-2025', price: '60.00', paymentMethod: 'PayPal', status: 'Delivered', customer: { name: 'Yara Green', id: '#CU249', address: '333 Elm Ct, Over There' }, sellers: [{ name: 'Zara Blue', id: '#Seller1249' }], items: [{ name: 'Item O', price: 90, quantity: 1 }], subtotal: 90, shippingCost: 0, discount: 0, total: 90, creditCard: 'N/A', deliveryPerson: { name: 'Huda Majed', id: '#DLVR249', phone: '0592765432' } },
    { id: 17, orderId: '#ORD0017', product: 'Tool C', date: '01-08-2025', price: '90.00', paymentMethod: 'Visa', status: 'Pending', customer: { name: 'Adam Gold', id: '#CU250', address: '444 Pine St, All Around' }, sellers: [{ name: 'Betty Silver', id: '#Seller1250' }], items: [{ name: 'Item P', price: 30, quantity: 2 }], subtotal: 60, shippingCost: 5, discount: 0, total: 65, creditCard: '**** **** **** 8765', deliveryPerson: null },
    { id: 18, orderId: '#ORD0018', product: 'Accessory D', date: '01-09-2025', price: '5.00', paymentMethod: 'Cash', status: 'Canceled', customer: { name: 'Chris Bronze', id: '#CU251', address: '555 Oak Dr, Not Here' }, sellers: [{ name: 'Diana Platinum', id: '#Seller1251' }], items: [{ name: 'Item Q', price: 10, quantity: 1 }], subtotal: 10, shippingCost: 0, discount: 0, total: 10, creditCard: 'N/A', deliveryPerson: null },
  ]);

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
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()); // Added customer name to search

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
    setSelectedOrder(order);
    setNewStatus(order.status); // Pre-fill modal with current status
    setShowEditStatusModal(true);
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setShowDeleteConfirmationModal(true);
  };

  // Confirms deletion of an order
  const confirmDelete = () => {
    setOrders(orders.filter(order => order.id !== selectedOrder.id));
    setShowDeleteConfirmationModal(false);
    setSelectedOrder(null); // Clear selected order
  };

  // Saves the new status of an order
  const saveStatus = () => {
    setOrders(orders.map(order =>
      order.id === selectedOrder.id ? { ...order, status: newStatus } : order
    ));
    setShowEditStatusModal(false);
    setSelectedOrder(null); // Clear selected order
    setNewStatus(''); // Reset new status
  };

  // Assigns a delivery person to an order
  const handleAssignDelivery = (orderId, deliveryPerson) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, deliveryPerson: deliveryPerson } : order
      )
    );
    // Update selectedOrder if the modal is open and this is the order being viewed
    setSelectedOrder(prevSelectedOrder =>
      prevSelectedOrder && prevSelectedOrder.id === orderId
        ? { ...prevSelectedOrder, deliveryPerson: deliveryPerson }
        : prevSelectedOrder
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

  return (
    // Main dashboard container with padding and background color
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
                currentOrders.map((order) => {
                  const statusColors = getStatusColor(order.status); // Get colors dynamically
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        <input type="checkbox" className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-[#047857] text-[#047857]" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{order.id}.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{order.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        <div className="flex items-center">
                          {/* Product image - using placeholder.co */}
                          {order.product === 'Apploido' ? (
                            <img src="https://placehold.co/24x24/3B82F6/FFFFFF?text=A" alt="Apploido" className="w-6 h-6 rounded-full mr-2" />
                          ) : (
                            <img src="https://placehold.co/24x24/E0E0E0/FFFFFF?text=P" alt="Product" className="w-6 h-6 rounded-full mr-2" />
                          )}
                          {order.product}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">${order.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{order.paymentMethod}</td>
                      {/* Status Pill */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                          style={{
                            backgroundColor: statusColors.bg,
                            color: statusColors.text,
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      {/* Action Buttons (View, Edit, Delete) */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-[#6B7280] hover:text-[#2563EB]" // Blue on hover
                            title="View Details"
                            onClick={() => handleViewDetails(order)}
                          >
                            <HiOutlineEye className="h-5 w-5" />
                          </button>
                          <button
                            className="text-[#6B7280] hover:text-[#F59E0B]" // Amber on hover
                            title="Edit Status"
                            onClick={() => handleEditStatus(order)}
                          >
                            <HiOutlinePencil className="h-5 w-5" />
                          </button>
                          <button
                            className="text-[#6B7280] hover:text-[#DC2626]" // Red on hover
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
          order={selectedOrder}
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
          orderId={selectedOrder.orderId}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirmationModal(false)}
        />
      )}
    </div>
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
    <p className="text-xs mt-2 text-[#6B7280]">Last 7 days</p>
  </div>
);

// Dummy data for delivery personnel
const deliveryPeople = [
  { name: 'Mohammed Ahmad', id: '#DLVR234', phone: '0592988762' },
  { name: 'Ali Hassan', id: '#DLVR235', phone: '0592123456' },
  { name: 'Fatima Omar', id: '#DLVR236', phone: '0592789012' },
  { name: 'Sami Khalid', id: '#DLVR237', phone: '0592345678' },
  { name: 'Layla Mahmoud', id: '#DLVR238', phone: '0592901234' },
  { name: 'Nour Safi', id: '#DLVR239', phone: '0592567890' },
  { name: 'Khaled Amer', id: '#DLVR240', phone: '0592234567' },
  { name: 'Mona Fahed', id: '#DLVR241', phone: '0592890123' },
];

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose, onAssignDelivery }) => {
  const [showDeliveryList, setShowDeliveryList] = useState(false);

  // All possible statuses in their logical order for the tracker
  const allStatuses = useMemo(() => ([
    'Pending',
    'Preparing',
    'Shipped',
    'Waiting Picked Up',
    'Picked Up',
    'In Transit',
    'Delivered',
    'Canceled'
  ]), []);

  // Placeholder for status dates. In a real app, these would come from order.statusHistory or a similar backend source.
  const statusDates = useMemo(() => ({
    'Pending': '01-01-2025',
    'Preparing': '01-01-2025',
    'Shipped': '02-01-2025',
    'Waiting Picked Up': '02-01-2025',
    'Picked Up': '03-01-2025',
    'In Transit': '03-01-2025',
    'Delivered': '04-01-2025',
    'Canceled': '05-01-2025'
  }), []);

  // Determine the statuses to display in the tracker based on the order's current status
  const statusesToDisplay = useMemo(() => {
    const currentStatusIndex = allStatuses.indexOf(order.status);
    if (order.status === 'Canceled') {
      // If canceled, show statuses up to the point of cancellation + Canceled status
      // Find the last status before 'Canceled' in the ordered list
      const lastNormalStatusIndex = allStatuses.findIndex(s => s === order.status) ; // Finds the index of 'Canceled'
      const relevantStatuses = allStatuses.slice(0, lastNormalStatusIndex + 1); // Include Canceled
      return relevantStatuses;
    }
    // For non-canceled orders, show all statuses up to and including the current status
    // and then all remaining statuses as gray. No filtering needed besides general flow.
    return allStatuses;
  }, [order.status, allStatuses]);


  // Determine the color class for each status circle
  const getStatusCircleClass = useCallback((statusItem, currentOrderStatus) => {
    const statusOrderIndex = allStatuses.indexOf(statusItem);
    const currentOrderIndex = allStatuses.indexOf(currentOrderStatus);

    if (currentOrderStatus === 'Canceled' && statusItem === 'Canceled') {
      return 'bg-[#DC2626] border-[#DC2626]'; // Red for the 'Canceled' circle if order is canceled
    } else if (statusOrderIndex <= currentOrderIndex && currentOrderStatus !== 'Canceled') {
      return 'bg-[#10B981] border-[#10B981]'; // Green for completed/current in normal flow
    }
    return 'bg-gray-300 border-gray-300'; // Gray for future or irrelevant statuses
  }, [allStatuses]);

  // Determine the color class for the lines between status circles
  const getLineColorClass = useCallback((statusFrom, currentOrderStatus) => {
    const statusFromIndex = allStatuses.indexOf(statusFrom);
    const currentOrderIndex = allStatuses.indexOf(currentOrderStatus);

    if (currentOrderStatus === 'Canceled' && allStatuses[statusFromIndex + 1] === 'Canceled') {
      return 'bg-[#DC2626]'; // Red line if the order is canceled and this line leads to 'Canceled'
    } else if (statusFromIndex < currentOrderIndex && currentOrderStatus !== 'Canceled') {
      return 'bg-[#10B981]'; // Green line for paths already completed in normal flow
    }
    return 'bg-gray-300'; // Gray for future lines
  }, [allStatuses]);


  // Handler for "Assign to Delivery" button click
  const handleDeliveryButtonClick = () => {
    // Only allow showing the list if the order status is 'Shipped'
    if (order.status === 'Shipped') {
      setShowDeliveryList(!showDeliveryList);
    }
  };

  // Handler for selecting a delivery person from the list
  const selectDeliveryPerson = (person) => {
    onAssignDelivery(order.id, person); // Call parent handler to update order
    setShowDeliveryList(false); // Close the delivery list
  };

  // Memoized random selection of delivery people for the dropdown
  const randomDeliveryPeople = useMemo(() => {
    const shuffled = [...deliveryPeople].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4); // Show only 4 random delivery people
  }, []); // Empty dependency array ensures this runs only once

  return (
    // Modal overlay for background dimming and centering
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
      {/* Modal content container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100"
        style={{ animation: 'fadeInScale 0.3s ease-out' }}> {/* CSS animation for fade-in effect */}
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#1F2937]">Order Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <HiX className="h-6 w-6" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          {/* Status Tracker */}
          {/* Added min-w-max to ensure content is not squished and allows horizontal scroll */}
          {/* Custom scrollbar styles are inlined for direct application */}
          <div className="relative flex justify-between items-center mb-8 px-2 sm:px-4 overflow-x-auto custom-scrollbar">
            {statusesToDisplay.map((statusItem, index) => (
              <React.Fragment key={statusItem}>
                <div className="flex flex-col items-center flex-shrink-0 mx-1 sm:mx-2 z-10 w-24"> {/* Adjusted width for better spacing */}
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold transition-colors duration-300 border-2
                    ${getStatusCircleClass(statusItem, order.status)}`}
                  >
                  </div>
                  <span className={`mt-2 text-center text-xs sm:text-sm font-medium whitespace-pre-line ${ // Use whitespace-pre-line for wrapping
                      allStatuses.indexOf(statusItem) <= allStatuses.indexOf(order.status) && order.status !== 'Canceled' ? 'text-[#1F2937]' :
                      statusItem === 'Canceled' && order.status === 'Canceled' ? 'text-[#1F2937]' : 'text-gray-500'
                    }`}>
                    {statusItem.replace(' ', '\n')} {/* Break long status names for display */}
                  </span>
                  <span className={`text-xs text-gray-500 ${
                    statusDates[statusItem] ? '' : 'invisible' // Hide date if not available
                  }`}>{statusDates[statusItem] || 'N/A'}</span>
                </div>
                {/* Render line between circles, but not after the last circle */}
                {index < statusesToDisplay.length - 1 && (
                  <div className={`flex-1 h-1 ${getLineColorClass(statusItem, order.status)} transition-colors duration-300`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Inlined CSS for custom scrollbar within the modal for better cross-browser consistency */}
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
            @keyframes fadeInScale {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>

          <p className="text-lg font-bold mb-4 text-[#1F2937]">Order Id: <span className="font-normal text-[#4B5563]">{order.orderId}</span></p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="bg-[#F9FAFB] p-4 rounded-lg shadow-sm"> {/* Light gray background for sections */}
              <h3 className="font-semibold mb-3 text-[#1F2937]">{order.items.length} Items</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center mb-3 last:mb-0">
                  <img src={item.img} alt={item.name} className="w-10 h-10 rounded-md object-cover mr-3 border border-[#E5E7EB]" />
                  <div>
                    <p className="text-sm font-medium text-[#1F2937]">{item.name}</p>
                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} | {item.quantity} {item.quantity > 1 ? 'items' : 'item'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Details */}
            <div className="bg-[#F9FAFB] p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3 text-[#1F2937]">Customer Details</h3>
              <p className="text-sm font-medium text-[#1F2937]">{order.customer.name} (ID: <span className="text-gray-500">{order.customer.id}</span>)</p>
              <p className="text-sm text-gray-500 mt-1">{order.customer.address}</p>

              <h3 className="font-semibold mt-4 mb-3 text-[#1F2937]">Sold by:</h3>
              {order.sellers.map((seller, index) => (
                <p key={index} className="text-sm text-gray-500">{seller.name} (ID: {seller.id})</p>
              ))}
            </div>

            {/* Payment Details */}
            <div className="bg-[#F9FAFB] p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3 text-[#1F2937]">Payment Details</h3>
              <div className="flex justify-between text-sm text-[#4B5563] mb-1">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#4B5563] mb-1">
                <span>Shipping Cost</span>
                <span>{order.shippingCost === 0 ? 'Free!' : `$${order.shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-[#4B5563] mb-3">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3 border-[#E5E7EB] text-[#1F2937]">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>

              <h3 className="font-semibold mt-4 mb-3 text-[#1F2937]">Payment Method:</h3>
              <div className="flex items-center justify-between text-sm text-[#4B5563]">
                <span>{order.paymentMethod}</span>
                {order.paymentMethod === 'Visa' && (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/47/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                )}
                {order.paymentMethod === 'PayPal' && (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
                )}
                {/* Add other payment method icons if needed */}
              </div>
              {order.creditCard !== 'N/A' && (
                <p className="text-sm text-gray-500 mt-1">{order.creditCard}</p>
              )}


              {/* Conditional button based on status for delivery assignment */}
              <div className="relative mt-4">
                <button
                  onClick={handleDeliveryButtonClick}
                  // Only enable if status is 'Shipped' and no delivery person assigned yet
                  // Or if a delivery person is assigned, allow changing it
                  disabled={order.status !== 'Shipped' && !order.deliveryPerson}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium shadow-sm transition-colors duration-200
                    ${order.status === 'Shipped' || order.deliveryPerson // Allow if shipped or already has delivery
                      ? 'bg-[#047857] hover:bg-[#065F46]'
                      : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  {order.deliveryPerson ? 'Change Delivery Person' : 'Assign To Delivery'}
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
              </div>

              {order.deliveryPerson && (
                <div className="mt-4 border-t pt-4 border-[#E5E7EB]">
                  <h3 className="font-semibold mb-2 text-[#1F2937]">Delivery Person:</h3>
                  <p className="text-sm text-[#4B5563]">{order.deliveryPerson.name} (ID: <span className="text-gray-500">{order.deliveryPerson.id}</span>)</p>
                  <p className="text-sm text-[#4B5563]">Phone: <span className="text-gray-500">{order.deliveryPerson.phone}</span></p>
                </div>
              )}
            </div>
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
