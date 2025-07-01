import React from 'react'
import OverviewCard from './components/OverviewCard'
import ReportChart from './components/ReportChart'
import SalesInsights from './components/SalesInsights'
import { TransactionHistory } from './components/TransactionHistory' 
import { TopProducts } from './components/TopProducts'
import { BestSellingProduct } from './components/BestSellingProduct'
import { AddNewProduct } from './components/AddNewProduct'

const AdminDash = () => {
  return (
    <div className="p-6 space-y-6 bg-[#f3f4f6]">
    {/* Overview cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <OverviewCard title="Total Sales" value="$30k" percentage="+10.4%" name="Sales" prev="$235" />
      <OverviewCard title="Total Orders" value="6.7k" percentage="+14.4%" name="Order" prev="7.6k" />
      <OverviewCard title="Pending " value="100" percentage="204" name="user" prev="120" />
      <OverviewCard title=" Canceled" value="40" percentage="104" name="user" prev="40" />

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

export default AdminDash
