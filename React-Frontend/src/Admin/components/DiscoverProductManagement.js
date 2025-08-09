import React, { useState, useMemo, useCallback,useEffect } from 'react';
import { Link, useNavigate }  from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

// Helper component for displaying Title (re-defined here for self-containment)
const Title = ({ title }) => <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>;

// Inline SVG Icons (replacing react-icons/fa)
const IconPlus = ({ className = '', onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} onClick={onClick}>
    <path d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z" />
  </svg>
);

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


// Common Modal Component for View, Edit, Delete Confirmation
const ProductModal = ({ isOpen, onClose, product, mode, onSave, onDeleteConfirm }) => {
      const [formData, setFormData] = useState({
    id: '',
    product: '',
    qty: '',
    price: '',
    status: '',
    stock_status: '',
  });

  const [name, setName] = useState(product?.product || '');
  const [price, setPrice] = useState(product?.price || '');
  const [qty, setQty] = useState(product?.qty || '');
  const [status, setStatus] = useState(product?.status || '');
  const [stock_status, setStockStatus] = useState(product?.stock_status || '');


  // Update form fields when product changes (e.g., when editing a new product)
  React.useEffect(() => {
    if (product) {
      setName(product.product);
      setPrice(product.price);
      setQty(product.qty);
      setStatus(product.status);
      setStockStatus(product.stock_status);
    }
  }, [product]);

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isDeleteConfirmMode = mode === 'deleteConfirm';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      onSave({ ...product, product: name, price, qty: parseInt(qty, 10), status,stock_status });
    }
  };

