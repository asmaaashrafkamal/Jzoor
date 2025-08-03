import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineClose } from 'react-icons/ai';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const Cart = () => {
  const {
    cart,
    setCart,
    removeFromCart,
    // clearCart,
    handleIncrement,
    handleDecrement,
  } = useContext(ProductContext);
const navigate = useNavigate(); // This will throw if not inside <BrowserRouter>
const clearCart = () => {
  setCart([]);
  localStorage.removeItem("cart"); // Optional: clear from localStorage too
};
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/check-login", { withCredentials: true })
      .then((res) => {
        if (res.data.role === "C") {
          const u = res.data.user;
          setUser(u);
          setFullName(u.customer_name || "");
          setEmail(u.customer_email || "");
          setState(u.customer_state || "");
          setAddress(u.customer_address || "");
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setShowPaymentStatusModal(true);
    setPaymentStatus("processing");

    if (paymentMethod === "cash") {
      setTimeout(async () => {
        await axios.post("http://localhost:8000/place-order", {
        //   user,
          items: cart,
          total,
          method: "cash",
        });
        setPaymentStatus("success");
        clearCart();
        localStorage.removeItem("cart");
        setShowPaymentStatusModal(false);
        navigate("/profile/orders");
      }, 1000);
      return;
    }

    // Stripe Payment
    try {
      if (!stripe || !elements) {
        alert("Stripe is not loaded yet. Please try again.");
        return;
      }

      const { data } = await axios.post("http://localhost:8000/create-payment-intent", {
        amount: Math.round(total * 100),
      }, { withCredentials: true });

      const cardElement = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: fullName,
            email: email,
          },
        },
      });

      if (result.error) {
        setPaymentStatus("failed");
      } else if (result.paymentIntent.status === "succeeded") {
        await axios.post("http://localhost:8000/place-order", {
        //   user,
          items: cart,
          total,
          method: "card",
          payment_id: result.paymentIntent.id,
        });

        setPaymentStatus("success");
        clearCart();
        localStorage.removeItem("cart");
        setTimeout(() => {
          setShowPaymentStatusModal(false);
          navigate("/profile/orders");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setPaymentStatus("failed");
    }
  };

  if (loading) return <div>Checking login status...</div>;

  return (
    <>
      {cart.length === 0 ? (
        <div className="flex justify-center text-center items-center h-svh">
          <div>
            <img
              src="imges/a.webp"
              alt="empty cart"
              className="w-[150px] md:w-[250px] lg:w-[350px] mx-auto"
            />
            <p className="text-[#4B5929] text-xl md:text-3xl pt-2 font-bold">
              Oops! Your cart is empty
            </p>
            <p className="text-gray-600">Let’s fix that!</p>
            <Link
              to="/productList"
              className="bg-[#4B5929] text-white px-4 py-2 rounded-md mt-4 inline-block"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="pt-[60px] md:pt-[120px] container grid grid-cols-1 lg:grid-cols-3 gap-10 min-h-screen">
          <div className="lg:col-span-2">
            <h2 className="text-md md:text-3xl font-bold text-[#4B5929] mb-4">
              Shopping Cart
            </h2>
            <div className="space-y-6 mt-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-4 items-center bg-white p-4 border rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`http://localhost:8000/storage/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-[#4B5929] text-sm">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">${item.price}</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button onClick={() => handleDecrement(item.id)} className="w-8 h-8 border rounded-l">-</button>
                    <span className="w-10 h-8 flex items-center justify-center border-t border-b">{item.quantity}</span>
                    <button onClick={() => handleIncrement(item.id)} className="w-8 h-8 border rounded-r">+</button>
                  </div>
                  <p className="text-center font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <div className="flex justify-end">
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline text-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100/40 p-6 rounded-lg shadow-md">
            <h2 className="text-md md:text-3xl font-bold text-[#4B5929] mb-2">
              Check Out
            </h2>
            <h4 className="text-lg font-bold text-gray-600">{fullName}</h4>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 mb-4">
                Palestine - Gaza<br />{state}<br />{address}
              </p>
              <Link to="/profile" className="px-2 py-1 bg-[#B22222] text-white rounded hover:bg-[#a61b1b]">Edit</Link>
            </div>

            <div className="mb-4 border-t pt-4">
              <h5 className="font-semibold text-gray-700 mb-2">Select Payment Method:</h5>
              <div className="space-y-2 text-sm text-gray-600 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="paymentMethod" value="cash" onChange={(e) => setPaymentMethod(e.target.value)} checked={paymentMethod === "cash"} className="form-radio h-4 w-4 text-[#4B5929]" />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="paymentMethod" value="card" onChange={(e) => setPaymentMethod(e.target.value)} checked={paymentMethod === "card"} className="form-radio h-4 w-4 text-[#4B5929]" />
                  <span>Credit Card</span>
                </label>
              </div>
              {paymentMethod === "card" && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-gray-700">Card Details</label>
                  <div className="p-3 border rounded bg-white">
                    <CardElement />
                  </div>
                </div>
              )}
              {paymentMethod === "cash" && (
              <div className="mt-4 text-green-600 font-semibold">
                Cash on Delivery – no additional steps needed.
              </div>
            )}

            {paymentMethod === "apple" && (
              <div className="mt-4">
                <label className="block mb-2 font-medium text-gray-700">Apple Pay</label>
                <div className="p-3 border rounded bg-white">
                  {/* Replace this with actual Apple Pay integration component or placeholder */}
                  <p>Apple Pay will open on supported devices.</p>
                </div>
              </div>
            )}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button onClick={handlePlaceOrder} className="bg-[#B22222] text-white w-full mt-4 py-2 rounded hover:bg-[#a61b1b]">Place Order</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
