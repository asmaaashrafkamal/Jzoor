import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import axios from "axios";
import { useLocation } from 'react-router-dom';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
const sellerName = state?.sellerName || localStorage.getItem("sellerName");

  const {
    handleAddToCart,
    handleAddToFavorite,
    favorites,
  } = useContext(ProductContext);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:8000/products_colors/${id}`)
      .then((res) => res.json())
      .then((data) =>{
  const allColors = data.map(item => ({
    id: item.id,
    color_code: item.color_code
  }));
  setColors(allColors);
      })
      .catch((error) => console.error("Error fetching product colors:", error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:8000/products_sizes/${id}`)
      .then((res) => res.json())
      .then((data) =>{
          const allSizes = data.map(item => item.size);
          setSizes(allSizes);
      })
      .catch((error) => console.error("Error fetching product sizes:", error));
  }, [id]);

  useEffect(() => {
    if (sizes.length > 0) setSelectedSize(sizes[0]);
  }, [sizes]);

  useEffect(() => {
    if (colors.length > 0) setSelectedColor(0);
  }, [colors]);

  const isFavorite = favorites?.some((item) => item.id === product?.id);

const AddToCart = async () => {
//   if (!sizes.includes(selectedSize) || !colors[selectedColor]) {
//     setShowToast("This size or color is unavailable!");
//     setTimeout(() => setShowToast(false), 2000);
//     return;
//   }

  try {
    const res = await axios.get("http://localhost:8000/check-login", {
      withCredentials: true,
    });
console.log(res.data);
 if (res.data.role != "C") {
      navigate("/login", { state: { id }}
);
      return;
    }

    const productWithOptions = {
      ...product,
      quantity,
      size: selectedSize,
      color: colors[selectedColor]?.color_code || "",
    };

    handleAddToCart(productWithOptions);
    setShowToast("Added to cart!");
    setTimeout(() => setShowToast(false), 1000);
  } catch (error) {
    // Not logged in or error – redirect to login
    navigate("/login");
  }
};


  const AddToFavorites = () => {
    handleAddToFavorite(product);
  };

  if (loading || !product) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading product details...
      </div>
    );
  }

  return (
    <section className="min-h-screen py-16 container pt-[120px]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-2xl shadow-lg">
        <div>
          <img
            src={`http://localhost:8000/storage/${product.image}`}
            alt={product.name}
            className="w-full h-[420px] object-cover rounded-xl shadow"
          />
        </div>

        <div className="flex flex-col gap-2 text-[#4B5929]">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
      {sellerName ? (
        <p className="text-green-700">Sold by: {sellerName}</p>
      ) : (
        <p className="text-red-500">Seller name not available</p>
      )}
          <div className="flex items-center gap-2 text-yellow-500 mt-1">
            <div className="flex text-lg">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </div>
            <span className="text-black font-semibold ml-1">4.2</span>
            <span className="text-gray-500 text-sm">(210 Reviews)</span>
          </div>

          <p className="text-2xl font-bold mt-2">
            ${ (product.price * (1 - product.discounted_price / 100)).toFixed(2) }
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Stock Level:{" "}
            <span className={product.stock_status === "In Stock" ? "text-green-600" : "text-red-600"}>
              {product.stock_status}
            </span>
          </p>

          {/* Size Options */}
          {sizes.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold mb-1">Pot Size</p>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`w-9 h-9 rounded-full border ${
                      selectedSize === size
                        ? "bg-[#af926a] text-white"
                        : "bg-white text-[#4B5929] border-[#af926a]"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Options */}
          {colors.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold mb-1">Pot Colors</p>
              <div className="flex gap-3">
                {colors.map((color, index) => (
                  <button
                    key={color.id || index}
                    className={`w-7 h-7 rounded-full border-2 ${
                      selectedColor === index ? "border-[#4B5929]" : "border-white"
                    }`}
                    onClick={() => setSelectedColor(index)}
                    style={{ backgroundColor: color.color_code }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Favorite */}
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
              <i className={`ml-2 fa-heart ${isFavorite ? "fas text-[#4B5929]" : "far"}`}></i>
            </button>
          </div>

          {/* Add To Cart */}
          <button
            onClick={AddToCart}
            disabled={product.stock_status !== "In Stock"}
            className={`mt-5 w-full md:w-auto px-6 py-3 rounded-md transition font-semibold ${
              product.stock_status !== "In Stock"
                ? "bg-[#4B5929] text-white hover:bg-[#2f3a1c] cursor-not-allowed"
                : "bg-[#4B5929] text-white hover:bg-[#2f3a1c]"
            }`}
          >
            {product.stock_status !== "In Stock" ? "Add To Cart" : "Add To Cart"}
          </button>
        </div>
      </div>

      {showToast && <Toast message={showToast} />}
    </section>
  );
};

const Toast = ({ message }) => (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green text-white px-4 py-2 rounded shadow-lg z-50">
    ✅ {message}
  </div>
);

export default ProductDetails;
