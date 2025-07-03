import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import Title from "../components/Title";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // استورد useNavigate
import ScrollReveal from "scrollreveal";
import SearchComponent from "../components/SearchComponent"; // <-- استورد مكون البحث هنا

const GiftList = () => {
  const {
    gifts,
    setSelectedGift, // تستخدم لتعيين الهدية المختارة في السياق
    handleAddToCart,
    isFavorite,
    handleAddToFavorite,
    handleRemoveFromFavorite,
  } = useContext(ProductContext);
  const navigate = useNavigate(); // <-- استخدم useNavigate هنا

  useEffect(() => {
    if (gifts.length > 0) {
      ScrollReveal().reveal(".reveal-top-Gift", {
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
  }, [gifts]); // Changed dependency to prevent unnecessary re-runs for ScrollReveal

  const [showToast, setShowToast] = useState(false);

  const handleProductClick = (product) => {
    setSelectedGift(product);
  };

  const handleAddToCartWithToast = (product) => {
    handleAddToCart(product);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1000);
  };

  // دالة التعامل مع النقر على نتيجة البحث من SearchComponent
  const handleGiftSearchResultClick = (gift) => {
    setSelectedGift(gift); // قم بتعيين الهدية المختارة في السياق
    navigate(`/gift/${gift.id}`); // انتقل إلى صفحة تفاصيل الهدية
  };

  const giftsToShow = gifts;

  return (
    <section
      className="gift relative pt-[50px] md:pt-[100px] pb-[60px] bg-[#FAF7F2] overflow-hidden"
      id="Gifts"
    >
      {showToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green text-white px-4 py-2 rounded shadow-lg z-50">
          ✅ Added to cart!
        </div>
      )}

      <Title
        name="Gift Of Palestine"
        description="Thoughtful keepsakes rooted in the land"
      />

      {/* إضافة مكون البحث هنا تحت العنوان مباشرة */}
      <div className="my-2 px-4 md:px-0 max-w-lg mx-auto">
        <SearchComponent
          data={giftsToShow} // <-- مرر مصفوفة الهدايا هنا للبحث فيها
          onResultClick={handleGiftSearchResultClick} // <-- مرر دالة التعامل مع النتيجة
        />
      </div>

      <div className="cards bg-[#FAF7F2] py-5 px-20 sm:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 justify-items-center">
            {giftsToShow.map((product) => (
              <div
                key={product.id}
                className="reveal-top-Gift group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 max-w-sm w-full cursor-pointer"
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
                      className="bg-[#af926a] text-white w-full text-center py-2 rounded-full hover:bg-[#8B6F47] transition"
                    >
                      Add To Cart
                    </button>
                    <Link
                      to={`/gift/${product.id}`}
                      className="bg-[#333]/10 no-underline text-[#8B6F47] w-full text-center py-2 rounded-full border-[##8B6F47] hover:bg-[#8B6F47] hover:text-white transition"
                      onClick={() => handleProductClick(product)}
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

      <div className="flex justify-center mt-8 relative"></div>
    </section>
  );
};

export default GiftList;
