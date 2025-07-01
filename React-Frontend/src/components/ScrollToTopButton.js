import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa"; // أيقونة من react-icons
import { animateScroll as scroll } from "react-scroll";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop({ smooth: true, duration: 500 });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-green hover:bg-green-hover text-white shadow-lg transition-all duration-300"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-5 h-5" />
      </button>
    )
  );
}

export default ScrollToTopButton;
