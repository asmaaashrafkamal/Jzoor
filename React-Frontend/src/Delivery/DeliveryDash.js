import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';

const DeliveryDash = () => {
  const navigate = useNavigate();

  // ✅ All hooks declared at the top
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState([
    { orderId: '#ORD001', clientName: 'Rawan Ahmad', date: '10Oct2025', address: 'Rafah, Talahwton', status: 'In Transit' },
    { orderId: '#ORD002', clientName: 'Alaa Algarny', date: '10Oct2025', address: 'Gaza, Alremail', status: 'Picked Up' },
    { orderId: '#ORD003', clientName: 'Marym Eqith', date: '10Oct2025', address: 'Gaza, Alnasr', status: 'Picked Up' },
    { orderId: '#ORD004', clientName: 'Amina Emad', date: '10Oct2025', address: 'Almaghad,Alshouka', status: 'Canceled' },
    { orderId: '#ORD005', clientName: 'Dana Ismael', date: '10Oct2025', address: 'Jabalial,alBalad', status: 'In Transit' },
  ]);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // ✅ Authentication check
  useEffect(() => {
    axios.get("http://localhost:8000/check-login", { withCredentials: true })
      .then(res => {
        if (res.data.role === "A" || res.data.role === "D") {
          setUser(res.data.user);
        } else {
          navigate("/admin/login");
        }
      })
      .catch(() => {
        navigate("/admin/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  // ✅ Chart initialization
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [{
            label: 'Deliveries',
            data: [15, 20, 30, 54, 35, 25, 40],
            borderColor: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.2)',
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#6B7280' },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#E5E7EB',
                borderDash: [5, 5],
              },
              ticks: {
                callback: value => value + 'k',
                color: '#6B7280',
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  if (loading) return <div>Checking login status...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Dashboard content goes here */}
      <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Weekly Deliveries</h2>
        <div className="relative h-64">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "Client", "Date", "Address", "Status"].map((head) => (
                  <th key={head} className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {recentOrders.map((order, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 text-sm">{order.orderId}</td>
                  <td className="px-4 py-2 text-sm">{order.clientName}</td>
                  <td className="px-4 py-2 text-sm">{order.date}</td>
                  <td className="px-4 py-2 text-sm">{order.address}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "In Transit" ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Picked Up" ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
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
