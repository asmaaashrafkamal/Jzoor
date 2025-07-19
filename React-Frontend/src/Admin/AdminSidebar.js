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
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';
import { FaUserFriends, FaStore, FaTruck } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
 const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout request
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const [open, setOpen] = useState('1');
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const links = [
    { to: '/admin', label: 'Dashboard', icon: <FaChartLine />, end: true },
    { to: '/admin/Order', label: 'Order Management', icon: <FaCartShopping /> },
    { to: '/admin/Article', label: 'Article Management', icon: <GrArticle /> },
    // { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
    ];
    const link2=[
      { to: '/admin/category', label: 'Categories', icon: <BiSolidCategoryAlt /> },
      { to: '/admin/transaction', label: 'Transactions', icon: <GrTransaction /> },

    ]

  const Product = [
    { to: '/admin/addProduct', label: 'Add Product', icon: <GrAddCircle /> },
    { to: '/admin/productList', label: 'Product List', icon: <CgList /> },
    { to: '/admin/productReview', label: 'Product Review', icon: <MdOutlineReviews /> },
  ];

  return (
    <aside
      className={`bg-white text-black min-h-screen p-4 shadow-md fixed h-screen md:h-auto overflow-y-auto custom-scroll-hide top-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
    >
      {/* الشعار وزر الإغلاق للشاشات الصغيرة */}
      <div className="flex justify-between items-center mb-4 ">
        <img src="imges/logo.webp" alt="logo" className="w-[70px]" />
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




      <nav className="space-y-3 pt-2">
        {link2.map(({ to, label, icon, end }) => (
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

      <div className="space-y-3 mt-2">
  {/* زر المستخدمين مع أيقونة وسهم */}
  <div
    onClick={() => toggle('1')}
    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition
      ${open === '1' ? 'bg-green text-white font-bold' : 'text-gray-700 hover:bg-green-800'}`}
  >
    <div className="flex items-center gap-3 ">
      <FaUsers />
      <span>Users</span>
    </div>
    {/* السهم المتغير */}
    <svg
      className={`w-4 h-4 transform transition-transform duration-300 ${open === '1' ? 'rotate-180' : 'rotate-0'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  {/* الروابط الفرعية */}
  <Accordion open={open} toggle={toggle} className="border-none shadow-none">
    <AccordionItem className="border-none">
    <AccordionBody accordionId="1" className="ps-6 pt-2 space-y-2 border-none">
  {[
    { to: 'users/customers', label: 'Customers', icon: <FaUserFriends /> },
    { to: 'users/sellers', label: 'Sellers', icon: <FaStore /> },
    { to: 'users/delivery', label: 'Delivery', icon: <FaTruck /> },
  ].map(({ to, label, icon }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-2 py-2 hover:bg-gray-200 rounded-md text-sm transition no-underline w-full hover:underline ${
          isActive ? 'text-green-700 font-semibold' : 'text-gray-700 hover:text-green-700'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  ))}
</AccordionBody>

    </AccordionItem>
  </Accordion>
</div>

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

      <div className="text-md mt-6 mb-2 text-gray-600">Admin</div>
      <NavLink
        to="/admin/role"
        className={({ isActive }) =>
          `flex items-center no-underline gap-3 p-2 rounded-md hover:bg-green-800 transition ${
            isActive ? 'bg-green text-white font-bold' : 'text-gray-700'
          }`
        }
      >
        <RiAdminFill /> <span>Admin Role</span>
      </NavLink>

      {/* بيانات المستخدم */}
      {/* <div className="pt-8 flex cursor-pointer items-center justify-between">
        <img src="/imges/17 Picture.webp" alt="user" className="w-[40px]" />
        <div className="text-sm">
          <span className="block">Ahmad Kanaan</span>
        </div>
        <CiLogin className="text-xl" />
      </div> */}
   <div className="relative pt-8" ref={dropdownRef}>
  {/* User Info Clickable */}
  <div
    className="flex cursor-pointer items-center justify-between"
    onClick={toggleDropdown}
  >
    <img
      src="/imges/17 Picture.webp"
      alt="user"
      className="w-[40px] rounded-full"
    />
    <div className="text-sm mx-2">
      <span className="block">Ahmad Kanaan</span>
    </div>
    <CiLogin className="text-xl" />
  </div>

  {/* Dropdown */}
  {isDropdownOpen && (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  )}
</div>


      <div className="pt-4 flex cursor-pointer items-center justify-between">
        <AiOutlineShop className="text-3xl" />
        <div className="text-sm">
          <span className="block">Your Shop</span>
        </div>
        <LuSquareArrowOutUpRight className="text-xl text-gray-700" />
      </div>
    </aside>
  );
};

export default AdminSidebar;
