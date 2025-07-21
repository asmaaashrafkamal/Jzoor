import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link, useNavigate } from "react-router-dom";
import { FaPaypal } from 'react-icons/fa'; // لأيقونة PayPal
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  // افترض أنك تحتفظ بمعلومات الطلب الأخير في ProductContext
  // أو يمكنك تمريرها كـ state عبر navigate عند الانتقال من صفحة Cart
  const { cart } = useContext(ProductContext); // استخدام السلة كمحاكاة لمحتويات الطلب
  const navigate = useNavigate();
const [orderDetails, setOrderDetails] = useState({
  items: [],
  shippingAddress: {},
  paymentDetails: {}
});
const [loading, setLoading] = useState(true);
const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [gender, setGender] = useState('');
    const [state, setState] = useState('');
    const [address, setAdressName] = useState('');
    const [Birth_date, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const { id } = useParams(); // <-- Get `id` from the URL
console.log(id);
 useEffect(() => {
    axios.get("http://localhost:8000/check-login", { withCredentials: true })
      .then(res => {
         console.log(res.data);
        if (res.data.role == "C") {
        const u = res.data.user;
        setFullName(u.customer_name || '');
        setEmail(u.customer_email || '');
        setPhone(u.customer_phone || '');
        setBirthDate(u.customer_date || '');
        setGender(u.customer_gender || '');
        setState(u.customer_state || '');
        setAdressName(u.customer_address || '');
         console.log(res.data.user);
        } else {
         // If no session, redirect to login page
          navigate("/login");
        }
      })
      .catch(() => {
        // On any error, redirect to login page
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);
  // بيانات افتراضية للطلب (يمكن استبدالها ببيانات حقيقية من Backend)
//   const [orderDetails, setOrderDetails] = useState({
//     items: [], // ستُملأ من cart
//     shippingAddress: {
//       name: "Mariam Eqdaih",
//       street: "20 Street",
//       city: "Al-Nusirat",
//       state: "Gaza",
//       country: "Palestine",
//     },
//     paymentDetails: {
//       method: "Credit Card", // يمكن أن تكون "Cash on Delivery"
//       last4: "5676", // فقط آخر 4 أرقام إذا كانت بطاقة
//       providerIcon: <FaPaypal size={20} className="text-blue-700" />, // مثال: أيقونة PayPal
//     },
//     totalAmount: 0, // ستُحسب من items
//     orderDate: new Date().toLocaleDateString(), // تاريخ الطلب
//     orderId: "ORD" + Math.floor(Math.random() * 100000), // ID افتراضي
//   });
const fetchOrderById = async (orderId) => {
  setLoading(true);
  try {
    const res = await axios.get(`http://localhost:8000/api/order/${orderId}`);
    const order = res.data;
if (!res.data || Object.keys(res.data).length === 0) {
  toast.error("Order not found.");
  navigate("/orders"); // or show a not found message
  return;
}

    const formattedOrder = {
      status: order.status,
      statusClass:
        order.status === 'Delivered' ? 'bg-green text-white'
        : order.status === 'Canceled' ? 'bg-red text-white'
        : order.status === 'Shipped' ? 'bg-yellow-500 text-white'
        : order.status === 'Returned' ? 'bg-gray-500 text-white'
        : 'bg-blue-500 text-white',
      date: new Date(order.created_at).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      orderId: order.id,
      orderNo: order.order_number || `#ORD${order.id.toString().padStart(8, '0')}`,
      totalAmount: order.total_price || 0,
      shippingAddress: {
      name: order.user?.full_name || "Guest",
      email: order.user?.email || "Guest",
      phone: order.user?.phone || "Guest",
      street: order.user?.address || "N/A",
      city: order.user?.state || "N/A"
      },
      paymentDetails: {
        method: order.payment.payment_method || "Unknown",
        status: order.payment.payment_status || "Unknown",
        paid_at: order.payment.paid_at || "Unknown",
        last4: order.card_last4 || "",
        providerIcon: <FaPaypal size={20} className="text-blue-700" />
      },
      items: order.items.map((item) => ({
        id: item.id,
        image: item.product?.image || 'http://localhost:8000/storage/products/default.jpg',
        name: item.product?.name || 'Unnamed Product',
        discount: item.product?.discounted_price	 || 'Unnamed Product',
        quantity: item.quantity || 1,
        new_price: item.unit_price || 0
      }))
    };

    setOrderDetails(formattedOrder);

  } catch (err) {
    console.error("Failed to fetch order", err);
    toast.error("Failed to load order.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (id) {
    fetchOrderById(id);
  }
}, [id]);


//   useEffect(() => {
//     // محاكاة تحميل بيانات الطلب عند تحميل الصفحة
//     // في تطبيق حقيقي، قد تجلب هذه البيانات من API بناءً على orderId
//     if (cart.length > 0) {
//       const calculatedTotal = cart.reduce(
//         (acc, item) => acc + item.new_price * item.quantity,
//         0
//       );
//       setOrderDetails(prev => ({
//         ...prev,
//         items: cart,
//         totalAmount: calculatedTotal,
//       }));
//     } else {
//         // إذا كانت السلة فارغة، يمكنك إعادة توجيه المستخدم أو عرض رسالة
//         // navigate('/cart'); // مثال: إعادة توجيه
//         console.log("No items in cart, showing dummy order details.");
//         // يمكن هنا تحميل بيانات طلب وهمية ثابتة إذا لم تكن هناك سلة
//         setOrderDetails(prev => ({
//             ...prev,
//             items: [
//                 { id: 1, name: "Jasmine & Linen Set", img: "/imges/ma4.webp", new_price: 28.00, quantity: 2 },
//                 { id: 2, name: "Olive Tree", img: "/imges/ma1.webp", new_price: 5.00, quantity: 1 },
//                 { id: 3, name: "Tatreez Mug", img: "/imges/f769ad49-1fc1-4c9c-b61e-6f8308e2897d.webp", new_price: 35.00, quantity: 1 },
//                 { id: 4, name: "Braided Leaf Keychains", img: "/imges/Discover the charm of handmade leaf-shaped….webp", new_price: 10.00, quantity: 1 },
//             ],
//             totalAmount: (28*2) + 5 + 35 + 10,
//         }));
//     }
//   }, [cart]); // يتم تشغيله عند تغيير محتويات السلة

const totalItemsCount = Array.isArray(orderDetails.items)
  ? orderDetails.items.reduce((acc, item) => acc + item.quantity, 0)
  : 0;

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
{Array.isArray(orderDetails.items) &&
  orderDetails.items.map((item) => (
                <div
              key={item.id}
              className="flex items-center space-x-4 rtl:space-x-reverse bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <img
              src={`http://localhost:8000/storage/${item.image || 'NoProduct.png'}`}
              alt={item.name || "Product image"}
              className="w-20 h-20 rounded object-cover border border-gray-200"
            />
              <div className="flex-1">
                <h3 className="font-semibold text-[#4B5929] text-md">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
                <p className="text-sm text-[#af926a] font-bold">
                  ${item.new_price}
                </p>
                <p className="text-sm text-gray-700">Discount: {item.discount}</p>

              </div>
              <p className="text-lg font-bold text-[#4B5929]">
                ${(item.new_price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4 mt-4 flex justify-between items-center font-bold text-lg text-[#4B5929]">
            <span>Total:</span>
         <span>${Number(orderDetails?.totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Right Section: Address and Payment Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Address Details */}
          <div className="bg-gray-100/40 p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-3 text-[#4B5929]">Address Details</h2>
            <p className="text-base text-gray-700 font-semibold">{orderDetails.shippingAddress.name}</p>
            <p className="text-base text-gray-700 font-semibold">{orderDetails.shippingAddress.email}</p>
            <p className="text-base text-gray-700 font-semibold">{orderDetails.shippingAddress.phone}</p>

            <p className="text-sm text-gray-600">
              {/* {orderDetails.shippingAddress.country} - {orderDetails.shippingAddress.state}, */}
               {orderDetails.shippingAddress.city}-
               {orderDetails.shippingAddress.street}
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-100/40 p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-3 text-[#4B5929]">Payment Details</h2>
            <div className="flex items-center justify-between text-base text-gray-700">
              <p className="text-base text-gray-700 font-semibold">Payment Method :

              {orderDetails.paymentDetails.method === "card" && (
                <div className="">
                   Paid With Credit Card
                {/* //   <span>**** {orderDetails.paymentDetails.last4}</span>
                //   {orderDetails.paymentDetails.providerIcon} */}
                </div>
              )}
         </p>
            </div>
            {orderDetails.paymentDetails.method === "cash" && (
              <p className="text-base text-gray-500 font-semibold">Payment will be collected upon delivery.</p>
            )}
              {/* <p className="text-base text-gray-700 font-semibold">Payment Status :{orderDetails.paymentDetails.status}</p> */}
              <p className="text-base text-gray-700 font-semibold">Paid At :{orderDetails.paymentDetails.paid_at}</p>
          </div>

          {/* Track Order Button */}
          <div className="flex justify-center mt-6">
            <Link
              to={`/trackOrder/${id}`}
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
