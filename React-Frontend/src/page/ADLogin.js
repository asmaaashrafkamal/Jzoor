import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ADLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

// Inside SellerLogin component
useEffect(() => {
  axios
    .get("http://localhost:8000/check-login", { withCredentials: true })
    .then((res) => {
      if (res.data.logged_in && res.data.role === "A") {
        navigate("/admin");
      }
     if (res.data.logged_in && res.data.role === "D") {
            navigate("/delivery");
          }
    })
    .catch((err) => {
      // optional: log error
      console.error("Session check failed", err);
    });
}, []);
const handleLogin = async (e) => {
  e.preventDefault();

  try {
   const response = await axios.post(
  "http://localhost:8000/login",
  {
    email,
    password,
    remember_me: rememberMe,
  },
  {
    withCredentials: true, // 🔥 Important for session cookies!
  }
);


    alert(response.data.message || "Login successful");
    console.log(response.data);
    // Redirect to dashboard
   if(response.data.role === "D"){
    navigate("/delivery");

   }
    if(response.data.role === "A"){
    navigate("/admin");

   }
  } catch (error) {
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Login failed. Please check your credentials.");
    }
  }
};
  return (
    <main className="pt-[40px] px-[20px] h-auto w-full flex justify-center items-center">
      <div
        className="bg-white shadow-lg rounded-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2  overflow-hidden"
        style={{
          height: "calc(100vh - 80px)",
          boxShadow: "0 0 10px rgba(0,0,0,.3)",
        }}
      >
        {/* Form Section */}
        <div className="px-8 bg-gray-100/5 ">
        <img src="/imges/logo.webp" alt="logo"  className="w-[90px] md:w-[150px] my-3 md:my-4 "/>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Enter your credentials to access your account
          </p>
          <form className="space-y-4 md:space-y-5">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="placeholder:text[14px] w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#4B5929]"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className=" block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                className="placeholder:text-[14px] w-full border border-gray-300 rounded px-4 py-2  focus:border-[#4B5929] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-[#4B5929] rounded focus:ring-0"
                />
                <span className="ml-2 text-gray-600 text-xs">Remember Me</span>
              </label>
              <Link
                to="/ForgetPass"
                className="no-underline text-[#4B5929] text-xs hover:underline"
              >
                Forgot password
              </Link>
            </div>
            <button onClick={handleLogin} className="w-full bg-[#4B5929] text-white py-2 md:py-3 rounded hover:bg-[#3c471f] transition">
              Log In
            </button>
          </form>





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

export default ADLogin;
