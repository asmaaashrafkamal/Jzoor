import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Title from './Title';

export function DiscoverCategories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalCategoryName, setModalCategoryName] = useState('');
  const [modalCategoryDescription, setModalCategoryDescription] = useState('');
  const [modalCategoryNoProducts, setModalCategoryNoProducts] = useState('');
  const [modalCategoryImage, setModalCategoryImage] = useState('');
  const [message, setMessage] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/getCat');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      (category.cat_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevious = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const handleNext = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const openCategoryModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      setModalCategoryName(category.cat_name);
      setModalCategoryDescription(category.description);
      setModalCategoryNoProducts(category.productNo.toString());
      setModalCategoryImage(category.image);
    } else {
      setModalCategoryName('');
      setModalCategoryDescription('');
      setModalCategoryNoProducts('');
      setModalCategoryImage('');
    }
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async () => {
    if (!modalCategoryName || !modalCategoryDescription || !modalCategoryNoProducts) {
      alert('Please fill in all required fields');
      return;
    }

    const categoryData = {
      cat_name: modalCategoryName,
      description: modalCategoryDescription,
      productNo: parseInt(modalCategoryNoProducts, 10),
      image: modalCategoryImage || `https://placehold.co/40x40/CCCCCC/000000?text=${modalCategoryName.charAt(0).toUpperCase()}`,
    };

    try {
      const url = editingCategory
        ? `http://localhost:8000/api/categories/${editingCategory.id}`
        : 'http://localhost:8000/api/categories';

      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchCategories();
        setMessage('Saved successfully');
        closeCategoryModal();
      } else {
        setMessage(data.message || 'Error occurred');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const res = await fetch(`http://localhost:8000/api/categories/${id}`, { method: 'DELETE' });
        if (res.ok) {
          await fetchCategories();
          if (currentCategories.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1);
        }
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  return (
  <div className="p-6 w-full min-h-screen" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="mb-4">
<Title title="Discover" />
        {/* <h1 className="text-xl font-semibold text-gray-800">Discover</h1> */}
      </div>

       <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 font-sans mx-auto my-8">
        {/* Search and Add Category Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              placeholder="Search your category"
              className="w-full pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => openCategoryModal()} // Open modal for adding
            className="flex items-center px-4 py-2 bg-[#047857] hover:bg-[#026b4d] text-white rounded-md text-sm font-medium transition-colors"
          >
            <FaPlus className="h-5 w-5 mr-2" />
            Add Category
          </button>
        </div>

        {/* Categories Table */}
        <div className="w-full overflow-x-auto lg:overflow-x-visible" style={{ borderColor: '#E5E7EB', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          <div className="max-w-[250px] lg:min-w-full">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Products</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.length > 0 ? (
            currentCategories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-700">{cat.id}</td>
                <td className="px-6 py-4">
                  <img
                    src={cat.image || `https://placehold.co/40x40/CCCCCC/000000?text=${(cat.cat_name || '?').charAt(0).toUpperCase()}`}
                    alt={cat.cat_name}
                    className="w-8 h-8 rounded-full mr-3 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/40x40/CCCCCC/000000?text=${(cat.cat_name || '?').charAt(0).toUpperCase()}`;
                    }}
                  />
                 <span className="text-sm font-medium text-gray-900">{cat.cat_name}</span>

                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{cat.description}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{cat.productNo}</td>
                <td className="px-6 py-4 text-sm text-gray-700 flex space-x-2">
                  <button onClick={() => openCategoryModal(cat)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No categories found.</td>
            </tr>
          )}
        </tbody>
      </table>

       </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <span className="text-sm text-gray-700 mb-4 md:mb-0">
            Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, filteredCategories.length)}</span> of <span className="font-semibold">{filteredCategories.length}</span> entries
          </span>
          <nav className="flex flex-col md:flex-row justify-between  items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 bg-white hover:bg-gray-50"
            >
              <IoIosArrowBack className="h-4 w-4 mr-1" />
              Previous
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
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 bg-white hover:bg-gray-50"
            >
              Next <IoIosArrowForward className="h-4 w-4 ml-1" />
            </button>
          </nav>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveCategory(); }}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="categoryName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={modalCategoryName}
                  onChange={(e) => setModalCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="categoryDescription"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={modalCategoryDescription}
                  onChange={(e) => setModalCategoryDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="noProducts" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Products<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="noProducts"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={modalCategoryNoProducts}
                  onChange={(e) => setModalCategoryNoProducts(e.target.value)} // Corrected setter function
                  required
                  min="0"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url" // Use type="url" for image URLs
                  id="categoryImage"
                  placeholder="e.g., https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={modalCategoryImage}
                  onChange={(e) => setModalCategoryImage(e.target.value)}
                />
                {modalCategoryImage && (
                    <img src={modalCategoryImage} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-md border border-gray-200" onError={(e) => e.target.src='https://placehold.co/40x40/CCCCCC/000000?text=Error'} />
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#047857] text-white rounded-md hover:bg-[#026b4d] transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default DiscoverCategories;
