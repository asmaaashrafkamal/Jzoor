import React, { useState, useMemo, useEffect } from 'react';

export function DiscoverCategories() {
  // Dummy data for categories
  const initialCategories = [
    {
      id: 1, // Added a unique ID for better key management
      image: 'https://via.placeholder.com/40/F59E0B/FFFFFF?text=F', // Example color for flowers
      category: 'Flowers',
      description: 'Fresh & dried flower picks',
      noProducts: 7000,
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/40/10B981/FFFFFF?text=P', // Example color for plants
      category: 'Plants',
      description: 'Indoor & outdoor greenery',
      noProducts: 5000,
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/40/EF4444/FFFFFF?text=G', // Example color for gifts
      category: 'Gifts',
      description: 'Plant-based gift sets',
      noProducts: 3500,
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/40/6366F1/FFFFFF?text=O', // Example color for pots
      category: 'Pots',
      description: 'Decorative plant containers',
      noProducts: 1000,
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/40/06B6D4/FFFFFF?text=C', // Example color for care
      category: 'Care',
      description: 'Tools & essentials for care',
      noProducts: 5000,
    },
    {
      id: 6,
      image: 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=A', // Example color for accessories
      category: 'Accessory',
      description: 'Stands, tags & add-ons',
      noProducts: 4200,
    },
    {
      id: 7,
      image: 'https://via.placeholder.com/40/EC4899/FFFFFF?text=S',
      category: 'Seeds',
      description: 'Variety of plant seeds',
      noProducts: 1500,
    },
    {
      id: 8,
      image: 'https://via.placeholder.com/40/FCD34D/000000?text=T',
      category: 'Tools',
      description: 'Gardening tools',
      noProducts: 2000,
    },
    {
      id: 9,
      image: 'https://via.placeholder.com/40/A78BFA/FFFFFF?text=B',
      category: 'Books',
      description: 'Gardening books & guides',
      noProducts: 800,
    },
    {
      id: 10,
      image: 'https://via.placeholder.com/40/4F46E5/FFFFFF?text=D',
      category: 'Decor',
      description: 'Garden & home decor',
      noProducts: 2500,
    },
  ];

  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Setting to 5 rows as seen in typical dashboards

  // Filtered categories based on search term
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Reset page to 1 whenever search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

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
    <div className="p-4 w-full" style={{ backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Discover</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 font-sans mx-auto my-8">
        {/* Search and Add Category */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              placeholder="Search your category" 
              className="w-full pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="flex items-center px-4 py-2 bg-[#047857] hover:bg-[#026b4d] text-white rounded-md text-sm font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>

        {/* Table Container */}
        <div className="w-full overflow-x-auto lg:overflow-x-visible" style={{ borderColor: '#E5E7EB', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          <div className="max-w-[250px] lg:min-w-full">

          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: '#F0FDF4' }}> {/* Changed header background for consistency */}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No.</th> {/* Changed text color */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NO. Products</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCategories.length > 0 ? (
                currentCategories.map((item) => (
                  <tr key={item.id}> {/* Using item.id as a stable key */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded mr-3 focus:ring-blue-500" /> {/* Blue checkbox */}
                        <span className="text-sm text-gray-700">{item.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* <img src={item.image} alt={item.category} className="w-8 h-8 rounded-full mr-3 object-cover"/> Larger image */}
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.noProducts.toLocaleString()}</td> {/* Format number */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button className="text-gray-500 hover:text-blue-600" title="Edit"> {/* Blue hover for edit */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                          </svg>
                        </button>
                        <button className="text-gray-500 hover:text-red-600" title="Delete"> {/* Red hover for delete */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21a48.108 48.108 0 0 0-3.478-.397m-12 .562L4.772 5.79M16.5 3.75V7.5M6.75 3.75H4.875C4.254 3.75 3.75 4.254 3.75 4.875v12.75c0 .621.504 1.125 1.125 1.125h14.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H16.5" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <span className="text-sm text-gray-700 mb-4 md:mb-0">
            Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, filteredCategories.length)}</span> of <span className="font-semibold">{filteredCategories.length}</span> entries
          </span>
          <nav className="flex flex-col md:flex-row justify-between items-center items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Previous
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
              Next →
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default DiscoverCategories;