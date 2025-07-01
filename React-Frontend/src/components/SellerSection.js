import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import Title from "./Title";
import useScrollReveal from "../assets/useScrollReveal";

const sellers = [
  {
    id: 1,
    name: "Ahmad Musaa",
    location: "Gaza",
    img: "imges/Ellipse 21.webp",
    rating: 5,
    sales: 500,
    satisfaction: 96,
    specialty: "Specialized in native Palestinian plants",
  },
  {
    id: 2,
    name: "Huda Rayan",
    location: "Jerusalem",
    img: "imges/y.webp",
    rating: 5,
    sales: 520,
    satisfaction: 90,
    specialty: "Specialized in ornamental flowers",
  },
  {
    id: 3,
    name: "Khaled Hamdan",
    location: "Safad",
    img: "imges/Ellipse 22 (1).webp",
    rating: 4,
    sales: 700,
    satisfaction: 92,
    specialty: "Specialized in herbal and medicinal plants",
  },
  {
    id: 4,
    name: "Layla Salim",
    location: "Nablus",
    img: "imges/x.webp",
    rating: 5,
    sales: 600,
    satisfaction: 94,
    specialty: "Specialized in decorative trees",
  },
];

function SellerSection() {
  useScrollReveal('.reveal-left-Seller', 'leftInterval');

  return (
    <div className="bg-[#FAF7F2]">
    <section id="Sellers" className="seller pt-[60px] pb-[60px] lg:pb-0  relative container">
      <Title name="Seller Community" description="Meet the people behind the plants" />

      {/* حاوية المحتوى بالكامل بـ px-20 */}
      <div className="content bg-white rounded-xl  relative lg:mb-5 ">
        {/* تغيير لون أزرار Swiper عبر tailwind override */}
        <style>
  {`
    .swiper-button-next,
    .swiper-button-prev {
      color: #4B5929;
      scale: 0.8;
      top: 35%;
    }

    /* زر السابق */
    .swiper-button-prev {
      left: 0px; /* mx-5 = 20px */
    }

    /* زر التالي */
    .swiper-button-next {
      right: 0;
    }

    @media (min-width: 768px) {
      .swiper-button-prev {
        left: 1.25rem; /* mx-10 = 40px */
      }

      .swiper-button-next {
        right: 1.25rem;
      }
    }
  `}
</style>


        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={3}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="py-20"
        >
          {sellers.map((seller) => (
            <SwiperSlide key={seller.id}>
              <div className="reveal-left-Seller p-2 text-center bg-white rounded-xl shadow-md w-full h-full ">
                <img
                  src={seller.img}
                  alt={seller.name}
                  className="w-24 md:w-[130px] h-24 md:h-[130px] mx-auto rounded-full object-cover mb-4 shadow-lg"
                />
                <h3 className="font-semibold text-base text-[#333]">
                  {seller.name}: From {seller.location}
                </h3>
                <div className="flex justify-center my-2 text-yellow-500">
                  {[...Array(5)].map((_, i) =>
                    i < seller.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Selling process: <span className="font-semibold">+{seller.sales}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Customer Satisfaction:{" "}
                  <span className="font-semibold">{seller.satisfaction}%</span>
                </p>
                <p className="text-xs text-gray-700 mt-2">{seller.specialty}</p>
                {/* <Link
                  to="/SellerProduct"
                  className="no-underline mb-3 inline-block mt-4 bg-[#4B5929] hover:bg-[#6c825f] text-white px-4 py-2 rounded-full font-semibold transition"
                >
                  Seller Product
                </Link> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      
      </div>
<div className=" flex justify-center mt-8 relative">
          <Link
            to="/SellerProduct"
            className="no-underline relative bg-[#4B5929] text-center hover:bg-[#A8C686] text-white font-medium text-lg px-3 py-3 rounded-[10px] transition-all duration-300 transform hover:scale-105 shadow-md cursor-pointer"
          >
            See Seller Product
          </Link>
        </div>
     
    </section>
      {/* زر JOIN NOW للموبايل */}
      <div className=" md:hidden text-center pb-4 my-6 bg-[#A8C686]/50">
        <h3 className="font-bold text-xl   rounded-tr-3xl py-2 ">
              Join Our Sellers Team!
            </h3>
            <p className=" text-lg pr-2">
              Let’s grow together... <br />
              your plants, your story, your shop!
            </p>
          <Link
            to="/register"
            className="bg-[#5a3e2b] hover:bg-[#5a3e2b]/80 no-underline text-white px-8 py-2 rounded-full text-md font-semibold shadow-lg transition duration-300"
          >
            JOIN NOW
          </Link>
        </div>
     {/* قسم التسجيل الثابت في الأسفل */}
     <div className="hidden  md:block w-[100%] px-20 bg-[#A8C686]/50 mt-20 p-8 ">
        <div className="flex container justify-around items-center flex-wrap gap-16 relative">
          <div>
            {/* <h3 className=" absolute top-[-88px] -left-20 pl-20 pr-4 rounded-tr-3xl py-3 bg-[#A8C686]/30">
              
            </h3> */}
            <p className="text-gray-600 md:text-md lg:text-xl pr-2">
              <span className="font-bold md:text-xl lg:text-3xl text-[#5a3e2b]"> Join Our Sellers Team!</span>
            <br/>
              Let’s grow together... <br />
              your plants, your story, your shop!
            </p>
          </div>
          <div className="flex md:gap-2 lg:gap-5"> 
          <img src="imges/famicons_arrow-undo (3).webp" alt="" />
          <Link
            to="/register"
            className="bg-[#5a3e2b]  hover:bg-[#5a3e2b]/80 no-underline text-white md:px-6 lg:px-12 py-3 rounded-full text-md font-bold shadow-lg transition duration-300"
          >
            JOIN NOW
          </Link>
          <img src="imges/famicons_arrow-undo (6).webp" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerSection;
