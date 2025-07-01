import React, { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";

const GiftDetails = () => {
  const {
    selectedGift,
    handleAddToCart,
    handleAddToFavorite,
    favorites,
  } = useContext(ProductContext);

  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  if (!selectedGift) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        No Gift selected.
      </div>
    );
  }

  const isFavorite = favorites?.some((item) => item.id === selectedGift.id);

  const AddToCart = () => {
    const productWithOptions = {
      ...selectedGift,
      quantity,
    };
    handleAddToCart(productWithOptions);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  };

  const AddToFavorites = () => {
    handleAddToFavorite(selectedGift);
  };

  return (
    <section className="min-h-screen py-16 container pt-[120px]">
      <div className="max-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white p-6 md:p-10 rounded-2xl shadow-lg">
        {/* صورة الهدية */}
        <div>
          <img
            src={selectedGift.img}
            alt={selectedGift.name}
            className="w-full h-[420px] object-cover rounded-xl shadow"
          />
        </div>

        {/* معلومات الهدية */}
        <div className="flex flex-col gap-1 text-[#4B5929]">
          <h2 className="text-3xl font-bold">{selectedGift.name}</h2>
          <p className="text-gray-600">
            A hardy evergreen with silver-green leaves, perfect for patios and indoor spaces.
          </p>

          {/* التقييم */}
          <div className="flex items-center gap-2 text-yellow-500 mt-1">
            <div className="flex text-lg">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </div>
            <span className="text-black font-semibold ml-1">4.2</span>
            <span className="text-gray-500 text-sm">(210 Reviews)</span>
          </div>

          {/* السعر */}
          <p className="text-2xl font-bold mt-2">${selectedGift.new_price}</p>

          {/* عرض كمية المخزون */}
          <p className="text-sm text-gray-600 mt-1">
            Stock Level:{" "}
            <span className={selectedGift.stock_level > 10 ? "text-green" : "text-red"}>
              {selectedGift.stock_level}
            </span>
          </p>

          {/* الكمية والمفضلة */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <div className="flex items-center border border-[#af926a] rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-xl text-[#4B5929]"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-xl text-[#4B5929]"
              >
                +
              </button>
            </div>

            <button
              onClick={AddToFavorites}
              className="flex items-center border border-[#af926a] px-4 py-1 rounded-full text-[#4B5929] hover:bg-[#f0e7da] transition"
            >
              {isFavorite ? "Favorited" : "Add To Favorites"}
              <i
                className={`ml-2 fa-heart ${
                  isFavorite ? "fas text-[#4B5929]" : "far"
                }`}
              ></i>
            </button>
          </div>

          {/* زر الإضافة للسلة */}
          <button
            onClick={AddToCart}
            className="mt-5 w-full md:w-auto bg-[#4B5929] text-white px-6 py-3 rounded-md hover:bg-[#2f3a1c] transition font-semibold"
          >
            Add To Cart
          </button>
        </div>
      </div>

      {/* Toast Message */}
      {showToast && <Toast message="Added to cart!" />}
    </section>
  );
};

const Toast = ({ message }) => {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green text-white px-4 py-2 rounded shadow-lg z-50">
      ✅ {message}
    </div>
  );
};

export default GiftDetails;
