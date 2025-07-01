import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

export default function ReportChart() {
  const [activeIndex, setActiveIndex] = useState(0);

  const stats = [
    { label: "Customers", value: "52k" },
    { label: "Total Product", value: "3.5k" },
    { label: "Stock Product", value: "2.5k" },
    { label: "Out of Stock", value: "0.5k" },
    { label: "Revenue", value: "250k" },
  ];

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Visitors",
        data: [4000, 4500, 4700, 3000, 6000, 5200],
        borderColor: "#4EA674",
        backgroundColor: "rgba(78, 166, 116, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#4EA674",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value / 1000}k`,
        },
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="border rounded-2xl p-4 shadow-md bg-white">
      <div className="">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Report for this week</h3>
          {/* <div className="gap-2 px-2 flex items-center rounded-sm bg-[#F0F3FF]">
            <button className="text-xs text-green bg-white  rounded px-2 py-1">This week</button>
            <button className="text-xs text-gray-500  rounded px-2 py-1">Last week</button>
          </div> */}
        </div>

        {/* المؤشرات */}
        <div className="flex gap-4 justify-between text-center text-sm text-gray-500 my-4 ">
          {stats.map((stat, index) => (
            <span
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`text-xl text-black cursor-pointer p-1 transition-all ${
                activeIndex === index
                  ? "border-b-2 border-[#4EA674] bg-[#f3f4f6]/50"
                  : "hover:border-b-2 hover:border-[#4EA674]"
              }`}
            >
              {stat.value}
              <span className="text-gray-400 text-[12px] block">{stat.label}</span>
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-2 mb-4">Oct 11 11:29 am</p>

      <Line data={data} options={options} />
    </div>
  );
}
