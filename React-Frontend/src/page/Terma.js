import React from 'react';

const Terms = () => {
  return (
    <div className="bg-[#F9F8F4] min-h-screen py-16 px-4 md:px-20 text-[#4B5929]">
      <div className="container mt-5 mx-auto bg-white shadow-md rounded-2xl p-8 md:p-12">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-[#8B6F47]">Terms & Conditions</h1>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to our online store dedicated to spreading love and greenery through plants, flowers, and gifts. By using our website, you agree to the terms below. Please read them carefully.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">2. Ordering & Delivery</h2>
          <p className="text-gray-700 leading-relaxed">
            All orders are subject to availability. We deliver across selected regions with care and precision to ensure that your plants and flowers arrive fresh and in perfect condition.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">3. Returns & Refunds</h2>
          <p className="text-gray-700 leading-relaxed">
            If you're not satisfied with your purchase, please contact us within 48 hours of delivery. We accept returns for damaged or incorrect items, and we offer full refunds or replacements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">4. Plant Care Responsibility</h2>
          <p className="text-gray-700 leading-relaxed">
            We provide clear care instructions with every plant. It’s the customer’s responsibility to ensure proper care is followed. For any doubts, our care guides and support team are always here to help.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">5. Gifting & Custom Messages</h2>
          <p className="text-gray-700 leading-relaxed">
            You can personalize your gifts with custom messages. Please ensure your message does not contain offensive or inappropriate content, as we reserve the right to edit or reject it.
          </p>
        </section>

        <section>
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">6. Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We respect your privacy. Your personal information is used solely for processing orders and improving your shopping experience. We never share your data with third parties without your consent.
          </p>
        </section>

        <div className="mt-12 text-sm text-gray-500">
          Last updated: June 16, 2025
        </div>
      </div>
    </div>
  );
};

export default Terms;