//   const statusOptions = product?.tableType === 'seller' ? ['Pending', 'Rejected','Accepted'] : ['In Stock', 'Out of Stock'];
const statusOptions = product?.tableType === 'seller'
  ? ['Pending', 'Accepted', 'Rejected']
  : ['In Stock', 'Out of Stock'];


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-scaleIn">
        {isDeleteConfirmMode ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete product "<span className="font-semibold">{product?.product}</span>"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
              type="button"
              onClick={onDeleteConfirm}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {isViewMode ? 'Product Details' : 'Edit Product'}
            </h2>
   <form onSubmit={handleSubmit}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    {/* Product ID */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Product ID</label>
      <input
        type="text"
        value={product?.id || ''}
        readOnly
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
      />
    </div>

    {/* Product Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Product Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        readOnly={isViewMode}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        required
      />
    </div>

    {/* Date */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="text"
        value={product?.date || ''}
        readOnly
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
      />
    </div>

    {/* Price */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Price</label>
      <input
        type="number"
        value={product.price}
        onChange={(e) => setPrice(e.target.value)}
        readOnly={isViewMode}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        required
      />
    </div>

    {/* Quantity */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Quantity</label>
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        readOnly={isViewMode}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        required
      />
    </div>

    {/* Status */}
    {product?.tableType === 'seller' && (
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
            {['Pending', 'Rejected', 'Accepted'].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>
    )}

    {/* Stock Status */}
    {product?.tableType !== 'seller' && (
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock Status</label>
        {isViewMode ? (
          <input
            type="text"
            value={stock_status}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
          />
        ) : (
          <select
            value={stock_status}
            onChange={(e) => setStockStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            required
          >
            {['In Stock', 'Out of Stock'].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>
    )}
  </div>

  {/* Footer Buttons */}
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


export function DiscoverProductManagement() {
  const [activeTab, setActiveTab] = useState('All'); // For Seller Products table filter
  const [activeProductTab, setActiveProductTab] = useState('All Product'); // For Stock Products table filter
  const [searchTerm, setSearchTerm] = useState(''); // Unified search term for both tables
  const navigate = useNavigate();
  // State for modal management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [modalMode, setModalMode] = useState(''); // 'view', 'edit', 'deleteConfirm'

  // Dummy data for "Accept Sellers Orders To Add There Products!" table
//   const [sellerProducts, setSellerProducts] = useState([
//     { no: 1, id: '#DRD0001', product: 'Asphodel', date: '01-01-2025', price: '49.99', qty: 20, status: 'Rejected' },
//     { no: 2, id: '#DRD0002', product: 'Product B', date: '01-05-2025', price: '29.00', qty: 15, status: 'Pending' },
//     { no: 3, id: '#DRD0003', product: 'Product C', date: '01-10-2025', price: '75.50', qty: 30, status: 'Rejected' },
//     { no: 4, id: '#DRD0004', product: 'Product D', date: '01-15-2025', price: '12.25', qty: 5, status: 'Pending' },
//     { no: 5, id: '#DRD0005', product: 'Product E', date: '01-20-2025', price: '99.99', qty: 10, status: 'Rejected' },
//     { no: 6, id: '#DRD0006', product: 'Product F', date: '01-25-2025', price: '5.75', qty: 50, status: 'Pending' },
//     { no: 7, id: '#DRD0007', product: 'Product G', date: '01-30-2025', price: '60.00', qty: 22, status: 'Rejected' },
//     { no: 8, id: '#DRD0008', product: 'Product H', date: '02-01-2025', price: '19.99', qty: 18, status: 'Pending' },
//     { no: 9, id: '#DRD0009', product: 'Product I', date: '02-05-2025', price: '88.00', qty: 7, status: 'Rejected' },
//     { no: 10, id: '#DRD0010', product: 'Product J', date: '02-10-2025', price: '34.50', qty: 25, status: 'Pending' },
//     { no: 11, id: '#DRD0011', product: 'Product K', date: '02-15-2025', price: '14.00', qty: 12, status: 'Rejected' },
//     { no: 12, id: '#DRD0012', product: 'Product L', date: '02-20-2025', price: '7.99', qty: 40, status: 'Pending' },
//     { no: 13, id: '#DRD0013', product: 'Product M', date: '02-25-2025', price: '50.00', qty: 10, status: 'Pending' },
//     { no: 14, id: '#DRD0014', product: 'Product N', date: '03-01-2025', price: '25.00', qty: 5, status: 'Rejected' },
//     { no: 15, id: '#DRD0015', product: 'Product O', date: '03-05-2025', price: '70.00', qty: 18, status: 'Pending' },
//     { no: 16, id: '#DRD0016', product: 'Product P', date: '03-10-2025', price: '10.00', qty: 30, status: 'Rejected' },
//   ]);
  const [sellerProducts, setSellerProducts] = useState([]);
useEffect(() => {
  axios.get(`http://localhost:8000/api/AdminsellerProducts`)
    .then((response) => {
      setSellerProducts(response.data); // flat product array with seller_name
    })
    .catch((error) => {
      console.error("Error fetching products", error);
    });
}, []);

  // Dummy data for "Check And Edit Stock Status" table
//   const [stockProducts, setStockProducts] = useState([
//     { no: 1, id: '#STK0001', product: 'Gaming Mouse', date: '03-01-2025', price: '55.00', qty: 150, status: 'Available' },
//     { no: 2, id: '#STK0002', product: 'Mechanical Keyboard', date: '03-05-2025', price: '120.00', qty: 0, status: 'Out of stock' },
//     { no: 3, id: '#STK0003', product: 'USB-C Hub', date: '03-10-2025', price: '35.00', qty: 75, status: 'Available' },
//     { no: 4, id: '#STK0004', product: 'Webcam 1080p', date: '03-15-2025', price: '45.00', qty: 0, status: 'Out of stock' },
//     { no: 5, id: '#STK0005', product: 'Noise Cancelling Headphones', date: '03-20-2025', price: '199.99', qty: 30, status: 'Available' },
//     { no: 6, id: '#STK0006', product: 'Portable SSD 1TB', date: '03-25-2025', price: '89.99', qty: 100, status: 'Available' },
//     { no: 7, id: '#STK0007', product: 'Ergonomic Chair', date: '03-30-2025', price: '250.00', qty: 0, status: 'Out of stock' },
//     { no: 8, id: '#STK0008', product: 'Monitor 27-inch', date: '04-01-2025', price: '299.00', qty: 20, status: 'Available' },
//     { no: 9, id: '#STK0009', product: 'Smart Speaker', date: '04-05-2025', price: '70.00', qty: 0, status: 'Out of stock' },
//     { no: 10, id: '#STK0010', product: 'Fitness Tracker', date: '04-10-2025', price: '60.00', qty: 90, status: 'Available' },
//     { no: 11, id: '#STK0011', product: 'Graphics Card', date: '04-15-2025', price: '300.00', qty: 10, status: 'Available' },
//     { no: 12, id: '#STK0012', product: 'CPU Cooler', date: '04-20-2025', price: '70.00', qty: 0, status: 'Out of stock' },
//   ]);
  const [stockProducts, setStockProducts] = useState([ ]);

  const handleCategoryClick = (catId) => {
      navigate(`/ProductList/${catId}`);
    };
useEffect(() => {
  let isMounted = true;

  fetch("http://localhost:8000/getAllProduct")
    .then(res => res.json())
    .then(data => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        const transformed = data.map((item, index) => ({
          no: index + 1,
          id: item.id || `#STKNEW${index + 1}`,
          product: item.name || 'Unnamed Product',
          date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
          price: item.price || '0.00',
          qty: item.stock_quantity || 0,
          stock_status:item.stock_status,
          status:item.status,
        }));
        setStockProducts(transformed);
      }
    })
    .catch(err => {
      console.error("Failed to fetch products, using static fallback:", err);
      // keep using the static stockProducts
    });

  return () => {
    isMounted = false;
  };
}, []);

  const getStatusClasses = useCallback((status) => {
   switch (status) {
  case 'Rejected':
    return 'bg-[#fee2e2] text-[#dc2626]'; // bg-red-100, text-red-600
  case 'Pending':
    return 'bg-[#fef9c3] text-[#ca8a04]'; // bg-yellow-100, text-yellow-600
  case 'In Stock':
    return 'bg-[#dbeafe] text-[#2563eb]'; // bg-blue-100, text-blue-600
  case 'Out of Stock':
    return 'bg-[#fee2e2] text-[#dc2626]'; // same as Rejected
  default:
    return 'bg-[#f3f4f6] text-[#374151]'; // bg-gray-100, text-gray-700
}

  }, []);

  // Filter and Search Logic for Seller Products
const filteredAndSearchedSellerProducts = useMemo(() => {
  return (sellerProducts || []).filter(item => {
    const product = item.product?.toLowerCase() || '';
    const status = item.status?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    const active = activeTab.toLowerCase();

    const matchesSearch = product.includes(search) || status.includes(search);
    const matchesTab = active === 'all' || status === active;

    return matchesSearch && matchesTab;
  });
}, [sellerProducts, activeTab, searchTerm]);

  // Filter and Search Logic for Stock Products
const filteredAndSearchedStockProducts = useMemo(() => {
  return stockProducts.filter(item => {
    const product = item?.product?.toLowerCase() || '';
    const status = item?.status?.toLowerCase() || '';
    const matchesSearch = product.includes(searchTerm.toLowerCase()) ||
                          status.includes(searchTerm.toLowerCase());

    const matchesTab =
      activeProductTab === 'All Product' ||
      (activeProductTab === 'Out of Stock' && status === 'out of stock') ||
      (activeProductTab === 'Featured Products' && false) || // Placeholder
      (activeProductTab === 'On Sale' && false);             // Placeholder

    return matchesSearch && matchesTab;
  });
}, [stockProducts, activeProductTab, searchTerm]);

  // Pagination Logic
  const itemsPerPage = 10;
  const [currentPageSeller, setCurrentPageSeller] = useState(1);
  const [currentPageStock, setCurrentPageStock] = useState(1);

  const totalPagesSeller = Math.ceil(filteredAndSearchedSellerProducts.length / itemsPerPage);
  const currentSellerProducts = filteredAndSearchedSellerProducts.slice(
    (currentPageSeller - 1) * itemsPerPage,
    currentPageSeller * itemsPerPage
  );

  const totalPagesStock = Math.ceil(filteredAndSearchedStockProducts.length / itemsPerPage);
  const currentStockProducts = filteredAndSearchedStockProducts.slice(
    (currentPageStock - 1) * itemsPerPage,
    currentPageStock * itemsPerPage
  );

  const renderPaginationButtons = useCallback((totalPages, currentPage, setCurrentPage) => {
    const pages = [];
    const maxPagesToShow = 5; // Adjust as needed for responsive design

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
      pages.push(
        <button
          key={1}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === 1 ? 'bg-[rgb(4,120,87)] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis-start" className="px-1 py-2 text-gray-700 text-sm">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === i ? 'bg-[rgb(4,120,87)] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis-end" className="px-1 py-2 text-gray-700 text-sm">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === totalPages ? 'bg-[rgb(4,120,87)] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  }, []);

  // Handlers for modal actions
  const handleViewProduct = useCallback((product, tableType) => {
    setModalProduct({ ...product, tableType }); // Add tableType to know which array to modify
    setModalMode('view');
    setIsModalOpen(true);
  }, []);

  const handleEditProduct = useCallback((product, tableType) => {
    setModalProduct({ ...product, tableType });
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleDeleteProductClick = useCallback((product, tableType) => {
    setModalProduct({ ...product, tableType });
    setModalMode('deleteConfirm');
    setIsModalOpen(true);
  }, []);

  const confirmDeleteProduct = useCallback(async () => {
  if (!modalProduct) return;

  try {
   const code1 = String(modalProduct.id);  // Ensures it's a string
   const id1 = parseInt(code1.replace(/\D/g, ''), 10);
if (!isNaN(id1)) {

    await axios.delete(`http://localhost:8000/api/products/${id1}`);

    toast.success('Product deleted successfully');

    if (modalProduct.tableType === 'seller') {
      setSellerProducts(prev => prev.filter(p => p.id !== modalProduct.id));
      if (currentSellerProducts.length === 1 && currentPageSeller > 1) {
        setCurrentPageSeller(prev => prev - 1);
      }
    } else if (modalProduct.tableType === 'stock') {
      setStockProducts(prev => prev.filter(p => p.id !== modalProduct.id));
      if (currentStockProducts.length === 1 && currentPageStock > 1) {
        setCurrentPageStock(prev => prev - 1);
      }
    }}else{
  console.error('Invalid product ID format:', code1);

    }

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to delete product');
  }

  setIsModalOpen(false);
  setModalProduct(null);
}, [
  modalProduct,
  currentSellerProducts.length,
  currentPageSeller,
  currentStockProducts.length,
  currentPageStock,
]);

const formatId = (id) => `#DRD${String(id).padStart(4, '0')}`;
const formatId1 = (id) => `#STC${String(id).padStart(4, '0')}`;
const handleSaveProduct = useCallback(async (updatedProduct) => {
  try {
    const code = String(updatedProduct.id); // e.g. "#DRD0001"
    const id = parseInt(code.replace('#DRD', ''), 10); // → 1

    const response = await axios.put(`http://localhost:8000/api/products/${id}`, updatedProduct);
    const saved = response.data.product;

    const formattedProduct = {
      no: updatedProduct.no,
      id: formatId(saved.id),
      product: saved.product,
      qty: saved.qty,
      price: saved.price,
      status: saved.status,
      stock_status: saved.stock_status,
      date: new Date(saved.date).toLocaleDateString(),
      tableType: updatedProduct.tableType,
    };

const isMatch1 = (p, id) => p.id === formatId(id); // ✅ FIXED
    const isMatch = (p, id) => formatId(p.id) === formatId(id); // ✅ format both sides

    if (updatedProduct.tableType === 'seller') {
if (String(saved.status).toLowerCase() === 'accepted') {
  setSellerProducts(prev => prev.filter(p => !isMatch1(p, saved.id)));
formattedProduct.tableType='stock';
formattedProduct.id=saved.id;
formattedProduct.no= formatId1(saved.id);
  const movedProduct = {
    ...formattedProduct,
    // no: formatId1(saved.id), // change ID format if needed
    // tableType: 'stock',
  };
console.log(formattedProduct);
  setStockProducts(prev => [...prev, movedProduct]);
}
if (String(saved.status).toLowerCase() === 'pending' || String(saved.status).toLowerCase() === 'rejected') {

     console.log(formattedProduct);
     formattedProduct.no=formatId(formattedProduct.no)
      setSellerProducts((prev) =>
      prev.map((p) => (p.id === formattedProduct.id ? formattedProduct : p))
    );
}
    } else if (updatedProduct.tableType === 'stock') {
     console.log(formattedProduct);
     formattedProduct.no=formatId1(formattedProduct.no)
      setStockProducts(prev =>
        prev.map(p => (isMatch(p, saved.id) ? formattedProduct : p))
      );
    }


    toast.success('Product updated successfully');
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to update product');
  }

  setIsModalOpen(false);
  setModalProduct(null);
}, []);






  return (
    <div className="bg-white p-6 rounded-lg shadow-sm font-sans w-full min-h-screen">
      <div className="flex justify-end items-center mb-6 flex-wrap gap-4">
        <Link to="/admin/addProduct" className="no-underline flex items-center px-5 py-2 bg-[rgb(4,120,87)] text-white rounded-lg text-base font-medium hover:bg-green-700 transition-colors shadow-md">
          <IconPlus className="w-5 h-5 mr-2" />
          Add New Product
        </Link>
      </div>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search for product ID, name, or status..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(4,120,87)] text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            // Reset pagination for both tables when search term changes
            setCurrentPageSeller(1);
            setCurrentPageStock(1);
          }}
        />
        <IconSearch className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Seller Products Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Accept Sellers Orders To Add Their Products!</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'All' ? 'bg-[rgb(4,120,87)] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => { setActiveTab('All'); setCurrentPageSeller(1); }}
          >
            All ({sellerProducts.length})
          </button>
          <button
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'Pending' ? 'bg-[rgb(4,120,87)] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => { setActiveTab('Pending'); setCurrentPageSeller(1); }}
          >
            Pending ({sellerProducts.filter(item => item.status === 'Pending').length})
          </button>
          <button
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'Rejected' ? 'bg-[rgb(4,120,87)] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => { setActiveTab('Rejected'); setCurrentPageSeller(1); }}
          >
            Rejected ({sellerProducts.filter(item => item.status === 'Rejected').length})
          </button>
          {/* This button doesn't filter, so it should just be a static display */}
          <button className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            Show Only My Products
          </button>
        </div>

        <div className="w-full overflow-x-auto lg:overflow-x-visible rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F0FDF4]">
              <tr>
                {['No.', 'Product Id', 'Product Name', 'Date', 'Price', 'QTY', 'Status', 'Action'].map(header => (
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
              {currentSellerProducts.length > 0 ? (
                currentSellerProducts.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{(currentPageSeller - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{item.product}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                          onClick={() => handleViewProduct(item, 'seller')}
                        >
                          <IconEye className="w-5 h-5" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-yellow-600 transition-colors"
                          title="Edit"
                          onClick={() => handleEditProduct(item, 'seller')}
                        >
                          <IconEdit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete"
                          onClick={() => handleDeleteProductClick(item, 'seller')}
                        >
                          <IconTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-base text-gray-500 text-center">No seller products found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-3 py-3 mt-4">
          <button
            className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            onClick={() => setCurrentPageSeller(prev => Math.max(1, prev - 1))}
            disabled={currentPageSeller === 1}
          >
            <IconChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <div className="flex space-x-2 flex-wrap justify-center">
            {renderPaginationButtons(totalPagesSeller, currentPageSeller, setCurrentPageSeller)}
          </div>
          <button
            className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            onClick={() => setCurrentPageSeller(prev => Math.min(totalPagesSeller, prev + 1))}
            disabled={currentPageSeller === totalPagesSeller}
          >
            Next
            <IconChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Stock Products Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Check And Edit Stock Status</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeProductTab === 'All Product' ? 'bg-[rgb(4,120,87)] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => { setActiveProductTab('All Product'); setCurrentPageStock(1); }}
          >
            All Products ({stockProducts.length})
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeProductTab === 'Featured Products' ? 'bg-[rgb(4,120,87)] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => { setActiveProductTab('Featured Products'); setCurrentPageStock(1); }}
          >
            Featured Products
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeProductTab === 'On Sale' ? 'bg-[rgb(4,120,87)] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => { setActiveProductTab('On Sale'); setCurrentPageStock(1); }}
          >
            On Sale
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeProductTab === 'Out of Stock' ? 'bg-[rgb(4,120,87)] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => { setActiveProductTab('Out of Stock'); setCurrentPageStock(1); }}
          >
            Out of Stock ({stockProducts.filter(item => item.stock_status === 'Out of stock').length})
          </button>
        </div>

        <div className="w-full overflow-x-auto lg:overflow-x-visible rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F0FDF4]">
              <tr>
                {['No.', 'Product Id', 'Product Name', 'Date', 'Price', 'QTY', 'Status', 'Action'].map(header => (
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
              {currentStockProducts.length > 0 ? (
                currentStockProducts.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{(currentPageStock - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{item.product}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(item.status)}`}>
                        {item.stock_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                          onClick={() => handleViewProduct(item, 'stock')}
                        >
                          <IconEye className="w-5 h-5" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-yellow-600 transition-colors"
                          title="Edit"
                          onClick={() => handleEditProduct(item, 'stock')}
                        >
                          <IconEdit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete"
                          onClick={() => handleDeleteProductClick(item, 'stock')}
                        >
                          <IconTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-base text-gray-500 text-center">No stock products found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6 flex-wrap gap-3 py-3">
          <button
            className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            onClick={() => setCurrentPageStock(prev => Math.max(1, prev - 1))}
            disabled={currentPageStock === 1}
          >
            <IconChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <div className="flex space-x-2 flex-wrap justify-center">
            {renderPaginationButtons(totalPagesStock, currentPageStock, setCurrentPageStock)}
          </div>
          <button
            className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            onClick={() => setCurrentPageStock(prev => Math.min(totalPagesStock, prev + 1))}
            disabled={currentPageStock === totalPagesStock}
          >
            Next
            <IconChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Render Product Modal */}
      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={modalProduct}
          mode={modalMode}
          onSave={handleSaveProduct}
          onDeleteConfirm={confirmDeleteProduct}
        />
      )}
    </div>
  );
}

export default DiscoverProductManagement;
