import React, { useContext, useState, useEffect, useRef } from "react";
import { ProductContext } from "../context/ProductContext";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import ScrollReveal from "scrollreveal";
import Title from "../components/Title";
import useScrollReveal from "../assets/useScrollReveal";

const AdminShop = () => {
    useScrollReveal('.reveal-bottom', 'default');

    const {
        products,
        pots,
        storage,
        care,
        gifts,
        Accessories,
    } = useContext(ProductContext);

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        let productsToFilter = [];
        switch (selectedCategory) {
            case 'All':
                productsToFilter = products;
                break;
            case 'Products':
                productsToFilter = products;
                break;
            case 'Pots':
                productsToFilter = pots;
                break;
            case 'Storage':
                productsToFilter = storage;
                break;
            case 'Care':
                productsToFilter = care;
                break;
            case 'Gifts':
                productsToFilter = gifts;
                break;
            case 'Accessories':
                productsToFilter = Accessories;
                break;
            default:
                productsToFilter = products;
        }
        setFilteredProducts(productsToFilter);

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
    }, [selectedCategory, products, pots, storage, care, gifts, Accessories]);


    const handleEditProduct = (product) => {
        alert(`Edit product: ${product.name}`);
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            alert(`Delete product with ID: ${productId}`);
        }
    };

    const handleAddProduct = () => {
       Navigate("/admin/addProduct")
    };

    const openProductDetailsModal = (product) => {
        setSelectedProductDetails(product);
        setIsModalOpen(true);
        setQuantity(1);
        setSelectedSize("M");
        setSelectedColor(0);
    };

    const closeProductDetailsModal = () => {
        setIsModalOpen(false);
        setSelectedProductDetails(null);
    };

    return (
        <div className="bg-[#fdf9f3] min-h-screen">
            <section className="py-[30px] md:py-[50px] container mx-auto px-4" id="AdminProducts">
                <Title
                    name="Admin Products Management"
                    description="Manage your products, categories, and inventory."
                />

                {/* Filter/Category Buttons */}
                <div className="flex justify-center flex-wrap gap-3 mb-8 reveal-bottom">
                    {['All', 'Products', 'Pots', 'Storage', 'Care', 'Gifts', 'Accessories'].map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-sm
                                ${selectedCategory === category
                                    ? 'bg-[#4B5929] text-white hover:bg-[#A8C686]'
                                    : 'bg-white text-[#4B5929] border border-[#A8C686] hover:bg-[#e6e2da]'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Add New Product Button */}
                <div className="flex justify-end mb-8 reveal-bottom">
                    <Link to="/admin/addProduct"
                        // onClick={handleAddProduct}
                        className="flex no-underline items-center gap-2 bg-[#4B5929] text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-[#A8C686] transition-all duration-300"
                    >
                        <FaPlus /> Add New Product
                    </Link>
                </div>

                <div className="content">
                    <div className="cards sm:py-2 md:py-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                            {filteredProducts.length === 0 ? (
                                <p className="col-span-full text-center text-gray-600 text-lg">No products found in this category.</p>
                            ) : (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="reveal-top-Product group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 max-w-sm w-full"
                                    >
                                        <div
                                            className="relative w-full h-60 overflow-hidden cursor-pointer"
                                            onClick={() => openProductDetailsModal(product)}
                                        >
                                            <img
                                                src={product.img}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                            <p className="absolute bottom-2 left-2 text-white text-lg font-semibold bg-black/40 px-2 py-1 rounded group-hover:-translate-y-20 transition duration-300">
                                                {product.name}
                                            </p>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-1 text-base text-gray-600">
                                                <span className="line-through text-gray-400">
                                                    ${product.prev_price}
                                                </span>
                                                <span className="text-[#af926a] font-bold text-lg">
                                                    ${product.new_price}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="flex-1 bg-[#4B5929] no-underline text-white w-full text-center py-2 rounded-full hover:bg-[#A8C686] transition text-sm flex items-center justify-center gap-1"
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="flex-1 bg-red no-underline text-white w-full text-center py-2 rounded-full hover:bg-red-700 transition text-sm flex items-center justify-center gap-1"
                                                >
                                                    <FaTrash /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Details Modal */}
                {isModalOpen && selectedProductDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="relative bg-white p-6 rounded-2xl shadow-xl max-w-3xl w-full mx-auto animate-scale-in **max-h-[90vh] overflow-y-auto**"> {/* Added max-h and overflow-y-auto */}
                            <button
                                onClick={closeProductDetailsModal}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <FaTimes size={24} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                {/* صورة المنتج */}
                                <div>
                                    <img
                                        src={selectedProductDetails.img}
                                        alt={selectedProductDetails.name}
                                        className="w-full h-auto max-h-[420px] object-cover rounded-xl shadow-md"
                                    />
                                </div>

                                {/* معلومات المنتج */}
                                <div className="flex flex-col gap-2 text-[#4B5929]">
                                    <h2 className="text-3xl font-bold">{selectedProductDetails.name}</h2>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        A hardy evergreen with silver-green leaves, perfect for patios and indoor spaces.
                                    </p>

                                    {/* التقييم */}
                                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                                        <div className="flex text-lg">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className="fas fa-star"></i>
                                            ))}
                                        </div>
                                        <span className="text-black font-semibold ml-1">4.2</span>
                                        <span className="text-gray-500 text-xs md:text-sm">(210 Reviews)</span>
                                    </div>

                                    {/* السعر */}
                                    <p className="text-2xl font-bold mt-2">${selectedProductDetails.new_price}</p>

                                    {/* عرض كمية المخزون */}
                                    <p className="text-sm text-gray-600 mt-1">
                                        Stock Level:{" "}
                                        <span className={selectedProductDetails.stock_level > 10 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                            {selectedProductDetails.stock_level}
                                        </span>
                                    </p>

                                    {/* الحجم */}
                                    <div className="mt-3">
                                        <p className="font-semibold mb-1 text-sm">Pot Size</p>
                                        <div className="flex gap-2">
                                            {["S", "M", "L"].map((size) => (
                                                <button
                                                    key={size}
                                                    className={`w-9 h-9 rounded-full border ${
                                                        selectedSize === size
                                                            ? "bg-[#af926a] text-white"
                                                            : "bg-white text-[#4B5929] border-[#af926a]"
                                                    } text-sm font-medium transition-colors`}
                                                    onClick={() => setSelectedSize(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* اللون */}
                                    <div className="mt-3">
                                        <p className="font-semibold mb-1 text-sm">Pot Colors</p>
                                        <div className="flex gap-2">
                                            {["#4B5929", "#c4a484", "#e0d6cd", "#a67c52"].map((color, index) => (
                                                <button
                                                    key={color}
                                                    className={`w-7 h-7 rounded-full border-2 ${
                                                        selectedColor === index ? "border-[#4B5929]" : "border-gray-300"
                                                    } transition-all duration-200`}
                                                    onClick={() => setSelectedColor(index)}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* الكمية */}
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="flex items-center border border-[#af926a] rounded-full overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-3 py-1 text-xl text-[#4B5929] hover:bg-gray-100 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 text-base">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-3 py-1 text-xl text-[#4B5929] hover:bg-gray-100 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* زر إغلاق التفاصيل */}
                                    <button
                                        onClick={closeProductDetailsModal}
                                        className="mt-5 w-full md:w-auto bg-[#4B5929] text-white px-6 py-3 rounded-md hover:bg-[#2f3a1c] transition font-semibold text-lg"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminShop;