import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaUsers, FaTags } from 'react-icons/fa';
import { FaCartShopping } from "react-icons/fa6";
import { GrArticle, GrTransaction, GrAddCircle } from "react-icons/gr";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { CgList } from "react-icons/cg";
import { MdOutlineReviews } from "react-icons/md";
import { RiAdminFill, RiMenuFoldLine } from "react-icons/ri";
import { CiLogin } from "react-icons/ci";
import { AiOutlineShop } from "react-icons/ai";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { IoIosSettings } from "react-icons/io";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const SellerSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const links = [
    { to: '/seller', label: 'Dashboard', icon: <FaChartLine />, end: true },
    { to: '/seller/Order', label: 'Order Management', icon: <FaCartShopping /> },
    { to: '/seller/customer', label: 'My Customers', icon: <FaUsers /> },
      { to: '/seller/transaction', label: 'Transactions', icon: <GrTransaction /> },
  ];

  const Product = [
    { to: '/seller/addProduct', label: 'Add Product', icon: <GrAddCircle /> },
    { to: '/seller/productList', label: 'Product List', icon: <CgList /> },
    { to: '/seller/productReview', label: 'Product Review', icon: <MdOutlineReviews /> },
  ];
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
      useEffect(() => {
        axios.get("http://localhost:8000/check-login", { withCredentials: true })
          .then(res => {
             console.log(res.data);
            if (res.data.role == "S") {
             console.log(res.data.user);
              setUser(res.data.user); // session data from backend
            } else {
             // If no session, redirect to login page
              navigate("/SellerLogin");
            }
          })
          .catch(() => {
            // On any error, redirect to login page
            navigate("/SellerLogin");
          })
          .finally(() => {
            setLoading(false);
          });
      }, [navigate]);
  return (
    <aside
      className={`bg-white text-black sm:min-h-screen md:h-auto p-4 shadow-md fixed h-screen overflow-y-auto custom-scroll-hide top-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
    >
      {/* الشعار وزر الإغلاق للشاشات الصغيرة */}
      <div className="flex justify-between items-center mb-4 ">
        <img src="/imges/logo.webp" alt="logo" className="w-[70px]" />
        <RiMenuFoldLine className="text-xl cursor-pointer" onClick={() => setSidebarOpen(false)} />
      </div>

      {/* محتوى الشريط الجانبي */}
      <div className="text-md my-4 text-gray-600">Main Menu</div>
      <nav className="space-y-3">
        {links.map(({ to, label, icon, end }) => (
          <NavLink
            to={to}
            key={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center no-underline gap-3 p-2 rounded-md hover:bg-green-800 transition ${
                isActive ? 'bg-green text-white font-bold' : 'text-gray-700'
              }`
            }
          >
            {icon} {label}
          </NavLink>
        ))}
      </nav>

      <div className="text-md mt-6 mb-2 text-gray-600">Product</div>
      <nav className="space-y-3">
        {Product.map(({ to, label, icon }) => (
          <NavLink
            to={to}
            key={to}
            className={({ isActive }) =>
              `flex items-center no-underline gap-3 p-2 rounded-md hover:bg-green-800 transition ${
                isActive ? 'bg-green text-white font-bold' : 'text-gray-700'
              }`
            }
          >
            {icon} {label}
          </NavLink>
        ))}
      </nav>

      <div className="text-md mt-6 mb-2 text-gray-600">Settings</div>
      <NavLink
        to="/seller/profile"
        className={({ isActive }) =>
          `flex items-center no-underline gap-3 p-2 rounded-md hover:bg-green-800 transition ${
            isActive ? 'bg-green text-white font-bold' : 'text-gray-700'
          }`
        }
      >
        <IoIosSettings /> <span>Profile Settings</span>
      </NavLink>

      {/* بيانات المستخدم */}
      <div className="pt-8 flex items-center justify-between">
  <img
     src={
      user && user.admin_image
        ? `http://localhost:8000/storage/${user.admin_image}`
        : "/imges/seller.webp" 
    }
    alt={user?.admin_name || "Seller"}
    className="w-[40px] h-[40px] rounded-full object-cover"
  />
  <div className="text-sm">
    <span className="block">{user?.admin_name || "Loading..."}</span>
  </div>
  <CiLogin className="text-xl" />
</div>

      <div className="pt-4 flex items-center justify-between">
        <AiOutlineShop className="text-3xl" />
        <div className="text-sm">
          <span className="block">Your Shop</span>
        </div>
        <LuSquareArrowOutUpRight className="text-xl text-gray-700" />
      </div>
    </aside>
  );
};

export default SellerSidebar;
