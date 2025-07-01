import React from 'react';

const Cookies = () => {
  return (
    <div className="bg-[#F9F8F4] min-h-screen py-16 px-4 md:px-20 text-[#4B5929]">
      <div className="container mt-5 mx-auto bg-white shadow-md rounded-2xl p-8 md:p-12">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-[#8B6F47]">Cookies Policy</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-[#AF926A]">1. What Are Cookies?</h2>
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences and enhance your shopping experience for plants, gifts, and flowers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">2. Why We Use Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies to:
            <ul className="list-disc pl-6 mt-2">
              <li>Remember items in your shopping cart</li>
              <li>Personalize content and plant care suggestions</li>
              <li>Analyze site traffic and performance</li>
              <li>Save your language and region preferences</li>
            </ul>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">3. Types of Cookies We Use</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Essential Cookies:</strong> Required for basic website functions. <br />
            <strong>Performance Cookies:</strong> Help us understand how visitors interact with the site. <br />
            <strong>Marketing Cookies:</strong> Used to show you relevant plant and gift offers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">4. Managing Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            You can manage or disable cookies through your browser settings. However, some features of our store may not work properly if you disable them.
          </p>
        </section>

        <section>
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">5. Updates to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update our Cookies Policy from time to time to reflect changes in technology or regulations. Please check back regularly to stay informed.
          </p>
        </section>

        <div className="mt-12 text-sm text-gray-500">
          Last updated: June 16, 2025
        </div>
      </div>
    </div>
  );
};

export default Cookies;
