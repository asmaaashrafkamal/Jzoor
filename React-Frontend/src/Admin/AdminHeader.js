import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { MdOutlineNotifications } from "react-icons/md";
import { RiMenuFold2Line } from "react-icons/ri";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AdminHeader = ({ setSidebarOpen }) => {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
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
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  return (
    <>
      <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between relative z-40">
        {/* Left: Menu + Title */}
        <div className="flex gap-2 md:gap-3 items-center">
          <RiMenuFold2Line
            className="text-2xl md:hidden cursor-pointer mr-2"
            onClick={() => setSidebarOpen(true)}
          />
          <div className="text-xl font-semibold">Dashboard</div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3.5 md:gap-4 lg:gap-4 ">
          {/* Search Icon (only for small screens) */}
          <FaSearch
            className="text-gray-600 text-xl cursor-pointer md:hidden"
            onClick={() => setShowSearch(!showSearch)}
          />

          {/* Search Box - visible only on md and above */}
          <div className="hidden md:flex flex-col items-center w-60  relative">
            <FaSearch className="text-gray-400 mb-1 text-[16px] absolute right-2 transform -translate-y-1/2 top-1/2" />
            <input
              name="search"
              type="search"
              placeholder="Search for product"
              className=" p-2 rounded-xl w-full focus:outline-none border focus:border-green"
            />
          </div>

          <MdOutlineNotifications className="text-gray-600 text-[24px] md:text-2xl cursor-pointer" />
          {/* <FaUserCircle className="text-gray-600 text-[24px] md:text-2xl cursor-pointer" /> */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              src="/imges/17 Picture.webp"
              alt="user"
              className="w-[40px] rounded-full border"
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
              {/* Optional: Add profile or settings */}
              {/* <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                My Profile
              </button> */}

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
   </div>
      </header>

      {/* Mobile Search Box - appears below header */}
      {showSearch && (
        <div
          ref={searchRef}
          className="md:hidden px-4 py-3 bg-white shadow-md flex flex-col items-start gap-2 relative animate-slideDown"
        >
          <FaSearch className="text-gray-600 text-[14px] absolute right-8 transform -translate-y-1/2 top-1/2" />
          <input
            name="search"
            type="search"
            placeholder="Search for product"
            className="border p-2 rounded w-full focus:outline-none focus:border-green"
          />
        </div>
      )}
    </>
  );
};

export default AdminHeader;
