import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { MdOutlineNotifications } from "react-icons/md";
import { RiMenuFold2Line } from "react-icons/ri";

const DeliveryHeader = ({ setSidebarOpen }) => {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

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
              className="border p-2 rounded-xl w-full focus:outline-none border focus:border-green"
            />
          </div>

          <MdOutlineNotifications className="text-gray-600 text-[24px] md:text-2xl cursor-pointer" />
          {/* <FaUserCircle className="text-gray-600 text-[24px] md:text-2xl cursor-pointer" /> */}
          <img src="/imges/deivery.webp" alt="delivery" className="w-[24px] h-[24px] rounded-full " />
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

export default DeliveryHeader;
