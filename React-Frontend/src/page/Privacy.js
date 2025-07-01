import React from 'react';

const Privacy = () => {
  return (
    <div className="bg-[#F9F8F4] min-h-screen  py-16  md:px-20 text-[#4B5929]">
      <div className="container mt-5 mx-auto bg-white shadow-md rounded-2xl p-8 md:p-12">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-[#8B6F47]">Privacy Policy</h1>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">1. Your Privacy Matters</h2>
          <p className="text-gray-700 leading-relaxed">
            At our plant and gift store, we value your trust. This Privacy Policy outlines how we collect, use, and protect your personal data when you visit or purchase from our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">2. Data We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            We collect information such as your name, email, shipping address, and payment details to process your orders efficiently. We also use cookies to improve your browsing experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">3. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed">
            Your data helps us personalize your experience, process orders, send updates, and provide plant care tips. We may also use your email for promotional offers unless you choose to opt out.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">4. Data Protection</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement strong security measures to protect your personal data. Your payment information is encrypted and processed securely through trusted payment gateways.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">5. Sharing Your Data</h2>
          <p className="text-gray-700 leading-relaxed">
            We do not sell or trade your personal information. We may share data with delivery partners or service providers only to fulfill your order or improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-md md:text-xl font-semibold mb-2 text-[#AF926A]">6. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You have the right to access, edit, or delete your data at any time. Please contact our support team if you’d like to update your information or unsubscribe from our newsletter.
          </p>
        </section>

        <div className="mt-12 text-sm text-gray-500">
          Last updated: June 16, 2025
        </div>
      </div>
    </div>
  );
};

export default Privacy;
