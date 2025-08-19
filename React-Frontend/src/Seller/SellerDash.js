import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OverviewCard from './components/OverviewCard'
import ReportChart from './components/ReportChart'
import SalesInsights from './components/SalesInsights'
import { TransactionHistory } from './components/TransactionHistory'
import { TopProducts } from './components/TopProducts'
import { BestSellingProduct } from './components/BestSellingProduct'
import { AddNewProduct } from './components/AddNewProduct'

const SellerDash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/check-login", { withCredentials: true })
      .then(res => {
        if (res.data.role === "S") {
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

  const [stats, setStats] = useState({
    total_sales: 0,
    prev_sales: 0,
    total_orders: 0,
    prev_orders: 0,
    pending: 0,
    canceled: 0,
  });

  useEffect(() => {
    axios.get("http://localhost:8000/Sdashboard-stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const calcChange = (current, prev) => {
    if (!prev || prev === 0) return { percentage: "0%", isPositive: true };
    const diff = ((current - prev) / prev) * 100;
    return { 
      percentage: `${diff.toFixed(1)}%`, 
      isPositive: diff >= 0 
    };
  };

  const salesChange = calcChange(stats.total_sales, stats.prev_sales);
  const ordersChange = calcChange(stats.total_orders, stats.prev_orders);

  if (loading) return <div>Checking login status...</div>;

  return (
    <div className="p-6 space-y-6 bg-[#f3f4f6]">
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <OverviewCard
    title="Total Sales"
    value={`$${stats?.total_sales || 0}`}
    percentage={salesChange.percentage}
    isPositive={salesChange.isPositive}
  />

  <OverviewCard
    title="Total Orders"
    value={stats?.total_orders || 0}
    percentage={ordersChange.percentage}
    isPositive={ordersChange.isPositive}
  />

  <OverviewCard
    title="Pending Orders"
    value={stats?.pending || 0}
    percentage="0%"
    isPositive={true}
  />

  <OverviewCard
    title="Canceled Orders"
    value={stats?.canceled || 0}
    percentage="0%"
    isPositive={false}
  />
</div>
     {/* Report Chart & Insights */}
     <div className="w-full overflow-hidden">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
    <div className="lg:col-span-7 w-full lg:h-full">
      <ReportChart />
    </div>
    <div className="lg:col-span-5 w-full lg:h-full">
      <SalesInsights />
    </div>
  </div>
</div>

<div className="w-full overflow-hidden">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
    <div className="lg:col-span-8 w-full lg:h-full">
      <TransactionHistory />
    </div>
    <div className="lg:col-span-4 w-full lg:h-full">
      <TopProducts />
    </div>
  </div>
</div>

<div className="w-full overflow-hidden">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
    <div className="lg:col-span-8 w-full">
      <BestSellingProduct />
    </div>
    <div className="lg:col-span-4 w-full">
      <AddNewProduct />
    </div>
  </div>
</div>



    </div>
  )
}

export default SellerDash
