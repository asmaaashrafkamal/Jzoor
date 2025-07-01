import React from 'react';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function SalesInsights() {
  const barData = {
    labels: Array(30).fill(''), // Representing 30 minutes, labels are not shown in the image
    datasets: [
      {
        label: "Users per minute",
        data: [
          300, 150, 200, 400, 200, 900, 380, 350, 400, 380, 450, 900, 480,
          550, 600, 580, 1000, 700, 680, 750, 900, 780, 850, 900, 880,
          950, 1000, 980, 1050, 1100, // Example data points for 30 minutes
        ],
        backgroundColor: "#5B6938", // Green color for bars
        borderRadius: 2, // Slightly rounded corners for bars
        barThickness: 8, // Thinner bars as in the image
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows flexible height
    plugins: {
      legend: { display: false }, // Hide legend
      tooltip: { enabled: false }, // Hide tooltips for a cleaner look
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide vertical grid lines
        },
        ticks: {
          display: false, // Hide x-axis labels
        },
        border: {
          display: false, // Hide x-axis border line
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Hide horizontal grid lines
        },
        ticks: {
          display: false, // Hide y-axis labels
        },
        border: {
          display: false, // Hide y-axis border line
        },
      },
    },
  };

  const salesData = [
    { country: "Palestine", flag: "🇵🇸", sales: "5K", percentage: "25.8%", trend: "up" ,img:"imges/Frame 4275.webp"},
    { country: "Jordan", flag: "🇯🇴", sales: "2.4K", percentage: "15.8%", trend: "down",img :"imges/Frame 4274.webp" },
    { country: "Egypt", flag: "🇪🇬", sales: "2.6K", percentage: "35.8%", trend: "up",img :"imges/Frame 4273.webp" },
  ];

  return (
    <div className="border border-gray-200 rounded-2xl p-4 shadow-md bg-white  font-sans">
      {/* Top section: Users in last 30 minutes */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-600 text-sm font-medium">Users in last 30 minutes</h3>
        <button className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </button>
      </div>
      <p className="text-3xl font-semibold text-gray-800 mb-6">10K</p>
      <p className="text-gray-600 text-sm mb-0 pb-0">Users per minute</p>

      {/* Bar chart for Users per minute */}
      <div className="h-[50px] "> {/* Fixed height for the chart */}
        <Bar data={barData} options={barOptions} />
      </div>

      {/* Sales by Country section */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-gray-600 text-sm font-medium pb-0 mb-0">Sales by Country</h4>
          <span className="text-gray-600 text-sm font-medium">Sales</span>
        </div>

        {salesData.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <div className="flex items-center w-2/5">
<img src={item.img} alt={item.flag}  className="pr-2"/>
              <div>
                <p className="text-gray-800 text-sm font-medium leading-none">{item.sales}</p>
                <p className="text-gray-500 text-xs">{item.country}</p>
              </div>
            </div>
            <div className="w-2/5 relative h-2 bg-gray-200 rounded-full mx-2">
              <div
                className="absolute h-full rounded-full"
                style={{
                  width: `${parseFloat(item.sales) / 5 * 100}%`, // Dynamic width based on sales, max 5K
                  backgroundColor: item.trend === "up" ? "#22C55E" : "#EF4444", // Green for up, Red for down
                }}
              ></div>
            </div>
            <div className="w-1/5 text-right">
              <span
                className={`text-xs font-semibold ${
                  item.trend === "up" ? "text-green-500" : "text-red-500"
                } flex items-center justify-end`}
              >
                {item.trend === "up" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-0.5">
                    <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.79a.75.75 0 1 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.178V16.25c0 .414-.336.75-.75.75Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-0.5">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.178a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.178V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                  </svg>
                )}
                {item.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View Insight button */}
      <button className="w-full mt-3 py-2 px-4 border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
        View Insight
      </button>
    </div>
  );
}

export default SalesInsights;