import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Import React Icons
import { FaEllipsisV, FaArrowUp, FaStar, FaRegStar } from 'react-icons/fa';
import { MdOutlineRemoveRedEye, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';


// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function ProductReview() {
  const [activeReviewsFilter, setActiveReviewsFilter] = useState('All Reviews');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5); // Number of reviews per page
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);

  
  
  // Product review data
  const reviewsOverview = {
    ratings: [
      { stars: 5, count: 90 },
      { stars: 4, count: 65 },
      { stars: 3, count: 300 },
      { stars: 2, count: 60 },
      { stars: 1, count: 25 },
    ],
    positiveReviews: 83.55,
    negativeReviews: 16.45,
  };

  // Calculate total reviews
  const totalReviews = reviewsOverview.ratings.reduce((sum, r) => sum + r.count, 0);

  // Doughnut Chart data and options
  const doughnutData = {
    labels: ['Positive Reviews', 'Negative Reviews'],
    datasets: [
      {
        data: [reviewsOverview.positiveReviews, reviewsOverview.negativeReviews],
        backgroundColor: ['#4CAF50', '#F44336'], // Positive and negative colors
        borderColor: ['#4CAF50', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend
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
    }
  };

  // Bar Chart data and options for star ratings
  const barData = {
    labels: reviewsOverview.ratings.map(r => `${r.stars} ★`),
    datasets: [
      {
        label: 'Number of Reviews',
        data: reviewsOverview.ratings.map(r => r.count),
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Make chart horizontal
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.x}`;
          },
          title: function(context) {
            const stars = parseInt(context[0].label.split(' ')[0]);
            return `${stars} Star ★`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Reviews',
          color: '#374151'
        },
        ticks: {
            color: '#4B5563'
        },
        grid: {
            color: '#E5E7EB'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Stars',
          color: '#374151'
        },
        ticks: {
            color: '#4B5563'
        },
        grid: {
            color: 'transparent' // Hide vertical grid lines
        }
      }
    }
  };

  // Top Rated Products data
  // const topRatedProducts = [
  //   { image: '/imges/66858fac-be77-4de0-a1d0-2e2806295950.webp', name: 'Lavender', id: '#FXZ-4567', rating: 5.0, reviews: 218 },
  //   { image: '/imges/ma2.webp', name: 'Chamomile', id: '#FXZ-4567', rating: 4.9, reviews: 318 },
  //   { image: '/imges/ma1.webp', name: 'Olive Tree', id: '#FXZ-4567', rating: 4.8, reviews: 298 },
  //   { image: '/imges/ma5.webp', name: 'Anemone', id: '#FXZ-4567', rating: 4.9, reviews: 309 },
  //   { image: '/imges/Anise.webp', name: 'Azalea', id: '#FXZ-4567', rating: 4.7, reviews: 108 },
  // ];

  // Detailed review data (using useState to allow deletion)
  // const [reviews, setReviews] = useState([
  //   { no: 1, productId: '#ORD0001', reviewer: 'RavenA', rate: 5, date: '09 Oct 2025', status: 'Positive', comment: 'Excellent product, highly recommend!' },
  //   { no: 2, productId: '#ORD0001', reviewer: 'Mariantx', rate: 4, date: '09 Oct 2025', status: 'Positive', comment: 'Very good, just as described.' },
  //   { no: 3, productId: '#ORD0001', reviewer: 'Ahmad22', rate: 2, date: '09 Oct 2025', status: 'Negative', comment: 'Disappointed with the quality.' },
  //   { no: 4, productId: '#ORD0001', reviewer: 'ali_abiZID', rate: 1, date: '09 Oct 2025', status: 'Negative', comment: 'Awful experience, do not buy.' },
  //   { no: 5, productId: '#ORD0002', reviewer: 'SaraM', rate: 4, date: '08 Oct 2025', status: 'Positive', comment: 'Good value for money.' },
  //   { no: 6, productId: '#ORD0003', reviewer: 'JohnD', rate: 5, date: '07 Oct 2025', status: 'Positive', comment: 'Fantastic! Will buy again.' },
  //   { no: 7, productId: '#ORD0004', reviewer: 'EmilyC', rate: 2, date: '06 Oct 2025', status: 'Negative', comment: 'Not what I expected.' },
  // ]);
  useEffect(() => {
    axios.get('http://localhost:8000/all-reviews')
      .then(res => {
        setReviews(res.data); // Now matches your useState format
      })
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    axios.get('http://localhost:8000/top-product')
      .then(res => {
        setTopRatedProducts(res.data);
      })
      .catch(err => console.error(err));
  }, []);
  // Filter reviews based on active filter and search term
  const filteredAndSearchedReviews = reviews.filter(review => {
    const matchesFilter = () => {
      if (activeReviewsFilter === 'All Reviews') return true;
      if (activeReviewsFilter === 'Top' && review.rate > 4) return true;
      if (activeReviewsFilter === 'Negative' && review.status === 'Negative') return true;
      if (activeReviewsFilter === 'Positive' && review.status === 'Positive') return true;
      return false;
    };

    const matchesSearch = () => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        review.productId.toLowerCase().includes(lowerCaseSearchTerm) ||
        review.reviewer.toLowerCase().includes(lowerCaseSearchTerm) ||
        review.comment.toLowerCase().includes(lowerCaseSearchTerm) // Added comment to search
      );
    };

    return matchesFilter() && matchesSearch();
  });

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredAndSearchedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredAndSearchedReviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // CSS classes based on review status
  const getStatusClasses = (status) => {
    if (status === 'Positive') return { backgroundColor: '#D1FAE5', color: '#065F46' };
    if (status === 'Negative') return { backgroundColor: '#FEE2E2', color: '#991B1B' };
    return {};
  };

  // Function to render stars using React Icons
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? (
          <FaStar key={i} className="w-4 h-4" style={{ color: '#FCD34D' }} />
        ) : (
          <FaRegStar key={i} className="w-4 h-4" style={{ color: '#D1D5DB' }} />
        )
      );
    }
    return <div className="flex">{stars}</div>;
  };
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm(`Are you sure you want to delete review No. ${reviewId}?`)) {
      try {
        await axios.delete(`http://localhost:8000/destroy/${reviewId}`);
        
        // Correct key here
        setReviews(prev => prev.filter(review => review.id !== reviewId));
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };
  
  // Handle view review
  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  return (
    <div style={{ backgroundColor: '#F3F4F6' }} className="p-4 font-sans max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Top section: Review overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Total Reviews Card */}
          <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h2 style={{ color: '#1F2937' }} className="text-base sm:text-lg font-semibold">Total Reviews</h2>
              {/* <button style={{ color: '#6B7280' }} className="hover:text-gray-700">
                <FaEllipsisV className="w-5 h-5" />
              </button> */}
            </div>
            <p style={{ color: '#111827' }} className="text-3xl sm:text-4xl font-bold mb-2">{totalReviews}</p>
            <p style={{ color: '#059669' }} className="text-xs sm:text-sm flex items-center">
              <FaArrowUp className="w-4 h-4 mr-1" />
              +14.5% <span style={{ color: '#6B7280' }} className="ml-1">Last 7 days</span>
            </p>
          </div>

          {/* Average Rating Card */}
          <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h2 style={{ color: '#1F2937' }} className="text-base sm:text-lg font-semibold">Average Rating</h2>
              {/* <button style={{ color: '#6B7280' }} className="hover:text-gray-700">
                <FaEllipsisV className="w-5 h-5" />
              </button> */}
            </div>
            <div className="flex items-center mb-2">
              <p style={{ color: '#111827' }} className="text-3xl sm:text-4xl font-bold mr-2">3.0</p>
              {renderStars(3)}
            </div>
            <p style={{ color: '#6B7280' }} className="text-xs sm:text-sm">Last 6 Months</p>
          </div>

          {/* Positive Reviews Card */}
          <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h2 style={{ color: '#1F2937' }} className="text-base sm:text-lg font-semibold">Positive Reviews</h2>
              {/* <button style={{ color: '#6B7280' }} className="hover:text-gray-700">
                <FaEllipsisV className="w-5 h-5" />
              </button> */}
            </div>
            <p style={{ color: '#111827' }} className="text-3xl sm:text-4xl font-bold mb-2">415</p>
            <p style={{ color: '#059669' }} className="text-xs sm:text-sm flex items-center">
              <FaArrowUp className="w-4 h-4 mr-1" />
              +26% <span style={{ color: '#6B7280' }} className="ml-1">Last 7 days</span>
            </p>
          </div>
        </div>

        {/* Reviews Overview Section: Chart and graphs */}
        <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <h2 style={{ color: '#1F2937' }} className="text-base sm:text-lg font-semibold mb-3 sm:mb-0">Reviews Overview</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Bar chart for rating breakdown */}
            <div className="w-full md:w-1/2 space-y-3 mb-6 md:mb-0 h-64 md:h-auto">
              <Bar data={barData} options={barOptions} />
            </div>

            {/* Doughnut chart for positive/negative */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center relative h-40">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute text-center">
                <p style={{ color: '#111827' }} className="text-sm font-bold">{reviewsOverview.positiveReviews}%</p>
                <p style={{ color: '#6B7280' }} className="text-sm">Positive</p>
              </div>
            </div>

            {/* Positive/Negative review breakdown */}
            <div className="w-full md:w-1/4 space-y-3 mt-6 md:mt-0 md:ml-4">
              <div className="flex items-center">
                <div style={{ backgroundColor: '#4CAF50' }} className="w-3 h-3 rounded-full mr-2"></div>
                <span style={{ color: '#374151' }} className="text-sm">Positive Reviews</span>
                <span style={{ color: '#374151' }} className="text-sm ml-auto">{reviewsOverview.positiveReviews}%</span>
              </div>
              <div className="flex items-center">
                <div style={{ backgroundColor: '#EF4444' }} className="w-3 h-3 rounded-full mr-2"></div>
                <span style={{ color: '#374151' }} className="text-sm">Negative Reviews</span>
                <span style={{ color: '#374151' }} className="text-sm ml-auto">{reviewsOverview.negativeReviews}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Products Section */}
        <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <h2 style={{ color: '#1F2937' }} className="text-base sm:text-lg font-semibold mb-3 sm:mb-0">Top Rated Products</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {topRatedProducts.map((product, index) => (
              <div key={index} className="flex flex-col items-center text-center p-2">
                <img src={product.image} alt={product.name} className="w-16 h-16 rounded-full object-cover mb-2" />
                <p style={{ color: '#111827' }} className="text-sm font-medium">{product.name}</p>
                <p style={{ color: '#6B7280' }} className="text-xs mb-1">{product.id}</p>
                <div style={{ color: '#374151' }} className="flex items-center text-xs mb-1">
                  <span className="mr-1">{product.rating}</span>
                  {renderStars(Math.round(product.rating))}
                </div>
                <p style={{ color: '#6B7280' }} className="text-xs">({product.reviews} Customer Review)</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Table Section */}
        <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <div className="relative w-full sm:w-1/2 mb-4 sm:mb-0">
              <input
                type="text"
                placeholder="Search for ID, reviewer, or comment"
                style={{
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  outline: 'none',
                  boxShadow: '0 0 0 1px #10B981'
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MdSearch className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#9CA3AF' }} />
            </div>
          </div>

          {/* Review Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              style={{ backgroundColor: activeReviewsFilter === 'All Reviews' ? '#047857' : '#F3F4F6', color: activeReviewsFilter === 'All Reviews' ? '#FFFFFF' : '#374151', borderRadius: '9999px' }}
              className="px-4 py-2 text-sm font-medium hover:bg-gray-200"
              onClick={() => setActiveReviewsFilter('All Reviews')}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              style={{ backgroundColor: activeReviewsFilter === 'Top' ? '#047857' : '#F3F4F6', color: activeReviewsFilter === 'Top' ? '#FFFFFF' : '#374151', borderRadius: '9999px' }}
              className="px-4 py-2 text-sm font-medium hover:bg-gray-200"
              onClick={() => setActiveReviewsFilter('Top')}
            >
              Top
            </button>
            <button
              style={{ backgroundColor: activeReviewsFilter === 'Negative' ? '#047857' : '#F3F4F6', color: activeReviewsFilter === 'Negative' ? '#FFFFFF' : '#374151', borderRadius: '9999px' }}
              className="px-4 py-2 text-sm font-medium hover:bg-gray-200"
              onClick={() => setActiveReviewsFilter('Negative')}
            >
              Negative
            </button>
            <button
              style={{ backgroundColor: activeReviewsFilter === 'Positive' ? '#047857' : '#F3F4F6', color: activeReviewsFilter === 'Positive' ? '#FFFFFF' : '#374151', borderRadius: '9999px' }}
              className="px-4 py-2 text-sm font-medium hover:bg-gray-200"
              onClick={() => setActiveReviewsFilter('Positive')}
            >
              Positive
            </button>
          </div>

          {/* Table container - ensuring horizontal scroll */}
          <div className="w-full overflow-x-auto lg:overflow-x-visible">
            <div className="max-w-[250px] lg:min-w-full ">
              <table className="min-w-full divide-y" style={{ borderColor: '#E5E7EB' }}>
                <thead style={{ backgroundColor: '#F0FDF4' }}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>No.</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Product Id</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Reviewer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Rate</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Action</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#FFFFFF', divideColor: '#E5E7EB' }}>
                  {currentReviews.map((review) => (
                    <tr key={review.no}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#374151' }}>{review.no}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#374151' }}>{review.productId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#111827' }}>{review.reviewer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(review.rate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#374151' }}>{review.comment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{review.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`} style={getStatusClasses(review.status)}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => handleViewReview(review)} style={{ color: '#6B7280' }} className="hover:text-gray-700">
                            <MdOutlineRemoveRedEye className="w-5 h-5" />
                          </button>
                          {/* Delete button with hover effect */}
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-gray-500 hover:text-red transition-colors duration-200"
                          >
                            <MdDelete className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reviews Table Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 mt-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              style={{ color: '#374151', backgroundColor: 'transparent', border: '1px solid #D1D5DB', borderRadius: '0.5rem' }}
              className="flex items-center px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoIosArrowBack className="h-4 w-4 mr-1" />
              Previous
            </button>
            <div className="flex flex-wrap justify-center gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  style={{ backgroundColor: currentPage === index + 1 ? '#10B981' : 'transparent', color: currentPage === index + 1 ? '#FFFFFF' : '#374151', borderRadius: '0.5rem' }}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              style={{ color: '#374151', backgroundColor: 'transparent', border: '1px solid #D1D5DB', borderRadius: '0.5rem' }}
              className="flex items-center px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <IoIosArrowForward className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Review Details Modal */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Details</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700"><strong>No.:</strong> {selectedReview.no}</p>
              <p className="text-sm text-gray-700"><strong>Product ID:</strong> {selectedReview.productId}</p>
              <p className="text-sm text-gray-700"><strong>Reviewer:</strong> {selectedReview.reviewer}</p>
              <p className="text-sm text-gray-700"><strong>Rating:</strong> {renderStars(selectedReview.rate)}</p>
              <p className="text-sm text-gray-700"><strong>Date:</strong> {selectedReview.date}</p>
              <p className="text-sm text-gray-700"><strong>Status:</strong> <span style={getStatusClasses(selectedReview.status)} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">{selectedReview.status}</span></p>
              <p className="text-sm text-gray-700"><strong>Comment:</strong> {selectedReview.comment || 'N/A'}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductReview;