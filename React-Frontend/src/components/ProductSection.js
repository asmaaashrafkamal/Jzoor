import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import ScrollReveal from "scrollreveal";
import Title from "../components/Title";
import useScrollReveal from "../assets/useScrollReveal";

const ProductSection = () => {
    useScrollReveal('.reveal-bottom', 'default');
  
  const {
    products,
    handleAddToCart,
    handleAddToFavorite,
    handleRemoveFromFavorite,
    isFavorite,
    setSelectedProduct,
  } = useContext(ProductContext);

  const productset = products.slice(0, 4); // 👈 هذا لازم يكون في الأعلى

  const [showToast, setShowToast] = useState(false);

  const handleAddToCartWithToast = (product) => {
    handleAddToCart(product);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1000);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // ✅ فعل ScrollReveal بعد تحميل المنتجات
  useEffect(() => {
    if (productset.length > 0) {
      ScrollReveal().reveal(".reveal-top-Product", {
        origin: "top",
        distance: "50px",
        duration: 1000,
        delay: 200,
        easing: "ease",
        reset: false,
        opacity: 0,
        scale: 0.9,
        interval: 100,
      });
    }
  }, [productset]);

  return (
    <div className="bg-[#fdf9f3]">
      <section className="py-[60px] container" id="Products">
        {showToast && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green text-white px-4 py-2 rounded shadow-lg z-50">
            ✅ Added to cart!
          </div>
        )}

        <Title
          name="Products"
          description="Top picks from Palestinian gardens we love"
        />

        <div className="content">
          <div className="cards sm:py-2 md:py-5">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 justify-items-center">
              {productset.map((product) => (
                <div
                  key={product.id}
                  className="reveal-top-Product group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 max-w-sm w-full cursor-pointer"
                >
                  <div className="relative w-full h-60 overflow-hidden">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300"></div>

                    <button
                      onClick={() =>
                        isFavorite(product.id)
                          ? handleRemoveFromFavorite(product.id)
                          : handleAddToFavorite(product)
                      }
                      className="absolute top-2 right-2 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center hidden group-hover:flex transition duration-300 bg-white/10 hover:bg-white/30"
                    >
                      <FaHeart
                        className={`text-lg transition-colors duration-300 ${
                          isFavorite(product.id) ? "text-red" : "text-white"
                        }`}
                      />
                    </button>

                    <p className="absolute bottom-2 left-2 text-white text-lg font-semibold bg-black/40 px-2 py-1 rounded group-hover:-translate-y-20 transition duration-300">
                      {product.name}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-1 text-sm md:text-[16px] text-gray-600">
                      <span className="line-through text-gray-400">
                        ${product.prev_price}
                      </span>
                      <span className="text-[#af926a] font-bold text-[18px]">
                        ${product.new_price}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-all duration-300 p-4 flex flex-col items-center gap-2 bg-white/90">
                      <button
                        onClick={() => handleAddToCartWithToast(product)}
                        className="bg-[#af926a] no-underline text-white w-full text-center py-2 rounded-full hover:bg-[#8B6F47] transition"
                      >
                        Add To Cart
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        onClick={() => handleProductClick(product)}
                        className="bg-[#333]/10 no-underline text-[#8B6F47] w-full text-center py-2 rounded-full border-[##8B6F47] hover:bg-[#8B6F47] hover:text-white transition"
                      >
                        More Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className=" flex justify-center mt-8 relative">
          <Link
            to="/productList"
            className="no-underline relative bg-[#4B5929] text-center hover:bg-[#A8C686] text-white font-medium text-lg px-3 py-3 rounded-[10px] transition-all duration-300 transform hover:scale-105 shadow-md cursor-pointer"
          >
            See More Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductSection;
