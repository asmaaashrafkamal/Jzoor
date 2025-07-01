import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("Customer"); // القيمة الافتراضية

  const handleSubmit = (e) => {
    e.preventDefault();

    // تحقق وهمي - يمكن استبداله بتحقق حقيقي
    if (accountType === "Seller") {
      navigate("/SellerLogin");
    } else {
      navigate("/Login");
    }
  };

  return (
    <main className="pt-[40px] pb-[40px] px-[20px] w-full flex justify-center">
      <div
        className="bg-white shadow-lg rounded-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
        style={{
          height: "calc(100vh + 80px)",
          boxShadow: "0 0 10px rgba(0,0,0,.3)",
        }}
      >
        {/* Form Section */}
        <form
          className="bg-white p-8 rounded-md w-full max-w-sm"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Get Started Now
          </h2>
          <div className="space-y-4">
            <div className="text-left">
              <label
                htmlFor="full-name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="full-name"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#4B5929] placeholder:text-[14px]"
                placeholder="Your Full Name"
              />
            </div>
            <div className="text-left">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#4B5929] placeholder:text-[14px]"
                placeholder="Your Email"
              />
            </div>
            <div className="text-left">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password (6+)
              </label>
              <input
                type="password"
                id="password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#4B5929] placeholder:text-[14px]"
                placeholder="Your Password"
              />
            </div>
            <div className="text-left">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#4B5929] placeholder:text-[14px]"
                placeholder="Confirm Your Password"
              />
            </div>

            {/* اختيار نوع الحساب */}
            <div className="text-left">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Account Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    name="accountType"
                    value="Customer"
                    checked={accountType === "Customer"}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="mr-2"
                  />
                  Customer
                </label>
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    name="accountType"
                    value="Seller"
                    checked={accountType === "Seller"}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="mr-2"
                  />
                  Seller
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree"
                className="mr-2 leading-tight"
              />
              <label
                className="inline-block text-gray-700 text-sm"
                htmlFor="agree"
              >
                I agree to the terms and conditions
              </label>
            </div>
            <button
              className="w-full bg-[#4B5929] text-white py-2 rounded hover:bg-[#3c471f] transition"
              type="submit"
            >
              Sign Up
            </button>
          </div>
          <div className="mt-6">
            <div className="flex justify-center gap-6 text-2xl text-gray-600 mt-4">
              <a
                href="#"
                className="transition-transform transform hover:-translate-y-1 duration-300"
              >
                <i className="fab fa-google text-red-500"></i>
              </a>
              <a
                href="#"
                className="transition-transform transform hover:-translate-y-1 duration-300"
              >
                <i className="fab fa-facebook text-blue-600"></i>
              </a>
              <a
                href="#"
                className="transition-transform transform hover:-translate-y-1 duration-300"
              >
                <i className="fab fa-apple text-black"></i>
              </a>
            </div>
            <div className="mt-4 text-gray-600 text-sm text-center">
              Already have an account?{" "}
              <Link to="/Login" className="text-green hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </form>

        {/* Image Section */}
        <div className="hidden md:block">
          <img
            src="/imges/894ac5fa272f5c9370388975254a0a38 1.webp"
            alt="Flowers"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </main>
  );
};

export default Register;
