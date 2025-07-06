import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose } from 'react-icons/ai'; // Import the close icon from react-icons/ai

const Cart = () => {
  const { cart, removeFromCart, clearCart, handleIncrement, handleDecrement } =
    useContext(ProductContext);

  const [paymentMethod, setPaymentMethod] = useState(""); // Stores selected payment method (e.g., 'cash', 'visa', 'mastercard')
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'failed'
  const [showAddCardModal, setShowAddCardModal] = useState(false); // New state for Add Card modal

  // New state to store added cards
  const [cardsArray, setCardsArray] = useState([
    { id: 'visa123', type: 'Credit Card', last4: '5676', selected: true }, // Default selected card
  ]);

  // New state for form fields in Add Card modal
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expDate: '',
    cvv: '',
    country: 'United States',
    cardHolder: ''
  });

  const navigate = useNavigate();

  const total = cart.reduce(
    (acc, item) => acc + item.new_price * item.quantity,
    0
  );

  // Set the default payment method to the first card if available, or cash if no cards
  useEffect(() => {
    if (cardsArray.length > 0) {
      setPaymentMethod(cardsArray[0].id);
    } else {
      setPaymentMethod('cash'); // Default to Cash on Delivery if no cards
    }
  }, [cardsArray]);


  const simulatePaymentApiCall = async (orderData) => {
    return new Promise(resolve => {
      const isPaymentSuccessful = Math.random() > 0.3;
      setTimeout(() => {
        resolve(isPaymentSuccessful ? 'success' : 'failed');
      }, 1500);
    });
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method before placing your order.");
      return;
    }

    setShowPaymentStatusModal(true);
    setPaymentStatus('processing');

    const orderData = {
      items: cart,
      total: total.toFixed(2),
      method: paymentMethod,
      date: new Date().toISOString(),
    };

    const result = await simulatePaymentApiCall(orderData);

    if (result === 'success') {
      setPaymentStatus('success');
      console.log("✅ Order placed successfully!", orderData);

      setTimeout(() => {
        if (clearCart && typeof clearCart === 'function') {
          clearCart();
        } else {
          console.error("clearCart is not a function or is undefined.");
        }
        setShowPaymentStatusModal(false);
        navigate('/trackOrder');
      }, 2000);
    } else {
      setPaymentStatus('failed');
      console.error("❌ Payment failed due to a technical error.");
      setTimeout(() => {
        // Optionally close modal after a longer time if user doesn't close it
        // setShowPaymentStatusModal(false);
      }, 3000);
    }
  };

  const handleNewCardChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCard = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Basic validation
    if (!newCard.cardNumber || !newCard.expDate || !newCard.cvv || !newCard.cardHolder) {
      alert("Please fill all card details.");
      return;
    }

    const last4 = newCard.cardNumber.slice(-4);
    const newCardEntry = {
      id: `card${Date.now()}`, // Unique ID for the new card
      type: 'Credit Card', // You could infer type from card number if needed
      last4: last4,
      selected: false // Not selected by default
    };

    setCardsArray(prevCards => [...prevCards, newCardEntry]);
    setNewCard({
      cardNumber: '',
      expDate: '',
      cvv: '',
      country: 'United States',
      cardHolder: ''
    }); // Clear form
    setShowAddCardModal(false); // Close the modal
    setPaymentMethod(newCardEntry.id); // Select the newly added card
  };

  return (
    <>
      {cart.length === 0 ? (
        <div className="flex justify-center text-center items-center h-svh">
          <div>
            <img
              src="imges/a.webp"
              alt="empty cart"
              className="w-[150px] md:w-[250px] lg:w-[350px] block mx-auto"
            />
            <p className="text-[#4B5929] text-xl md:text-3xl pt-2 font-bold">
              Oops! Your cart is empty
            </p>
            <p className="text-gray-600">Let’s fix that!</p>
            <Link
              to="/productList"
              className="bg-[#4B5929] no-underline text-white w-fit px-4 py-2 md:py-3 rounded-md border-[#8B6F47] hover:bg-[#3c471f] hover:text-white transition shadow-md inline-block mt-4"
            >
              Start Shopping
            </Link>
            <p className="pt-2 md:pt-4 text-gray-500">
              Browse products and find your next favorite!
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-[60px] md:pt-[120px] container grid grid-cols-1 lg:grid-cols-3 gap-10 min-h-screen">
          {/* Cart Table */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-md md:text-3xl font-bold text-[#4B5929]">
                Shopping Cart
              </h2>
              <p className="font-medium">{cart.length} Items</p>
            </div>
            <div className="hidden md:grid grid-cols-4 text-sm font-semibold border-b pb-2 text-gray-700">
              <p>Product Details</p>
              <p className="text-center">Quantity</p>
              <p className="text-center">Total</p>
              <p className="text-end">Remove</p>
            </div>

            <div className="space-y-6 mt-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-4 items-center bg-white p-4 border rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <img
                  src={`http://localhost:8000/storage/${item.image}`}
                  alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-[#4B5929] text-sm">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-2 md:mt-0">
                    <button
                      onClick={() => handleDecrement(item.id)}
                      className="w-8 h-8 border rounded-l text-lg font-bold hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-10 h-8 flex items-center justify-center border-t border-b">
                      {item.stock_quantity}
                    </span>
                    <button
                      onClick={() => handleIncrement(item.id)}
                      className="w-8 h-8 border rounded-r text-lg font-bold hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-center font-semibold mt-2 md:mt-0">
                    ${(item.price * item.stock_quantity).toFixed(2)}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:underline font-semibold text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-gray-100/40 p-6 rounded-lg shadow-md border-left">
           <h2 className="text-md md:text-3xl font-bold text-[#4B5929]">
                Check Out
              </h2>
            <h4 className="text-lg font-bold mb-4 text-gray-600">
              Mariam Eqdaih
            </h4>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 mb-4">
                Palestine - Gaza
                <br /> Al-Nusirat
                <br /> 20 Street
              </p>
              <Link to="/profile" className="px-2 py-1 bg-[#B22222] no-underline text-white shadow-md rounded hover:bg-[#a61b1b] transition">Edit</Link>
            </div>

            {/* Payment Method */}
            <div className="mb-4 border-t pt-4">
              <h5 className="font-semibold text-gray-700 mb-2">
                Select Payment Method:
              </h5>
              {/* Button to show Add Card modal */}
              <button
                onClick={() => setShowAddCardModal(true)}
                className="text-green-600 hover:text-green-700 py-2 focus:outline-none"
              >
                + Add a new card
              </button>
              <div className="space-y-2 text-sm text-gray-600 mt-2">
                {/* Cash on Delivery option */}
                <label className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    checked={paymentMethod === "cash"}
                    className="form-radio h-4 w-4 text-[#4B5929]"
                  />
                  <span>Cash on Delivery</span>
                </label>
                {/* Dynamically rendered credit cards */}
                {cardsArray.map(card => (
                  <label key={card.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={card.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      checked={paymentMethod === card.id}
                      className="form-radio h-4 w-4 text-[#4B5929]"
                    />
                    <span>{card.type} (**** {card.last4})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Discount Code */}
            {/* <div className="mb-4">
              <h6 className="font-semibold text-gray-700">
                Have a Discount Code?
              </h6>
              <div className="flex mt-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="border rounded-l px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#4B5929]"
                />
                <button className="bg-[#4B5929] text-white px-4 rounded-r hover:bg-[#3c471f]">
                  Apply
                </button>
              </div>
            </div> */}

            {/* Totals */}
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
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="bg-[#B22222] text-white w-full mt-4 py-2 rounded hover:bg-[#a61b1b] transition"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Modal */}
      {showPaymentStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-sm w-full relative shadow-lg text-center">
            {/* Close button (X) - visible for processing and failed states */}
            {(paymentStatus === 'processing' || paymentStatus === 'failed') && (
              <button
                onClick={() => setShowPaymentStatusModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <AiOutlineClose size={24} />
              </button>
            )}

            {/* "Processing Payment..." state */}
            {paymentStatus === 'processing' && (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B5929] mb-4"></div>
                <h3 className="text-xl font-bold text-[#4B5929] mb-2">Processing Payment...</h3>
                <p className="text-gray-600 text-sm">Please wait while we process your order.</p>
              </div>
            )}

            {/* "Payment Success" state */}
            {paymentStatus === 'success' && (
              <div className="flex flex-col items-center justify-center">
                <img
                  src="imges/success_illustration.png"
                  alt="Payment Success"
                  className="w-32 h-32 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-[#4B5929] mb-2">Payment Succeeded!</h3>
                <p className="text-gray-600 text-sm">You have paid successfully. Redirecting...</p>
              </div>
            )}

            {/* "Payment Failed" state */}
            {paymentStatus === 'failed' && (
              <div className="flex flex-col items-center justify-center">
                <img
                  src="imges/failed_illustration.png"
                  alt="Payment Failed"
                  className="w-32 h-32 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-red-600 mb-2">Payment Failed</h3>
                <p className="text-gray-600 text-sm">Your transaction has failed due to a technical error. Please try again.</p>
                <button
                  onClick={() => setShowPaymentStatusModal(false)}
                  className="mt-4 px-4 py-2 bg-[#4B5929] text-white rounded hover:bg-[#3c471f] transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setShowAddCardModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <AiOutlineClose size={24} />
            </button>
            <h2 className="text-xl font-bold text-[#333] mb-6 text-center">Add Card</h2>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={newCard.cardNumber}
                  onChange={handleNewCardChange}
                  placeholder="Your card number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5929]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expDate" className="block text-sm font-medium text-gray-700 mb-1">Exp. Date</label>
                  <input
                    type="text"
                    id="expDate"
                    name="expDate"
                    value={newCard.expDate}
                    onChange={handleNewCardChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5929]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={newCard.cvv}
                    onChange={handleNewCardChange}
                    placeholder="123"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5929]"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  id="country"
                  name="country"
                  value={newCard.country}
                  onChange={handleNewCardChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5929]"
                >
                  <option value="United States">United States</option>
                  <option value="Palestine">Palestine</option>
                  <option value="Canada">Canada</option>
                  {/* Add more countries as needed */}
                </select>
              </div>

              <div>
                <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">Card Holder</label>
                <input
                  type="text"
                  id="cardHolder"
                  name="cardHolder"
                  value={newCard.cardHolder}
                  onChange={handleNewCardChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5929]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4B5929] text-white py-2 rounded-md font-semibold hover:bg-[#3c471f] transition mt-6"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
