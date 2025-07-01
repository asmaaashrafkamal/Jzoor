import React, { useState } from 'react';

// Main Payment Component
const Payment = () => {
    // State to manage the selected payment method (Cash, Credit Card, Add New Card)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card'); // 'credit-card' is active by default in the image
    // States for credit card form inputs
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvvCode, setCvvCode] = useState('');

    /**
     * Handles the form submission.
     * Performs basic client-side validation and simulates payment processing.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default browser form submission

        // Check if the selected method requires card details
        if (selectedPaymentMethod === 'credit-card' || selectedPaymentMethod === 'add-new-card') {
            // Validate if all required fields are filled for card payment
            if (!cardHolderName || !cardNumber || !expiryDate || !cvvCode) {
                // In a real application, replace window.alert() with a custom modal/toast
                alert('Please fill in all credit card details.');
                return; // Stop function execution if validation fails
            }
            // Simulate sending data to a backend (in a real app, this would be a secure API call)
            console.log('Submitting Credit Card Details:', { cardHolderName, cardNumber, expiryDate, cvvCode });
            alert('Credit card payment simulated. Data logged to console.');
        } else if (selectedPaymentMethod === 'cash') {
            // Simulate cash payment confirmation
            alert('Cash payment selected. Proceeding with order (simulated).');
        }

        // Clear form fields after submission (optional for simulation purposes)
        setCardHolderName('');
        setCardNumber('');
        setExpiryDate('');
        setCvvCode('');
    };

    return (
        // Main container for the entire page, setting background and centering content
        <div className="min-h-screen bg-[#F0F0F0] py-16 md:py-24 flex justify-center items-start  px-4 sm:px-6 lg:px-8 font-poppins">
            {/* Inner container for the payment information card */}
            <div className="container bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.08)] flex flex-col w-full max-w-6xl overflow-hidden">
                {/* Header section of the payment page */}
                <header className="text-center py-8 text-2xl sm:text-3xl font-bold text-[#333333] border-b border-[#EEEEEE]">
                    Payment Information
                </header>

                {/* Main content area, structured with flexbox for layout */}
                <div className="main-content flex flex-col lg:flex-row p-8 lg:p-10 gap-8 lg:gap-10 flex-wrap">
                    {/* Payment Section - Left Side */}
                    <div className="payment-section flex-[2] min-w-[300px] lg:min-w-[400px] flex-grow">
                        <h2 className="text-xl sm:text-2xl text-[#333333] font-semibold mb-6">Available Payment Method</h2>

                        {/* Payment Method Radio Buttons */}
                        <div className="payment-methods flex gap-6 sm:gap-8 mb-8 flex-wrap items-center">
                            <label className="flex items-center cursor-pointer text-sm sm:text-base text-[#555555]">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={selectedPaymentMethod === 'cash'}
                                    onChange={() => setSelectedPaymentMethod('cash')}
                                    className="hidden" // Hide native radio button
                                />
                                {/* Custom radio button style */}
                                <span className={`w-4 h-4 inline-block mr-2 rounded-full border-2 ${selectedPaymentMethod === 'cash' ? 'bg-[#28A745] border-[#28A745]' : 'border-[#E0E0E0]'}`}></span>
                                Cash
                            </label>
                            <label className="flex items-center cursor-pointer text-sm sm:text-base text-[#555555]">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="credit-card"
                                    checked={selectedPaymentMethod === 'credit-card'}
                                    onChange={() => setSelectedPaymentMethod('credit-card')}
                                    className="hidden" // Hide native radio button
                                />
                                {/* Custom radio button style */}
                                <span className={`w-4 h-4 inline-block mr-2 rounded-full border-2 ${selectedPaymentMethod === 'credit-card' ? 'bg-[#28A745] border-[#28A745]' : 'border-[#E0E0E0]'}`}></span>
                                Credit Card
                            </label>
                            <label className="flex items-center cursor-pointer text-sm sm:text-base text-[#555555]">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="add-new-card"
                                    checked={selectedPaymentMethod === 'add-new-card'}
                                    onChange={() => setSelectedPaymentMethod('add-new-card')}
                                    className="hidden" // Hide native radio button
                                />
                                {/* Custom radio button style */}
                                <span className={`w-4 h-4 inline-block mr-2 rounded-full border-2 ${selectedPaymentMethod === 'add-new-card' ? 'bg-[#28A745] border-[#28A745]' : 'border-[#E0E0E0]'}`}></span>
                                Add New Card
                            </label>
                        </div>

                        {/* Info Message - always visible */}
                        <div className="info-message bg-[#FFF3CD] text-[#856404] border border-[#FFEEBA] p-4 rounded-lg mb-8 text-sm leading-relaxed">
                            We currently accept payments via Cash and Credit Card only. PayPal is not supported due to legal considerations.
                        </div>

                        {/* Credit Card Form and Visual - conditionally rendered */}
                        {(selectedPaymentMethod === 'credit-card' || selectedPaymentMethod === 'add-new-card') && (
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                                {/* Credit Card Input Form */}
                                <form onSubmit={handleSubmit} className="credit-card-form flex-1">
                                    <div className="form-group mb-5">
                                        <label htmlFor="cardHolderName" className="block mb-2 text-sm text-[#555555]">Card Holder Name</label>
                                        <input
                                            type="text"
                                            id="cardHolderName"
                                            placeholder="Enter card holder name"
                                            className="w-full px-4 py-3 border border-[#DDDDDD] rounded-lg text-base text-[#333333] outline-none focus:border-[#28A745] transition-colors duration-200"
                                            value={cardHolderName}
                                            onChange={(e) => setCardHolderName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group mb-5">
                                        <label htmlFor="cardNumber" className="block mb-2 text-sm text-[#555555]">Card Number</label>
                                        <input
                                            type="text"
                                            id="cardNumber"
                                            placeholder="•••• •••• •••• ••••"
                                            inputMode="numeric"
                                            pattern="[0-9\s]{13,19}"
                                            maxLength="19"
                                            autoComplete="cc-number"
                                            className="w-full px-4 py-3 border border-[#DDDDDD] rounded-lg text-base text-[#333333] outline-none focus:border-[#28A745] transition-colors duration-200"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())} // Format with spaces
                                        />
                                    </div>
                                    <div className="card-details flex gap-5 mb-5 flex-col sm:flex-row">
                                        <div className="form-group flex-1">
                                            <label htmlFor="expiryDate" className="block mb-2 text-sm text-[#555555]">Expiry Day</label>
                                            <input
                                                type="text"
                                                id="expiryDate"
                                                placeholder="MM/YY"
                                                pattern="(0[1-9]|1[0-2])\/?([0-9]{2})"
                                                maxLength="5"
                                                autoComplete="cc-exp"
                                                className="w-full px-4 py-3 border border-[#DDDDDD] rounded-lg text-base text-[#333333] outline-none focus:border-[#28A745] transition-colors duration-200"
                                                value={expiryDate}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                                    if (value.length > 2) {
                                                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                                    }
                                                    setExpiryDate(value);
                                                }}
                                            />
                                        </div>
                                        <div className="form-group flex-1">
                                            <label htmlFor="cvvCode" className="block mb-2 text-sm text-[#555555]">CVV Code</label>
                                            <input
                                                type="text"
                                                id="cvvCode"
                                                placeholder="•••"
                                                pattern="[0-9]{3,4}"
                                                maxLength="4"
                                                autoComplete="cc-csc"
                                                className="w-full px-4 py-3 border border-[#DDDDDD] rounded-lg text-base text-[#333333] outline-none focus:border-[#28A745] transition-colors duration-200"
                                                value={cvvCode}
                                                onChange={(e) => setCvvCode(e.target.value.replace(/\D/g, ''))} // Only allow digits
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="submit-btn bg-[#28A745] text-white px-6 py-3 rounded-lg text-lg font-semibold cursor-pointer transition-colors duration-300 hover:bg-[#218838] w-full sm:w-auto">
                                        Submit
                                    </button>
                                </form>

                                {/* Credit Card Visual - Right side of form */}
                                <div className="credit-card-visual flex-1 w-full flex justify-center lg:block lg:w-auto">
                                    <div className="relative w-full max-w-sm h-48 rounded-xl shadow-lg p-6 text-white flex flex-col justify-between overflow-hidden lg:mt-10"
                                        style={{ background: 'linear-gradient(to bottom right, #4ADE80, #16A34A)' }}> {/* Green gradient from image */}
                                        {/* Abstract pattern on card background */}
                                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://placehold.co/600x400/ffffff/000000?text=Card+Pattern')] bg-repeat opacity-10"></div>

                                        {/* VISA and OR (Mastercard) logos */}
                                        <div className="flex justify-between items-center z-10">
                                            {/* VISA text (simplified from image) */}
                                            <span className="text-sm font-bold tracking-widest">VISA</span>
                                            {/* Mastercard 'OR' - simplified as text for now */}
                                            <span className="text-base font-bold tracking-widest">OR</span>
                                            {/* You might use FontAwesome or a custom SVG icon here for actual logos */}
                                        </div>

                                        {/* Credit Card Number */}
                                        <div className="text-2xl tracking-widest font-mono z-10 mt-auto">
                                            •••• •••• •••• 2345 {/* Static for display */}
                                        </div>

                                        {/* Card Holder Name and Expiry Date */}
                                        <div className="flex justify-between items-end z-10">
                                            <div>
                                                <div className="text-xs opacity-75">Card Holder</div>
                                                <div className="text-sm font-semibold">Nourhan Mansoor</div> {/* Updated name */}
                                            </div>
                                            <div>
                                                <div className="text-xs opacity-75">Expires</div>
                                                <div className="text-sm font-semibold">02/30</div> {/* Updated expiry */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Cash Payment Info - conditionally rendered */}
                        {selectedPaymentMethod === 'cash' && (
                            <div className="cash-payment-info p-6 bg-[#E6F7FF] text-[#0056B3] border border-[#99DAFF] rounded-lg mb-8 text-base">
                                <p>You have selected Cash payment. Please ensure you have the exact amount ready upon delivery.</p>
                                <p className="mt-2 font-semibold">No card details are required for this payment method.</p>
                            </div>
                        )}

                        {/* Policy Notes */}
                        <div className="policy-note bg-[#E6F7FF] text-[#0056B3] border border-[#99DAFF] p-4 rounded-lg mt-8 text-sm leading-relaxed">
                            This operation is safe. The payment system is certified according to the International Security Standards <br/> PCI DSS
                        </div>

                        <div className="policy-note bg-[#FFF0F0] text-[#CC0000] border border-[#FFCCCC] p-4 rounded-lg mt-5 text-sm leading-relaxed">
                            <p className="font-bold mb-1 text-[#CC0000]">&#9888; Policy Note</p>
                            <p>We accept Visa and Mastercard payments from anywhere in the world as long as the cards are locally issued due to regional payment restrictions. PayPal and other international payment methods are currently not supported.</p>
                            <p className="mt-2 font-bold">Please note: Delivery is available only within Palestine.</p>
                        </div>
                    </div>

                    {/* Last Transaction Section - Right Side */}
                    <div className="last-transaction-section flex-1 min-w-[250px] lg:min-w-[300px] bg-[#FCFCFC] rounded-lg p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                        <h3 className="text-xl text-[#333333] font-semibold mb-5">Last Transaction</h3>

                        {/* Address Details Block */}
                        <div className="detail-block bg-white rounded-lg p-4 mb-5 shadow-[0_1px_5px_rgba(0,0,0,0.03)] border border-[#EEEEEE]">
                            <strong className="block text-base text-[#333333] mb-1">Address Details</strong>
                            <p className="text-sm text-[#666666]">
                                <strong className="text-[#333333]">Mariam Eqdaith</strong><br /> {/* Corrected spelling */}
                                Palestine,Gaza,<br />
                                Al-Nusirat<br /> {/* Corrected spelling */}
                                20 Street {/* Corrected street number */}
                            </p>
                        </div>

                        {/* Order Details Block */}
                        <div className="detail-block bg-white rounded-lg p-4 mb-5 shadow-[0_1px_5px_rgba(0,0,0,0.03)] border border-[#EEEEEE]">
                            <strong className="block text-base text-[#333333] mb-1">Order Details</strong>
                            {/* Updated Order Items */}
                            <div className="order-item flex justify-between items-center py-2 border-b border-dashed border-[#E0E0E0]">
                                <span className="text-sm text-[#333333]">Tatreez Mug</span>
                                <span className="price font-semibold text-[#28A745]">$35.00</span>
                            </div>
                            <div className="order-item flex justify-between items-center py-2 border-b border-dashed border-[#E0E0E0] last:border-b-0">
                                <span className="text-sm text-[#333333]">Braided Leaf Keychains</span>
                                <span className="price font-semibold text-[#28A745]">$10.00</span>
                            </div>
                        </div>

                        {/* Payment Details Summary Block */}
                        <div className="detail-block payment-summary bg-white rounded-lg p-4 shadow-[0_1px_5px_rgba(0,0,0,0.03)] border border-[#EEEEEE]">
                            <strong className="block text-base text-[#333333] mb-1">Payment Details</strong>
                            <p className="text-sm text-[#555555]">Credit Card</p>
                            <p className="text-sm text-[#555555]">•••• •••• •••• 5075</p> {/* Updated last 4 digits */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
