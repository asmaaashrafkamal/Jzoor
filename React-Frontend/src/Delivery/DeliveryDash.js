import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const statusMap = {
  Delivered: "Completed",
  "In Transit": "On Progress",
  Pending: "Pending",
  Cancelled: "Cancelled"
};

const DeliveryDash = () => {
  const chartRef = useRef(null);
  const doughnutRef = useRef(null);
  const chartInstance = useRef(null);
  const doughnutInstance = useRef(null);

  const [orders, setOrders] = useState([]);
  const driverToken = localStorage.getItem('driverToken'); // adjust as needed
  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/delivery/orders`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${driverToken}`,
          },
        });
  
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        const formatted = data.map((order) => ({
          orderId: `#ORD${String(order.id).padStart(3, '0')}`,
          clientName: order.user.full_name,
          date: formatDate(order.created_at),
          address: order.user.address,
          status: order.status,
          created_at: order.created_at // keep this for charts
        }));
        
        setOrders(formatted);
      } catch (err) {
        console.error("Failed to fetch delivery orders:", err);
      }
    };
  
    fetchOrders();
  }, []);

  // Bar chart: Monthly deliveries
  useEffect(() => {
    if (!chartRef.current || !orders.length) return;

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const monthlyCounts = months.map((_, idx) => 
      orders.filter(o => new Date(o.created_at).getMonth() === idx).length
    );

    if(chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'Monthly Deliveries',
          data: monthlyCounts,
          backgroundColor: monthlyCounts.map(v => v === 0 ? 'rgba(156,163,175,0.3)' : '#34D399'),
          borderColor:'#34D399',
          borderWidth:1,
          borderRadius:5
        }]
      },
options: {
  responsive: true,
  maintainAspectRatio: false, // allow it to scale to card size
  cutout: '70%', // smaller cutout → thicker doughnut
  plugins: {
    legend: { position: 'bottom' },
    tooltip: { 
      callbacks: { label: t => `${t.label}: ${t.parsed}` }
    }
  }
}    });

    return () => chartInstance.current && chartInstance.current.destroy();
  }, [orders]);

  // Doughnut chart: Order status
  useEffect(() => {
    if (!doughnutRef.current || !orders.length) return;
  
    const statusCount = { Completed:0, Pending:0, Cancelled:0, 'On Progress':0 };
    orders.forEach(o => {
      const key = statusMap[o.status] || "Pending";
      statusCount[key]++;
    });
  
    if(doughnutInstance.current) doughnutInstance.current.destroy();
  
    doughnutInstance.current = new Chart(doughnutRef.current, {
      type: 'doughnut',
      data: {
        labels: Object.keys(statusCount),
        datasets: [{
          data: Object.values(statusCount),
          backgroundColor:['#22C55E','#F59E0B','#EF4444','#3B82F6'],
          borderColor:'#fff',
          borderWidth:2
        }]
      },
      options: {
        responsive:true,
        maintainAspectRatio:false,
        cutout: '70%',  // <-- increase this to make the circle smaller
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { 
            callbacks: { 
              label: t => `${t.label}: ${t.parsed}`
            } 
          }
        }
      }
    });
  
    return () => doughnutInstance.current && doughnutInstance.current.destroy();
  }, [orders]);
  

  return (
    <div className="p-6 min-h-screen bg-gray-100">
  <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>
{/* Cards Row */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
  {/* Total Orders */}
  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm opacity-80">Total Orders</p>
      <p className="text-3xl font-bold">{orders.length}</p>
    </div>
    <div className="bg-white/20 p-3 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M9 3v18m6-18v18" />
      </svg>
    </div>
  </div>

  {/* Pending */}
  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm opacity-80">Pending</p>
      <p className="text-3xl font-bold">{orders.filter(o => o.status === 'Pending').length}</p>
    </div>
    <div className="bg-white/20 p-3 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
      </svg>
    </div>
  </div>

  {/* In Progress */}
  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm opacity-80">On Progress</p>
      <p className="text-3xl font-bold">{orders.filter(o => o.status === 'In Transit').length}</p>
    </div>
    <div className="bg-white/20 p-3 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h13M9 17l-5-5 5-5" />
      </svg>
    </div>
  </div>

 {/* Completed */}
<div className="bg-gray-700 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
  <div>
    <p className="text-sm">Completed</p>
    <p className="text-3xl font-bold">
      {orders.filter(o => o.status === 'Delivered').length}
    </p>
  </div>
  <div className="bg-white/20 p-3 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" 
         className="h-6 w-6 text-white" 
         fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  </div>
</div>

{/* Cancelled */}
<div className="bg-gray-700 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
  <div>
    <p className="text-sm">Cancelled</p>
    <p className="text-3xl font-bold">
      {orders.filter(o => o.status === 'Cancelled' || o.status === 'Canceled').length}
    </p>
  </div>
  <div className="bg-white/20 p-3 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" 
         className="h-6 w-6 text-white" 
         fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </div>
</div>

</div>



  {/* Charts Row */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
  <div className="bg-white p-4 rounded shadow flex flex-col">
  <h2 className="text-xl font-semibold mb-2">Monthly Deliveries</h2>
  <div className="flex-1">
    <canvas ref={chartRef}/>
  </div>
</div>
<div className="bg-white p-4 rounded shadow h-[400px]">
  <h2 className="text-xl font-semibold mb-2">Order Status Distribution</h2>
  <div className="h-[320px]">
    <canvas ref={doughnutRef} />
  </div>
</div>

  </div>



      {/* Recent Orders Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID","Client","Date","Address","Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.map((order, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 text-sm">{order.orderId}</td>
                  <td className="px-4 py-2 text-sm">{order.clientName}</td>
                  <td className="px-4 py-2 text-sm">{order.date}</td>
                  <td className="px-4 py-2 text-sm">{order.address}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered" ? "bg-green-100 text-green-800" :
                      order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "Canceled" ? "bg-red-100 text-red-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDash;

