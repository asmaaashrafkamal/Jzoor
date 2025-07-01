import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js
// Removed react-icons imports due to module resolution error

const App = () => {
  // Placeholder data for demonstration
  const [recentOrders, setRecentOrders] = useState([
    {
      orderId: '#ORD001',
      clientName: 'Rawan Ahmad',
      date: '10Oct2025',
      address: 'Rafah, Talahwton',
      status: 'In Transit',
    },
    {
      orderId: '#ORD001',
      clientName: 'Alaa Algarny',
      date: '10Oct2025',
      address: 'Gaza, Alremail',
      status: 'Picked Up',
    },
    {
      orderId: '#ORD001',
      clientName: 'Marym Eqith',
      date: '10Oct2025',
      address: 'Gaza, Alnasr',
      status: 'Picked Up',
    },
    {
      orderId: '#ORD001',
      clientName: 'Amina Emad',
      date: '10Oct2025',
      address: 'Almaghad,Alshouka',
      status: 'Canceled',
    },
    {
      orderId: '#ORD001',
      clientName: 'Dana Ismael',
      date: '10Oct2025',
      address: 'Jabalial,alBalad',
      status: 'In Transit',
    },
  ]);

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
              data: [15, 20, 30, 54, 35, 25, 40], // Dummy data, changed Thursday to 54 for visual match
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

  const SummaryCard = ({ title, value, percentage, type, hideDetails = false }) => (
    <div className="bg-white rounded-lg shadow-sm p-2 flex flex-col justify-between h-auto">
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm" style={{ color: '#6B7280' }}>{title}</p> {/* text-gray-500 */}
          {/* Replaced BsThreeDotsVertical with inline SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9CA3AF' }}>
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </div>
        <p className="text-3xl font-bold" style={{ color: '#1F2937' }}>{value}</p> {/* text-gray-800 */}
        {percentage && (
          <p className="text-sm flex items-center">
            <span className={`font-semibold ${percentage.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
              {percentage}
            </span>
            <span style={{ color: '#6B7280' }} className="ml-1">last 7 days</span> {/* text-gray-500 */}
          </p>
        )}
        {type === 'delivered' && (
          <p className="text-sm" style={{ color: '#6B7280' }}>
            <span className="font-semibold">100 order</span>
            <span className="mx-1">~</span>
            <span>14.4%</span>
            <span className="block mt-1">Previous 7days (10)</span>
          </p>
        )}
        {type === 'transit-canceled' && (
          <div className="text-sm" style={{ color: '#6B7280' }}>
            <p>
              In Transit <span className="font-semibold" style={{ color: '#1F2937' }}>20</span> from 30 {/* text-gray-800 */}
            </p>
            <p>
              Canceled <span className="font-semibold" style={{ color: '#EF4444' }}>5</span> {/* text-red-500 */}
              <span className="ml-1 inline-flex items-center" style={{ color: '#EF4444' }}> {/* text-red-500 */}
                {/* Replaced FaArrowDown with inline SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-0.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                14.4%
              </span>
            </p>
          </div>
        )}
      </div>
    
    </div>
  );

  const EfficiencyMetric = ({ value, label, unit }) => (
    <div className="flex flex-col items-center p-2">
      <p className="text-2xl font-bold" style={{ color: '#1F2937' }}>{value}{unit}</p> {/* text-gray-800 */}
      <p className="text-sm text-center" style={{ color: '#6B7280' }}>{label}</p> {/* text-gray-500 */}
    </div>
  );

  const TodoItem = ({ status, text }) => (
    <div className="flex items-center space-x-3 mb-2 shadow-md px-2 py-3">
      <div
        className={`w-3 h-3 rounded-full`}
        style={{
          backgroundColor:
            status === 'completed'
              ? '#22C55E' // green-500
              : status === 'next-stop'
                ? '#F59E0B' // yellow-500
                : status === 'delayed'
                  ? '#EF4444' // red-500
                  : '#9CA3AF' // gray-400 for deadline
        }}
      ></div>
      <p className="text-sm" style={{ color: '#374151' }}>{text}</p> {/* text-gray-700 */}
    </div>
  );

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#F3F4F6', color: '#1F2937' }}> {/* bg-gray-100 text-gray-900 */}
      {/* Top Section: Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Removed icon prop as it's not used in SummaryCard component's rendering */}
        <SummaryCard title="New Orders" value="15" percentage="+10.4%" />
        <SummaryCard title="Delivered This Week" value="100" type="delivered" />
        <SummaryCard title="In Transit & Canceled" value="" type="transit-canceled" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Route Efficiency Report */}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Route Efficiency Report</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm rounded-full font-medium"
                      style={{ backgroundColor: '#D1FAE5', color: '#047857' }}> {/* bg-green-100 text-green-700 */}
                This week
              </button>
              <button className="px-3 py-1 text-sm rounded-full hover:bg-gray-200"
                      style={{ backgroundColor: '#F3F4F6', color: '#374151' }}> {/* bg-gray-100 text-gray-700 */}
                Last week
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <EfficiencyMetric value="52" label="Total Deliveries" unit="k" />
            <EfficiencyMetric value="2" label="Avg. Delivery Time" unit=" Days" />
            <EfficiencyMetric value="120" label="Total Distance" unit="Km" />
            <EfficiencyMetric value="3" label="Delayed Orders" unit=" Orders" />
          </div>

          {/* Chart.js integration */}
          <div className="relative p-4 rounded-md h-48 flex items-center justify-center border border-dashed"
               style={{ backgroundColor: '#F9FAFB', borderColor: '#D1D5DB' }}> {/* bg-gray-50 border-gray-300 */}
            <canvas ref={chartRef}></canvas>
            {/* Manual annotation for Thursday */}
            <div className="absolute" style={{ left: '60%', top: '10%' }}> {/* Approximate position for Thursday */}
              <div className="relative">
                <div className="absolute inset-y-0 left-1/2 w-px border-l border-dashed" style={{ height: 'calc(100% + 50px)', borderColor: '#9CA3AF' }}></div> {/* border-gray-400 */}
                <div className="absolute left-1/2 -ml-8 -mt-2 text-xs px-2 py-1 rounded-md shadow-sm"
                     style={{ color: '#374151', backgroundColor: '#FFFFFF' }}> {/* text-gray-700 bg-white */}
                  Thursday 54k
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-left mt-2" style={{ color: '#6B7280' }}>01 Oct | 11:29 am</p> {/* text-gray-500 */}
        </div>

        {/* Quick Daily ToDo Panel */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quick Daily ToDo Panel</h2>
            {/* Replaced BsThreeDotsVertical with inline SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9CA3AF' }}>
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </div>
          <div className="space-y-3">
            <TodoItem status="completed" text="Completed Deliveries: 3/8" />
            <TodoItem status="next-stop" text="Next Stop: [Almasr/Gaza]" />
            <TodoItem status="delayed" text="One delivery is delayed! Check status" />
            <TodoItem status="deadline" text="Deadline: Finish all by 8:00 PM" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders Table */}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders Table</h2>
            <button className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    style={{ color: '#374151', backgroundColor: '#F3F4F6' }}> {/* text-gray-700 bg-gray-100 */}
              {/* Replaced FaFilter with inline SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: '#E5E7EB' }}> {/* divide-gray-200 */}
              <thead style={{ backgroundColor: '#F9FAFB' }}> {/* bg-gray-50 */}
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280' }}> {/* text-gray-500 */}
                    Order Id
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280' }}> {/* text-gray-500 */}
                    Client Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280' }}> {/* text-gray-500 */}
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280' }}> {/* text-gray-500 */}
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280' }}> {/* text-gray-500 */}
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280' }}> {/* text-gray-500 */}
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y" style={{ borderColor: '#E5E7EB' }}> {/* divide-gray-200 */}
                {recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#1F2937' }}> {/* text-gray-900 */}
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4B5563' }}> {/* text-gray-600 */}
                      {order.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4B5563' }}> {/* text-gray-600 */}
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#4B5563' }}> {/* text-gray-600 */}
                      {order.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                        style={{
                          backgroundColor:
                            order.status === 'In Transit'
                              ? '#FFFBEB' // yellow-100
                              : order.status === 'Picked Up'
                                ? '#D1FAE5' // green-100
                                : order.status === 'Canceled'
                                  ? '#FEE2E2' // red-100
                                  : null,
                          color:
                            order.status === 'In Transit'
                              ? '#92400E' // yellow-800
                              : order.status === 'Picked Up'
                                ? '#065F46' // green-800
                                : order.status === 'Canceled'
                                  ? '#991B1B' // red-800
                                  : null
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <a href="#" className="hover:text-gray-900" style={{ color: '#4B5563' }}> {/* text-gray-600 */}
                          {/* Replaced FiEdit with inline SVG */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </a>
                        <a href="#" className="hover:text-gray-900" style={{ color: '#4B5563' }}> {/* text-gray-600 */}
                          {/* Replaced FiEye with inline SVG */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <button className="px-6 py-2 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    style={{ color: '#374151', backgroundColor: '#F3F4F6' }}> {/* text-gray-700 bg-gray-100 */}
              Details
            </button>
          </div>
        </div>

        {/* Live Map Widget Layout */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Live Map Widget Layout</h2>
            {/* Replaced BsThreeDotsVertical with inline SVG */}
            <svg xmlns="imges/image-2.webp" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9CA3AF' }}>
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </div>
          {/* Placeholder for the map */}
          <div className="relative w-full h-48 rounded-md overflow-hidden mb-4" style={{ backgroundColor: '#E5E7EB' }}> {/* bg-gray-200 */}
            <img
              src="imges/image-2.webp"
              alt="Map Placeholder"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Map+Error'; }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md">
              {/* Replaced FaMapMarkerAlt with inline SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#22C55E' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#4B5563' }}>Current Location: Jatiala</p> {/* text-gray-600 */}
          <p className="text-sm mb-2" style={{ color: '#4B5563' }}>Next Stop: Almosa/Gaza</p> {/* text-gray-600 */}
          <p className="text-sm mb-2" style={{ color: '#4B5563' }}>ETA: 15 min</p> {/* text-gray-600 */}
          <div className="w-full rounded-full h-2.5 mb-2" style={{ backgroundColor: '#E5E7EB' }}> {/* bg-gray-200 */}
            <div className="h-2.5 rounded-full" style={{ width: '50%', backgroundColor: '#22C55E' }}></div> {/* bg-green-500 */}
          </div>
          <p className="text-sm" style={{ color: '#4B5563' }}>Progress: ●●●●●●● 3/6</p> {/* text-gray-600 */}
          <p className="text-sm mt-2" style={{ color: '#4B5563' }}>Next Stop: Almosa/Gaza</p> {/* text-gray-600 */}
        </div>
      </div>
    </div>
  );
};

export default App;
