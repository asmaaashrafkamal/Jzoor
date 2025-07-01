import React, { useEffect, useRef, useState, useContext } from "react";
import { HashLink } from "react-router-hash-link";
import { Link, useNavigate }  from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import "../App.css";

// أيقونات
import {
  FaBars,
  FaXmark,
  FaMagnifyingGlass,
  FaHeart,
  FaCartShopping,
} from "react-icons/fa6";
import { FaSignInAlt, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#Home");
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIcon, setActiveIcon] = useState("");

  const mobileSearchRef = useRef();
  const menuBtnRef = useRef();
  const mobileNavRef = useRef();

  const { products, setSelectedProduct,cart } = useContext(ProductContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close mobile search if open and click is outside
      if (
        mobileSearchOpen &&
        !mobileSearchRef.current?.contains(e.target) &&
        !e.target.closest("#mobileSearchBtn")
      ) {
        setMobileSearchOpen(false);
      }

      // Close mobile nav if open and click is outside of the nav and the menu button
      // IMPORTANT: Add a check to ensure the menu button itself doesn't trigger a close when it's meant to open/close
      if (
        mobileNavOpen &&
        !mobileNavRef.current?.contains(e.target) &&
        !menuBtnRef.current?.contains(e.target)
      ) {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileSearchOpen, mobileNavOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          const link = document.querySelector(
            `nav a[href="/#${id}"], nav a[href="#${id}"]`
          );
          if (entry.isIntersecting && link) {
            setActiveLink(`#${id}`);
            setActiveIcon("");
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchInput("");
    setSuggestions([]);
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
  };

  const sections = [
    "Home",
    "About",
    "Products",
    "Gifts",
    "Tools",
    "Journals",
    "contact",
  ];

  return (
    <section className="w-full bg-white fixed z-50 shadow-md">
      <div className="container">
        <header className="flex justify-between items-center gap-6 flex-wrap relative">
          <Link to="/">
            <img
              src="/imges/Logo.webp"
              alt="Logo"
              className="w-[80px] h-auto md:w-[120px]"
            />
          </Link>

          {/* الروابط العلوية */}
          <nav className="items-center justify-center gap-[30px] lg:gap-[40px] font-normal md:text-[16px] lg:text-[18px] hidden lg:flex">
            {sections.map((section) => (
              <HashLink
                key={section}
                smooth
                to={`/#${section}`}
                className={`no-underline transition ${
                  activeLink === `#${section}` && activeIcon === ""
                    ? "active font-bold underline"
                    : "text-black"
                }`}
                onClick={() => {
                  setActiveLink(`#${section}`);
                  setActiveIcon("");
                }}
              >
                {section === "contact" ? "Contact Us" : section}
              </HashLink>
            ))}
          </nav>

          {/* أيقونات */}
          <div className="flex items-center gap-4 xl:gap-5 text-xl">
            {/* زر القائمة الجانبية */}
            <button
              className="block lg:hidden text-xl order-last"
              id="menuBtn"
              ref={menuBtnRef}
              onClick={(e) => {
                // Stop propagation to prevent document click listener from immediately closing it
                e.stopPropagation();
                setMobileNavOpen((prev) => !prev);
              }}
            >
              {mobileNavOpen ? <FaXmark /> : <FaBars />}
            </button>

            {/* زر البحث */}
            <button
              className="block text-xl"
              id="mobileSearchBtn"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
            >
              <FaMagnifyingGlass />
            </button>

            {/* المفضلة */}
            <Link
              to="/favorites"
              className="no-underline"
              onClick={() => setActiveIcon("favorites")}
            >
              <FaHeart
                className={`transition cursor-pointer hover:text-green ${
                  activeIcon === "favorites"
                    ? "text-green-hover"
                    : "text-black"
                }`}
              />
            </Link>

            {/* السلة */}
           <Link
  to="/cart"
  className="relative no-underline"
  onClick={() => setActiveIcon("cart")}
>
  <FaCartShopping
    className={`transition cursor-pointer hover:text-green ${
      activeIcon === "cart" ? "text-green-hover" : "text-black"
    }`}
  />
  {cart.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-red text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
      {cart.length}
    </span>
  )}
</Link>


            {/* تسجيل الدخول */}
            <Link
              to="/login"
              className="no-underline hidden md:inline-block"
              onClick={() => setActiveIcon("login")}
            >
              <FaSignInAlt
                className={`transition cursor-pointer hover:text-green ${
                  activeIcon === "login" ? "text-green-hover " : "text-black"
                }`}
              />
            </Link>

            {/* البروفايل */}
            <Link
              to="/profile"
              className="hidden"
              onClick={() => setActiveIcon("profile")}
            >
              <FaUserCircle
                className={`transition cursor-pointer hover:text-green ${
                  activeIcon === "profile"
                    ? "text-green-hover "
                    : "text-black"
                }`}
              />
            </Link>
          </div>

          {/* مربع البحث للموبايل */}
          {mobileSearchOpen && (
            <div
              id="mobileSearchContainer"
              ref={mobileSearchRef}
              className="w-full relative mb-2.5"
            >
              <div className="flex items-center w-full h-[50px] border border-[#4B5929] rounded-[10px] px-4 relative">
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="flex-1 h-full text-[16px] focus:outline-none placeholder:text-[#777] pr-10"
                />
                <FaMagnifyingGlass className="text-[#4B5929] text-lg ml-2" />
                {suggestions.length > 0 && (
                  <ul className="h-[400px] overflow-y-auto absolute top-full left-0 w-full bg-white border border-gray-200 rounded mt-1 z-10">
                    {suggestions.map((product) => (
                      <li
                        key={product.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(product)}
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* القائمة الجانبية للموبايل */}
          <div
            id="mobileNav"
            ref={mobileNavRef}
            className={`lg:hidden ${
              mobileNavOpen ? "flex" : "hidden"
            } flex-col items-center w-full bg-white shadow-md rounded-lg text-[18px] font-medium flex-wrap text-center z-[100]`}
          >
            {sections.map((section) => (
              <HashLink
                key={section}
                smooth
                to={`/#${section}`}
                className="block border-b border-gray-200 py-2 text-black no-underline"
                onClick={() => {
                  setMobileNavOpen(false);
                  setActiveLink(`#${section}`);
                  setActiveIcon("");
                }}
              >
                {section === "contact" ? "Contact Us" : section}
              </HashLink>
            ))}
            <Link
              to="/login"
              className="block py-2 text-black no-underline"
              onClick={() => {
                setActiveIcon("login");
                setMobileNavOpen(false); // Close mobile nav when clicking login
              }}
            >
              <FaSignInAlt /> Login
            </Link>
            <Link
              to="/profile"
              className="block py-2 text-black no-underline"
              onClick={() => {
                setActiveIcon("profile");
                setMobileNavOpen(false); // Close mobile nav when clicking profile
              }}
            >
              <FaUserCircle /> Profile
            </Link>
          </div>
        </header>
      </div>
    </section>
  );
}