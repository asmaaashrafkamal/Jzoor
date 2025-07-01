import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const VerifyCode = () => {
  const navigate = useNavigate();

  // مراجع الحقول
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // حالة لحفظ الكود المُدخل
  const [otp, setOtp] = useState(Array(6).fill(""));

  // الانتقال بين الحقول
  const moveToNext = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) {
      e.target.value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (value && index < otpRefs.length - 1) {
      otpRefs[index + 1].current.focus();
    }
  };

  // عند الضغط على زر التحقق
  const submitCode = (e) => {
    e.preventDefault();
    const code = otpRefs.map((ref) => ref.current.value).join("");
    if (code.length === 6) {
      navigate("/setPass");
    }
  };

  return (
    <main className="pt-[60px] px-[20px] w-full flex justify-center">
      <div
        className="bg-white shadow-lg rounded-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
        style={{ height: "calc(100vh - 120px)", boxShadow: "0 0 10px rgba(0,0,0,.3)" }}
      >
        {/* Form Section */}
        <div className="p-8 pt-2 bg-gray-100/5 relative">
        <img
            src="/imges/Logo.webp"
            className="block h-[40px]  md:h-[60px] pl-0 ml-0"
            alt="Logo"
          />
          <p className="mt-6 text-[12px] text-gray-600">
            <Link to="/ForgetPass" className="hover:underline text-black no-underline">
              &lt; Back
            </Link>
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 mt-6">Verify Code</h2>
          <p className="mb-6 text-[13px] text-gray-500">
            An authentication code has been sent to your email, please copy it here to reset your password
          </p>

          <form onSubmit={submitCode} className="space-y-4">
            <div className="flex justify-around">
              {otpRefs.map((ref, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  ref={ref}
                  className="shadow appearance-none border rounded-md w-10 h-12 py-2 border-[#4B5929] px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                  onChange={(e) => moveToNext(e, idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !e.target.value && idx > 0) {
                      otpRefs[idx - 1].current.focus();
                    }
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#4B5929] text-white py-2 rounded hover:bg-[#3c471f] transition"
           onClick={submitCode} >
              Verify
            </button>
            

            <div className="flex items-center space-x-6 absolute bottom-8 justify-center left-[100px]">
              <div className="relative">
                <div className="bg-gray-300 h-3 rounded-full w-8 lg:w-16"></div>
              </div>
              <div className="relative">
                <div className="bg-[#4B5929] h-3 rounded-full w-12 lg:w-24"></div>
              </div>
              <div className="relative">
                <div className="bg-gray-300 h-3 rounded-full w-8 lg:w-16"></div>
              </div>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block text-right">
          <img
            src="/imges/pana.webp"
            alt="verifycode"
            className="object-contain w-[350px] mt-[100px] ml-[80px]"
          />
        </div>
      </div>
    </main>
  );
};

export default VerifyCode;
