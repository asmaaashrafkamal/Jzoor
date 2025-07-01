import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // افتراضًا أنك تستخدم أيقونة البحث

const SearchComponent = ({ data, onResultClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredResults = data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (item) => {
    onResultClick(item);
    setSearchTerm(""); // مسح مربع البحث بعد الاختيار
    setSearchResults([]); // إخفاء النتائج
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleInputChange}
          // الكلاسات الجديدة هنا: focus:border-green-500 و focus:ring-green-300
          className="w-full px-4 py-2 md:py-3 border border-gray-400 rounded-md pr-10
                     focus:outline-none focus:border-green focus:ring-1 focus:ring-green
                     transition duration-200 ease-in-out"
        />
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {searchResults.length > 0 && searchTerm.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-2 shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((item) => (
            <li
              key={item.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
              onClick={() => handleResultClick(item)}
            >
              <img
                src={item.img} // تأكد أن item.img موجود
                alt={item.name}
                className="w-8 h-8 object-cover rounded"
              />
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;