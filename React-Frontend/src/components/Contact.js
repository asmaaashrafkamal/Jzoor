import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [state, setState] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm('service_ww5qz4h', 'template_kwosgom', e.target, '5zvNOuu6c5IGCvKjs')
      .then((result) => {
        console.log(result.text);
        setState(true);
        e.target.reset(); // تصفير الحقول بعد الإرسال
        setTimeout(() => {
          setState(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error.text);
      });
  };

  return (
    <div className="relative">
      <img
        src="imges/c0136404-6fed-4452-9bfa-984132cc8c2c 1.webp"
        alt="Contact background"
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-80"
      />
      <section className="contact container pt-[50px] pb-[50px] relative" id="contact">
        <div className="content bg-white flex flex-col md:flex-row justify-between shadow-lg rounded-lg overflow-hidden">
          <div className="img md:order-2 p-6 w-full lg:w-1/2 relative flex flex-col items-center justify-center">
            <img
              src="imges/Group 74.webp"
              alt="Contact illustration"
              className="w-full max-w-[200px] md:max-w-sm lg:max-w-[320px] mb-6"
            />
            <div className="flex lg:hidden flex-row space-x-3 justify-center mt-4">
              {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((icon, idx) => (
                <a key={idx} href="#" className="no-underline transition duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <div className="bg-[#4B5929] w-9 h-9 rounded-full flex items-center justify-center shadow-md">
                    <i className={`fab fa-${icon} text-white text-lg`}></i>
                  </div>
                </a>
              ))}
            </div>

            <div className="hidden lg:flex flex-col space-y-2 absolute -right-2 bottom-9 bg-[#A8C686] p-4 rounded-xl">
              {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((icon, idx) => (
                <a key={idx} href="#" className="no-underline transition duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <div className="bg-[#4B5929] w-9 h-9 rounded-full flex items-center justify-center shadow-md">
                    <i className={`fab fa-${icon} text-white text-lg`}></i>
                  </div>
                </a>
              ))}
            </div>

            <div className="space-y-6 w-full max-w-md mt-6 lg:mt-0 hidden md:block">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-map-marker-alt text-xl"></i>
                  <span>Palestine, Gaza, Altamal</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-phone-alt text-xl"></i>
                  <span>+2034 4040 3030</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-envelope text-xl"></i>
                  <span>Juzoor@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form pt-6 md:pt-[30px] px-4 pb-[30px] sm:px-6 md:px-10 w-full lg:w-1/2">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#4B5929] mb-2">Contact US</h2>
            <p className="text-gray-600 mb-6">We are here for you! How can we help?</p>

            {state && (
              <span className="w-full block px-4 py-1 border bg-[#4B5929]/60 text-white rounded-md mb-2">
                Your message has been sent
              </span>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5929]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="user_email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5929]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5929]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#4B5929] hover:bg-[#A8C686] w-full text-white px-6 py-3 mt-4 mb-4 rounded-md transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
