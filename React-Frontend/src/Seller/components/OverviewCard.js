import React from 'react'
import { FaArrowUpLong } from "react-icons/fa6";
const OverviewCard = ({ title, value, name,percentage,prev }) => {
  return (
    <div className=" rounded-2xl bg-white p-4 shadow-md">
    <h3 className="text-black text-md md:text-xl  mb-1">{title}</h3>
    <span className="text-gray-500 text-sm pt-2">Last 7 days</span>
   <div className="flex items-center gap-4 pt-3 pb-2">
   <div className="text-2xl md:text-3xl font-bold text-[#023337]">{value}</div>
   <span className="text-gray-600 text-sm">{name}</span>
   <div className="text-green-500 text-sm text-[#21C45D] flex"> <FaArrowUpLong /> {percentage}</div>
   </div>
<div classname="text-gray-600 text-sm">Prevous 7 days <span className="text-blue-800">{prev}</span> </div>
{/* <div className="flex justify-end">     
  <button className="text-sm text-gray-900 border hover:bg-slate-200 border-gray-900  mt-2 px-3 py-2 rounded-md">Details</button>
</div> */}
  </div>
  )
}

export default OverviewCard
