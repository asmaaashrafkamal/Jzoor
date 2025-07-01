import React, { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Title from "../components/Title";

const FavoriteSection = () => {
  const {
    favorites,
    handleAddToCart,
    handleAddToFavorite,
    handleRemoveFromFavorite,
    isFavorite,
    setSelectedProduct,
  } = useContext(ProductContext);

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

  const favoriteProducts = favorites;

  return (
    <section className="pt-[60px] md:pt-[120px] pb-[60px] container " id="Favorites">
      {showToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green text-white px-4 py-2 rounded shadow-lg z-50">
          ✅ Added to cart!
        </div>
      )}

      <h2 className="text-md md:text-3xl font-bold text-[#4B5929]">Your Favorites</h2>

      <div className="content">
        <div className=" py-5">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 justify-items-center">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl overflow-hidden card  transition-all duration-300 max-w-sm w-full cursor-pointer"
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
                    className="absolute top-2 right-2 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center  transition duration-300 bg-white/10 hover:bg-white/30"
                  >
                    <FaHeart
                      className={`text-lg transition-colors duration-300 ${
                        isFavorite(product.id) ? "text-red" : "text-white"
                      }`}
                    />
                  </button>

                 
                </div>
                <div className="p-3">
                <p className=" text-black text-lg font-semibold    rounded ">
                    {product.name}
                  </p>
                  <div className="flex justify-between items-center  text-sm md:text-[16px] text-gray-600">
                   
                    <span className="text-black font-bold text-[18px]">
                      ${product.new_price}
                    </span>
                    <button
                      onClick={() => handleAddToCartWithToast(product)}
                      className="bg-[#B22222] hover-bg-red no-underline shadow-md w-auto px-3 py-2 font-bold text-white w-full text-center  rounded-md hover:bg-[#8B6F47] transition"
                    >
                      Buy
                    </button>
                  </div>
                  {/* <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-all duration-300 p-4 flex flex-col items-center gap-2 bg-white/90">
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
                  </div> */}
                </div>
              </div>
            ))}
          </div>

          {favoriteProducts.length === 0 && (
            <p className="text-center text-gray-600 mt-10 text-lg">
              You have no favorite products yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FavoriteSection;
