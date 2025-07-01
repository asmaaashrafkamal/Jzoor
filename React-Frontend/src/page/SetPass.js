import React from "react";
import { Link } from "react-router-dom";

const SetPassword = () => {
  return (
    <main className="pt-[60px] pb-[20px] px-[20px] w-full flex justify-center">
      <div
        className="bg-white shadow-lg rounded-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
        style={{
          height: "calc(100vh - 80px)",
          boxShadow: "0 0 10px rgba(0,0,0,.3)",
        }}
      >
        {/* Form Section */}
        <div className="p-8 pt-2 bg-gray-100/5 relative">
        <img
            src="/imges/Logo.webp"
            className="block h-[40px]  md:h-[60px] pl-0 ml-0"
            alt="Logo"
          />
          <p className="mt-6 text-[12px] text-gray-600">
            <Link to="/verifyCode" className="hover:underline no-underline text-black">
              &lt; Back
            </Link>
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 mt-6">
            Set a password
          </h2>
          <p className="mb-6 text-[13px] text-gray-500">
            Your email address has been verified. Please set a secure password for your account.
          </p>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Create Password
              </label>
              <input
                type="password"
                id="new-password"
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#4B5929] placeholder:text-[14px]"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#4B5929] placeholder:text-[14px]"
              />
            </div>
            <button
              className="w-full bg-[#4B5929] text-white py-2 rounded hover:bg-[#3c471f] transition"
              type="submit"
            >
              Done
            </button>
            <div className="flex items-center space-x-6 absolute bottom-8 justify-center left-[100px]">
              <div className="relative">
                <div className="bg-gray-300 h-3 rounded-full w-8 lg:w-16"></div>
              </div>
              <div className="relative">
                <div className="bg-gray-300 h-3 rounded-full w-8 lg:w-16"></div>
              </div>
              <div className="relative">
                <div className="bg-[#4B5929] h-3 rounded-full w-12 lg:w-24"></div>
              </div>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block">
          <img
            src="/imges/ppuate.webp"
            alt="forgetPass"
            className="object-contain w-[350px] mt-[80px] ml-[80px]"
          />
        </div>
      </div>
    </main>
  );
};

export default SetPassword;
