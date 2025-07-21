import React, { useContext, useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import ScrollReveal from "scrollreveal";
import Title from "../components/Title";
import axios from "axios";
import useScrollReveal from "../assets/useScrollReveal";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

const ProductSection = () => {
  useScrollReveal(".reveal-bottom", "default");
const navigate = useNavigate();

  const {
    handleAddToCart,
    handleAddToFavorite,
    handleRemoveFromFavorite,
    isFavorite,
    setSelectedProduct,
  } = useContext(ProductContext);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // ✅ Fetch products from category 'name1'
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/category/name1")
      .then((res) => {
        setCategory(res.data);
        setProducts(res.data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // ✅ ScrollReveal after products load
  useEffect(() => {
    if (products.length > 0) {
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
  }, [products]);
const AddToCart = async (product) => {
      try {
          const res = await axios.get("http://localhost:8000/check-login", {
                withCredentials: true,
                    });

                        if (res.data.role !== "C") {
                              navigate("/login");
                                    return;
                                        }

                                            const productWithOptions = {
                                                  ...product,
                                                        quantity: 1,
                                                              size: "", // You can add logic for selected size if needed
                                                                    color: "", // Likewise for color
                                                                        };

                                                                            handleAddToCart(productWithOptions);
                                                                                setShowToast("Added to cart!");
                                                                                    setTimeout(() => setShowToast(false), 1000);
                                                                                      } catch (error) {
                                                                                          navigate("/login");
                                                                                            }
                                                                                            };


  const handleAddToCartWithToast = (product) => {
    handleAddToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  };

//   const handleProductClick = (product) => {
//     setSelectedProduct(product);
//   };

  const topProducts = products.slice(0, 4);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (topProducts.length === 0) return <div className="text-center py-20">No products found</div>;

  return (
    <div className="bg-[#fdf9f3]">
      <section className="py-[60px] container" id="Products">
        {showToast && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green text-white px-4 py-2 rounded shadow-lg z-50">
            ✅ Added to cart!
          </div>
        )}

        <Title
          name={category?.cat_name ?? "Products"}
          description={category?.description ?? "Top picks from Palestinian gardens we love"}
        />

        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 justify-items-center">
          {topProducts.map((product) => (
            <div
              key={product.id}
              className="reveal-top-Product group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 max-w-sm w-full cursor-pointer"
            >
              <div className="relative w-full h-60 overflow-hidden">
                <img
                  src={`http://localhost:8000/storage/${product.image}`}
                  alt={product.name}
                  onError={(e) => (e.target.src = "/default-image.png")}
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
                  <span className="line-through text-gray-400">${product.price}</span>
                  <span className="text-[#af926a] font-bold text-[18px]">
                    ${(
                      parseFloat(product.price) *
                      (1 - parseFloat(product.discounted_price || 0) / 100)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-all duration-300 p-4 flex flex-col items-center gap-2 bg-white/90">
                  {/* Add To Cart */}
                           <button
                          onClick={() => AddToCart(product)}
                          disabled={product.stock_status !== "In Stock"}
                          className={`w-full text-center py-2 rounded-full border font-semibold transition
                            ${
                              product.stock_status !== "In Stock"
                                ? "bg-[#4B5929] text-white hover:bg-[#2f3a1c] cursor-not-allowed"
                                : "bg-[#4B5929] text-white hover:bg-[#2f3a1c]"
                          }`}
                        >
                        {product.stock_status !== "In Stock" ? "Add To Cart" : "Add To Cart"}
                        </button>
                                  <Link
                                      to={`/product/${product.id}`}
                                      className="bg-[#333]/10 no-underline text-[#8B6F47] w-full text-center py-2 rounded-full border hover:bg-[#8B6F47] hover:text-white transition"
                                      onClick={() => setSelectedProduct(product)}
                                  >
                                       More Details
                                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link
   to={`/productList/${category?.id}`}
   className="bg-[#4B5929] text-white px-4 py-3 rounded-[10px] hover:bg-[#A8C686] transition-all duration-300 transform hover:scale-105 shadow-md no-underline"
          >
            See More Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductSection;
