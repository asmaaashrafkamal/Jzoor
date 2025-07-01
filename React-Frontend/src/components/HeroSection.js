import React from "react";
import { IoFlowerOutline } from "react-icons/io5";
import { PiFlowerLotusLight } from "react-icons/pi";
import useScrollReveal from "../assets/useScrollReveal";
// useScrollReveal
export default function HeroSection() {
  useScrollReveal('.reveal-zoom', 'zoom');  
  useScrollReveal('.reveal-top', 'top');
  return (
    <section
      id="Home"
      className=" bg-[#FAF7F2] pt-[64px]  min-h-screen flex flex-col justify-center overflow-hidden pb-10"
    >
      <div className="container" >
        {/* أيقونة الوردة في الخلفية - مخفية في الموبايل */}
     

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20 ">
      

        {/* النص */}
        <div className="reveal-top w-full order-1 md:w-1/2 sm:pt-5 md:pt-0 flex flex-col items-center md:items-start sm:text-center md:text-left">
        <h1 className="text-[30px] md:text-[36px] lg:text-[44px] font-bold leading-tight mb-4 relative  ">
            <img
              src="imges/twemoji_olive.webp"
              alt="Olive"
              className="hidden lg:block absolute w-[60px] right-[40px] top-[-10px]"
            />
            Rooted in <span className="text-[#4B5929]">Heritage,</span>{" "}
            <span className="text-[#4B5929]">Blooming</span> in Beauty
          </h1>
          <p className="text-[#5A5A45]    text-[16px] leading-relaxed font-light mb-6">
            Every plant, flower, and gift we offer tells a story — of
            Palestinian roots, timeless beauty, and the joy of giving from the
            heart. Let nature bloom in your home with the spirit of Palestine in
            every leaf and petal.
          </p>

          <div className="flex justify-center md:justify-start gap-4">
            <a href="#Products">
              <button className="bg-[#4B5929] text-white font-medium text-lg w-[130px] h-[50px] rounded-[10px] transition-all hover:scale-105 shadow-md">
                Shop Now
              </button>
            </a>
           
          </div>
        </div>
          
        {/* الصورة */}
        <div className="relative w-full order-2 md:w-1/2 flex justify-center md:justify-end">
        <div className="animate-movingy lg:block absolute text-[60px] text-green/50 right-10 top-[85%] opacity-20">
        <PiFlowerLotusLight />
      </div>
      <div className="animate-rotating lg:block absolute text-[60px] text-green/50 left-10 top-[50%] opacity-20">
        <IoFlowerOutline />
      </div>
      <div className="animate-rotating lg:block absolute text-[60px] text-green/50 right-0 top-[5%] opacity-20">
        <IoFlowerOutline />
      </div>

      
      
      

          <img
            src="imges/pngtree-white-lily-of-the-valley-bouquet-in-decorative-ceramic-vase-serene-png-image_16177895.webp"
            alt="Flower Vase"
            className="w-[250px]    md:w-[350px] lg:w-[400px] reveal-zoom"
          />
        </div>
      </div>
      </div>
    </section>
  );
}
