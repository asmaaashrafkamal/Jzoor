import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axios from "axios";
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
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/report")
      .then(res => {
        setStats(res.data.stats);
        setChartData({
          labels: res.data.chart.labels,
          datasets: [
            {
              label: "Visitors",
              data: res.data.chart.data,
              borderColor: "#4EA674",
              backgroundColor: "rgba(78, 166, 116, 0.1)",
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#4EA674",
              pointRadius: 4,
            },
          ],
        });
      })
      .catch(err => console.error("Failed to fetch report data:", err));
  }, []);

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `$${value / 1000}k` },
        grid: { color: '#f3f4f6' },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="border rounded-2xl p-4 shadow-md bg-white">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Report for this week</h3>
      </div>

      <div className="flex gap-4 justify-between text-center text-sm text-gray-500 my-4">
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

      <p className="text-xs text-gray-400 mt-2 mb-4">Oct 11 11:29 am</p>

      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
}
