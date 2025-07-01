import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link, useNavigate } from "react-router-dom";
import { FaPaypal } from 'react-icons/fa'; // لأيقونة PayPal

const OrderDetails = () => {
  // افترض أنك تحتفظ بمعلومات الطلب الأخير في ProductContext
  // أو يمكنك تمريرها كـ state عبر navigate عند الانتقال من صفحة Cart
  const { cart } = useContext(ProductContext); // استخدام السلة كمحاكاة لمحتويات الطلب
  const navigate = useNavigate();

  // بيانات افتراضية للطلب (يمكن استبدالها ببيانات حقيقية من Backend)
  const [orderDetails, setOrderDetails] = useState({
    items: [], // ستُملأ من cart
    shippingAddress: {
      name: "Mariam Eqdaih",
      street: "20 Street",
      city: "Al-Nusirat",
      state: "Gaza",
      country: "Palestine",
    },
    paymentDetails: {
      method: "Credit Card", // يمكن أن تكون "Cash on Delivery"
      last4: "5676", // فقط آخر 4 أرقام إذا كانت بطاقة
      providerIcon: <FaPaypal size={20} className="text-blue-700" />, // مثال: أيقونة PayPal
    },
    totalAmount: 0, // ستُحسب من items
    orderDate: new Date().toLocaleDateString(), // تاريخ الطلب
    orderId: "ORD" + Math.floor(Math.random() * 100000), // ID افتراضي
  });

  useEffect(() => {
    // محاكاة تحميل بيانات الطلب عند تحميل الصفحة
    // في تطبيق حقيقي، قد تجلب هذه البيانات من API بناءً على orderId
    if (cart.length > 0) {
      const calculatedTotal = cart.reduce(
        (acc, item) => acc + item.new_price * item.quantity,
        0
      );
      setOrderDetails(prev => ({
        ...prev,
        items: cart,
        totalAmount: calculatedTotal,
      }));
    } else {
        // إذا كانت السلة فارغة، يمكنك إعادة توجيه المستخدم أو عرض رسالة
        // navigate('/cart'); // مثال: إعادة توجيه
        console.log("No items in cart, showing dummy order details.");
        // يمكن هنا تحميل بيانات طلب وهمية ثابتة إذا لم تكن هناك سلة
        setOrderDetails(prev => ({
            ...prev,
            items: [
                { id: 1, name: "Jasmine & Linen Set", img: "/imges/ma4.webp", new_price: 28.00, quantity: 2 },
                { id: 2, name: "Olive Tree", img: "/imges/ma1.webp", new_price: 5.00, quantity: 1 },
                { id: 3, name: "Tatreez Mug", img: "/imges/f769ad49-1fc1-4c9c-b61e-6f8308e2897d.webp", new_price: 35.00, quantity: 1 },
                { id: 4, name: "Braided Leaf Keychains", img: "/imges/Discover the charm of handmade leaf-shaped….webp", new_price: 10.00, quantity: 1 },
            ],
            totalAmount: (28*2) + 5 + 35 + 10,
        }));
    }
  }, [cart]); // يتم تشغيله عند تغيير محتويات السلة

  const totalItemsCount = orderDetails.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="pt-[60px] md:pt-[120px] container min-h-screen px-4 md:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#333]">Order Details</h1>
          <p className="text-gray-600 text-sm md:text-base">Order ID: <span className="font-semibold">{orderDetails.orderId}</span></p>
        </div>
        <p className="font-medium text-[#4B5929]">{totalItemsCount} Items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {/* Left Section: Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#4B5929] mb-4">Ordered Items</h2>
          {orderDetails.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 rtl:space-x-reverse bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-20 h-20 rounded object-cover border border-gray-200"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-[#4B5929] text-md">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
                <p className="text-sm text-[#af926a] font-bold">
                  ${item.new_price.toFixed(2)}
                </p>
              </div>
              <p className="text-lg font-bold text-[#4B5929]">
                ${(item.new_price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4 mt-4 flex justify-between items-center font-bold text-lg text-[#4B5929]">
            <span>Total:</span>
            <span>${orderDetails.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Right Section: Address and Payment Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Address Details */}
          <div className="bg-gray-100/40 p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-3 text-[#4B5929]">Address Details</h2>
            <p className="text-base text-gray-700 font-semibold">{orderDetails.shippingAddress.name}</p>
            <p className="text-sm text-gray-600">
              {orderDetails.shippingAddress.country} - {orderDetails.shippingAddress.state},
              <br /> {orderDetails.shippingAddress.city},
              <br /> {orderDetails.shippingAddress.street}
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-100/40 p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-3 text-[#4B5929]">Payment Details</h2>
            <div className="flex items-center justify-between text-base text-gray-700">
              <p className="font-semibold">{orderDetails.paymentDetails.method}</p>
              {orderDetails.paymentDetails.method === "Credit Card" && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span>**** {orderDetails.paymentDetails.last4}</span>
                  {orderDetails.paymentDetails.providerIcon}
                </div>
              )}
            </div>
            {orderDetails.paymentDetails.method === "Cash on Delivery" && (
              <p className="text-sm text-gray-600 mt-1">Payment will be collected upon delivery.</p>
            )}
          </div>

          {/* Track Order Button */}
          <div className="flex justify-center mt-6">
            <Link
              to="/trackOrder"
              className="bg-[#B22222] text-white no-underline w-full text-center py-3 rounded-md hover:bg-[#a61b1b] transition font-semibold text-lg "
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;