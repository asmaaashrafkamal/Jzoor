import React, { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Import React Icons
import { FaEllipsisV, FaArrowUp, FaStar, FaRegStar, FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';


// تسجيل مكونات Chart.js اللازمة
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function ProductReview() {
  const [activeReviewsFilter, setActiveReviewsFilter] = useState('All Reviews');
  const [activeTimeframe, setActiveTimeframe] = useState('This week');

  // بيانات مراجعات المنتجات
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

  // حساب إجمالي المراجعات
  const totalReviews = reviewsOverview.ratings.reduce((sum, r) => sum + r.count, 0);

  // بيانات وخيارات مخطط الدونت (Doughnut Chart)
  const doughnutData = {
    labels: ['Positive Reviews', 'Negative Reviews'],
    datasets: [
      {
        data: [reviewsOverview.positiveReviews, reviewsOverview.negativeReviews],
        backgroundColor: ['#4CAF50', '#F44336'], // ألوان إيجابية وسلبية
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
        display: false, // إخفاء وسيلة الإيضاح
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

  // بيانات وخيارات مخطط الشريط (Bar Chart) لتقييمات النجوم
  const barData = {
    // تعديل الـ labels لتضمين نجمة واحدة فقط بجانب الرقم
    labels: reviewsOverview.ratings.map(r => `${r.stars} ★`), // ★ نجمة واحدة
    datasets: [
      {
        label: 'Number of Reviews',
        data: reviewsOverview.ratings.map(r => r.count),
        backgroundColor: '#4CAF50', // لون الأعمدة
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // لجعل المخطط أفقيًا
    plugins: {
      legend: {
        display: false, // إخفاء وسيلة الإيضاح
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.x}`;
          },
          // تخصيص عنوان الـ tooltip ليعرض نجمة واحدة
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
            color: 'transparent' // إخفاء خطوط الشبكة الرأسية
        }
      }
    }
  };

  // بيانات المنتجات الأعلى تقييمًا
  const topRatedProducts = [
    { image: '/imges/66858fac-be77-4de0-a1d0-2e2806295950.webp', name: 'Lavender', id: '#FXZ-4567', rating: 5.0, reviews: 218 },
    { image: '/imges/ma2.webp', name: 'Chamomile', id: '#FXZ-4567', rating: 4.9, reviews: 318 },
    { image: '/imges/ma1.webp', name: 'Olive Tree', id: '#FXZ-4567', rating: 4.8, reviews: 298 },
    { image: '/imges/Marigold.webp', name: 'Marigold', id: '#FXZ-4567', rating: 4.9, reviews: 309 },
    { image: '/imges/Anise.webp', name: 'Azalea', id: '#FXZ-4567', rating: 4.7, reviews: 108 },
  ];

  // بيانات المراجعات التفصيلية
  const reviewsData = [
    { no: 1, productId: '#ORD0001', reviewer: 'RavenA', comment: '"Very Nice"', rate: 5, date: '09 Oct 2025', status: 'Approved' },
    { no: 2, productId: '#ORD0001', reviewer: 'Mariantx', comment: '"Love it"', rate: 4, date: '09 Oct 2025', status: 'Approved' },
    { no: 3, productId: '#ORD0001', reviewer: 'Ahmad22', comment: '"Too Bad"', rate: 2, date: '09 Oct 2025', status: 'Hidden' },
    { no: 4, productId: '#ORD0001', reviewer: 'ali_abiZID', comment: '"Not My Type"', rate: 1, date: '09 Oct 2025', status: 'Hidden' },
    { no: 5, productId: '#ORD0002', reviewer: 'SaraM', comment: '"Good Product"', rate: 4, date: '08 Oct 2025', status: 'Approved' },
    { no: 6, productId: '#ORD0003', reviewer: 'JohnD', comment: '"Excellent!"', rate: 5, date: '07 Oct 2025', status: 'Approved' },
    { no: 7, productId: '#ORD0004', reviewer: 'EmilyC', comment: '"Disappointed"', rate: 2, date: '06 Oct 2025', status: 'Hidden' },
  ];

  // تصفية المراجعات بناءً على الفلتر النشط
  const filteredReviews = reviewsData.filter(review => {
    if (activeReviewsFilter === 'All Reviews') return true;
    if (activeReviewsFilter === 'Top' && review.rate >= 4) return true;
    if (activeReviewsFilter === 'Hidden' && review.status === 'Hidden') return true;
    if (activeReviewsFilter === 'Approved' && review.status === 'Approved') return true;
    return false;
  });

  // تحديد فئات CSS بناءً على حالة المراجعة
  const getStatusClasses = (status) => {
    if (status === 'Approved') return 'background-color: #D1FAE5; color: #065F46;';
    if (status === 'Hidden') return 'background-color: #FEE2E2; color: #991B1B;';
    return '';
  };

  // وظيفة لرسم النجوم باستخدام React Icons
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

  return (
    <div style={{ backgroundColor: '#F3F4F6' }} className="p-4 font-sans max-w-full overflow-x-hidden">
      {/* The `Title` component import and usage has been removed as it was not defined in the provided context. */}
      {/* <Title title="Product Review" /> */}
      
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* قسم علوي: بطاقات نظرة عامة على المراجعات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* بطاقة إجمالي المراجعات */}
          <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h2 style={{ color: '#1F2937' }} className="text-base sm:text-lg font-semibold">Total Reviews</h2>
              <button style={{ color: '#6B7280' }} className="hover:text-gray-700">
                <FaEllipsisV className="w-5 h-5" /> {/* Replaced SVG with FaEllipsisV */}
              </button>
            </div>
            <p style={{ color: '#111827' }} className="text-3xl sm:text-4xl font-bold mb-2">{totalReviews}</p>
            <p style={{ color: '#059669' }} className="text-xs sm:text-sm flex items-center">
              <FaArrowUp className="w-4 h-4 mr-1" /> {/* Replaced SVG with FaArrowUp */}
              +14.5% <span style={{ color: '#6B7280' }} className="ml-1">Last 7 days</span>
            </p>
          </div>

          {/* بطاقة متوسط التقييم */}
          <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h2 style={{ color: '#1F2937' }} className="text-base sm:text-lg font-semibold">Average Rating</h2>
              <button style={{ color: '#6B7280' }} className="hover:text-gray-700">
                <FaEllipsisV className="w-5 h-5" /> {/* Replaced SVG with FaEllipsisV */}
              </button>
            </div>
            <div className="flex items-center mb-2">
              <p style={{ color: '#111827' }} className="text-3xl sm:text-4xl font-bold mr-2">3.0</p>
              {renderStars(3)}
            </div>
            <p style={{ color: '#6B7280' }} className="text-xs sm:text-sm">Last 6 Months</p>
          </div>

          {/* بطاقة المراجعات الإيجابية */}
          <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h2 style={{ color: '#1F2937' }} className="text-base sm:text-lg font-semibold">Positive Reviews</h2>
              <button style={{ color: '#6B7280' }} className="hover:text-gray-700">
                <FaEllipsisV className="w-5 h-5" /> {/* Replaced SVG with FaEllipsisV */}
              </button>
            </div>
            <p style={{ color: '#111827' }} className="text-3xl sm:text-4xl font-bold mb-2">415</p>
            <p style={{ color: '#059669' }} className="text-xs sm:text-sm flex items-center">
              <FaArrowUp className="w-4 h-4 mr-1" /> {/* Replaced SVG with FaArrowUp */}
              +26% <span style={{ color: '#6B7280' }} className="ml-1">Last 7 days</span>
            </p>
          </div>
        </div>

        {/* قسم نظرة عامة على المراجعات: مخطط ورسوم بيانية */}
        <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <h2 style={{ color: '#1F2937' }} className="text-base sm:text-lg font-semibold mb-3 sm:mb-0">Reviews Overview</h2>
            <div className="flex space-x-2 text-sm">
              <button
                style={{ backgroundColor: activeTimeframe === 'This week' ? '#D1FAE5' : 'transparent', color: activeTimeframe === 'This week' ? '#065F46' : '#6B7280' }}
                className="px-3 py-1 rounded-md hover:bg-gray-50"
                onClick={() => setActiveTimeframe('This week')}
              >
                This week
              </button>
              <button
                style={{ backgroundColor: activeTimeframe === 'Last week' ? '#D1FAE5' : 'transparent', color: activeTimeframe === 'Last week' ? '#065F46' : '#6B7280' }}
                className="px-3 py-1 rounded-md hover:bg-gray-50"
                onClick={() => setActiveTimeframe('Last week')}
              >
                Last week
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* مخطط الشريط لتقسيم التقييمات */}
            <div className="w-full md:w-1/2 space-y-3 mb-6 md:mb-0 h-64 md:h-auto">
              <Bar data={barData} options={barOptions} />
            </div>

            {/* مخطط الدونت */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center relative h-40">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute text-center">
                <p style={{ color: '#111827' }} className="text-sm font-bold">{reviewsOverview.positiveReviews}%</p>
                <p style={{ color: '#6B7280' }} className="text-sm">Positive</p>
              </div>
            </div>

            {/* تقسيم المراجعات الإيجابية/السلبية */}
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

        {/* قسم المنتجات الأعلى تقييمًا */}
        <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <h2 style={{ color: '#1F2937' }} className="text-base sm:text-lg font-semibold mb-3 sm:mb-0">Top Rated Products</h2>
            <div className="flex space-x-2 text-sm">
              <button
                style={{ backgroundColor: activeTimeframe === 'This week' ? '#D1FAE5' : 'transparent', color: activeTimeframe === 'This week' ? '#065F46' : '#6B7280' }}
                className="px-3 py-1 rounded-md hover:bg-gray-50"
                onClick={() => setActiveTimeframe('This week')}
              >
                This week
              </button>
              <button
                style={{ backgroundColor: activeTimeframe === 'Last week' ? '#D1FAE5' : 'transparent', color: activeTimeframe === 'Last week' ? '#065F46' : '#6B7280' }}
                className="px-3 py-1 rounded-md hover:bg-gray-50"
                onClick={() => setActiveTimeframe('Last week')}
              >
                Last week
              </button>
            </div>
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

        {/* قسم جدول المراجعات */}
        <div style={{ backgroundColor: '#FFFFFF' }} className="p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <div className="relative w-full sm:w-1/2 mb-4 sm:mb-0">
              <input
                type="text"
                placeholder="Search for id, name, product"
                style={{
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  outline: 'none',
                  boxShadow: '0 0 0 1px #10B981'
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
              <FaSearch className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#9CA3AF' }} /> {/* Replaced SVG with FaSearch */}
            </div>
            <div className="flex space-x-2 text-sm">
              <button
                style={{ backgroundColor: activeTimeframe === 'This week' ? '#D1FAE5' : 'transparent', color: activeTimeframe === 'This week' ? '#065F46' : '#6B7280' }}
                className="px-3 py-1 rounded-md hover:bg-gray-50"
                onClick={() => setActiveTimeframe('This week')}
              >
                This week
              </button>
              <button
                style={{ backgroundColor: activeTimeframe === 'Last week' ? '#D1FAE5' : 'transparent', color: activeTimeframe === 'Last week' ? '#065F46' : '#6B7280' }}
                className="px-3 py-1 rounded-md hover:bg-gray-50"
                onClick={() => setActiveTimeframe('Last week')}
              >
                Last week
              </button>
            </div>
          </div>

          {/* فلاتر المراجعات */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              style={{ backgroundColor: activeReviewsFilter === 'All Reviews' ? '#047857' : '#F3F4F6', color: activeReviewsFilter === 'All Reviews' ? '#FFFFFF' : '#374151', borderRadius: '9999px' }}
              className="px-4 py-2 text-sm font-medium hover:bg-gray-200"
              onClick={() => setActiveReviewsFilter('All Reviews')}
            >
              All Reviews ({reviewsData.length})
            </button>
            <button
              style={{ backgroundColor: activeReviewsFilter === 'Top' ? '#047857' : '#F3F4F6', color: activeReviewsFilter === 'Top' ? '#FFFFFF' : '#374151', borderRadius: '9999px' }}
              className="px-4 py-2 text-sm font-medium hover:bg-gray-200"
              onClick={() => setActiveReviewsFilter('Top')}
            >
              Top
            </button>
            <button
              style={{ backgroundColor: activeReviewsFilter === 'Hidden' ? '#047857' : '#F3F4F6', color: activeReviewsFilter === 'Hidden' ? '#FFFFFF' : '#374151', borderRadius: '9999px' }}
              className="px-4 py-2 text-sm font-medium hover:bg-gray-200"
              onClick={() => setActiveReviewsFilter('Hidden')}
            >
              Hidden
            </button>
            <button
              style={{ backgroundColor: activeReviewsFilter === 'Approved' ? '#047857' : '#F3F4F6', color: activeReviewsFilter === 'Approved' ? '#FFFFFF' : '#374151', borderRadius: '9999px' }}
              className="px-4 py-2 text-sm font-medium hover:bg-gray-200"
              onClick={() => setActiveReviewsFilter('Approved')}
            >
              Approved
            </button>
          </div>

          {/* الجدول - جزء مهم للتمرير الأفقي: تأكد من أن حاوية الجدول تحتوي على overflow-x-auto */}
          <div className="w-full overflow-x-auto lg:overflow-x-visible">
            <div className="max-w-[250px] lg:min-w-full ">
              <table className="min-w-full divide-y" style={{ borderColor: '#E5E7EB' }}>
                <thead style={{ backgroundColor: '#F0FDF4' }}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>No.</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Product Id</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Reviewer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Comment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Rate</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#065F46' }}>Action</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#FFFFFF', divideColor: '#E5E7EB' }}>
                  {filteredReviews.map((review, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#374151' }}>{review.no}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#374151' }}>{review.productId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#111827' }}>{review.reviewer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#374151' }}>{review.comment}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(review.rate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{review.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`} style={{ ...Object.fromEntries(getStatusClasses(review.status).split('; ').filter(s => s).map(s => s.split(': ').map(part => part.trim()))) }}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button style={{ color: '#6B7280' }} className="hover:text-gray-700">
                            <FaEye className="w-5 h-5" /> {/* Replaced SVG with FaEye */}
                          </button>
                          <button style={{ color: '#6B7280' }} className="hover:text-gray-700">
                            <FaEdit className="w-5 h-5" /> {/* Replaced SVG with FaEdit */}
                          </button>
                          <button style={{ color: '#6B7280' }} className="hover:text-red-600"> {/* Added hover:text-red-600 for trash icon */}
                            <FaTrash className="w-5 h-5" /> {/* Replaced SVG with FaTrash */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>

          {/* ترقيم صفحات جدول المراجعات */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <button style={{ color: '#374151', backgroundColor: 'transparent', border: '1px solid #D1D5DB', borderRadius: '0.5rem' }} className="flex items-center px-4 py-2 hover:bg-gray-100">
              <IoIosArrowBack className="h-4 w-4 mr-1" /> {/* Replaced SVG with IoIosArrowBack */}
              Previous
            </button>
            <div className="flex flex-wrap justify-center gap-2">
              <button style={{ backgroundColor: '#10B981', color: '#FFFFFF', borderRadius: '0.5rem' }} className="px-4 py-2">1</button>
              <button style={{ backgroundColor: 'transparent', color: '#374151', borderRadius: '0.5rem' }} className="px-4 py-2 hover:bg-gray-100">2</button>
              <button style={{ backgroundColor: 'transparent', color: '#374151', borderRadius: '0.5rem' }} className="px-4 py-2 hover:bg-gray-100">3</button>
              <button style={{ backgroundColor: 'transparent', color: '#374151', borderRadius: '0.5rem' }} className="px-4 py-2 hover:bg-gray-100">4</button>
              <button style={{ backgroundColor: 'transparent', color: '#374151', borderRadius: '0.5rem' }} className="px-4 py-2 hover:bg-gray-100">5</button>
              <span style={{ color: '#374151' }} className="px-4 py-2">--</span>
              <button style={{ backgroundColor: 'transparent', color: '#374151', borderRadius: '0.5rem' }} className="px-4 py-2 hover:bg-gray-100">24</button>
            </div>
            <button style={{ color: '#374151', backgroundColor: 'transparent', border: '1px solid #D1D5DB', borderRadius: '0.5rem' }} className="flex items-center px-4 py-2 hover:bg-gray-100">
              Next
              <IoIosArrowForward className="h-4 w-4 ml-1" /> {/* Replaced SVG with IoIosArrowForward */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductReview;
