import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SellerLogin = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // هنا ممكن تضيف تحقق لاحقاً
    navigate("/SellerDash");
  };

  return (
    <main className="pt-[100px] px-[20px] w-full flex justify-center">
      <div
        className="bg-white shadow-lg rounded-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
        style={{
          height: "calc(100vh - 130px)",
          boxShadow: "0 0 10px rgba(0,0,0,.3)",
        }}
      >
        {/* Form Section */}
        <div className="p-8 bg-gray-100/5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Enter your credentials to access your account
          </p>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#4B5929]"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter Your Password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#4B5929]"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-[#4B5929] rounded focus:ring-0"
                />
                <span className="ml-2 text-gray-600 text-xs">Remember Me</span>
              </label>
              <Link
                to="/ForgetPass"
                className="text-[#4B5929] text-xs hover:underline"
              >
                Forgot password
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-[#4B5929] text-white py-2 rounded hover:bg-[#3c471f] transition"
            >
              Log In
            </button>
          </form>
          <div className="text-center my-4 text-gray-500">or</div>
          <div className="flex justify-center gap-6 text-2xl text-gray-600 ">
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
          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/Register"
              className="text-[#4B5929] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

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

export default SellerLogin;
