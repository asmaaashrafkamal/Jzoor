import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Title from "./Title";
import "./VoicesSection.css";
import useScrollReveal from "../assets/useScrollReveal";
import axios from 'axios';

function VoicesSection() {
  const [voicesList, setVoicesList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [show, setShow] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    review: "",
    img: "imges/a555d57c-b093-4ca1-9c58-1d5a743ba78f.webp", // صورة افتراضية
  });

  useScrollReveal(".reveal-left-voices", "leftInterval");

  useEffect(() => {
    axios.get("http://localhost:8000/all-reviews")
      .then(res => {
        setVoicesList(res.data);
      })
      .catch(err => console.error(err));
  }, []);

 
  const handleConfirmReview = () => {
    const newVoice = {
      id: voicesList.length + 1,
      ...newReview,
    };
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 1000);
    setVoicesList([...voicesList, newVoice]);
    setShowForm(false);
    setNewReview({
      name: "",
      rating: 5,
      review: "",
      img: "imges/a555d57c-b093-4ca1-9c58-1d5a743ba78f.webp",
    });
  };

  return (
    <section className="voices pt-[60px] pb-[60px] container">
      {show && (
        <p className="fixed text-white px-4 py-2 bg-green rounded-md top-[80px] left-1/2 transform -translate-x-1/2 z-50">
          {" "}
          Thanks To Add Your Voice
        </p>
      )}
      <Title name="Voices " description=" these voices bloom like jasmin" />

      <div className="content sm:py-2 md:py-5">
        <Swiper
          key={voicesList.length}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          // spaceBetween={0} // Removed this to avoid conflict with breakpoints
          breakpoints={{
            // For screens smaller than 768px, show 1 slide with some space
            0: {
              slidesPerView: 1,
              spaceBetween: 20, // Add some space between slides
            },
            // For screens 768px and up, show 2 slides
            768: {
              slidesPerView: 2,
              spaceBetween: 30, // Adjust space for larger screens if needed
            },
          }}
          className="relative custom-swiper"
        >
          {voicesList.map((voice) => (
            <SwiperSlide key={voice.id}>
              <div className="reveal-left-voices bg-[#A8C686]/50 shadow-xl rounded-lg p-8 flex items-center gap-4 relative w-[300px] md:w-[350px] lg:w-[500px] mx-auto">
                <div className="imging relative w-16 md:w-20 lg:w-36 flex-shrink-0 after:w-[20px] after:left-[-10px] after:md:w-[40px] after:md:left-[-20px]">
                  <img
                  src={`http://localhost:8000/storage/${voice.image}`} alt={voice.reviewer}                
                    className="relative z-10 w-full h-full object-cover"
                  />
                </div>
                <div className="content flex flex-col justify-center">
                  <h3 className="text-sm lg:text-md font-bold text-[#4B5929] flex items-center">
                    {voice.reviewer}
                    <span className="hidden md:inline-block ml-2 text-blue-500 text-sm">
                      ✓
                    </span>
                  </h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < voice.rate ? "text-yellow-400" : "text-white"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 md:mt-2 text-sm text-gray-700 max-w-[200px] font-bold">
                    {voice.comment}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* {showForm && (
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto space-y-4">
          <div className="flex items-center gap-4">
            <img
              src="imges/a555d57c-b093-4ca1-9c58-1d5a743ba78f.webp"
              alt="default"
              className="w-16 h-16 object-cover rounded-full"
            /> */}
            {/* <input
              type="text"
              placeholder="Your Name"
              className="border p-2 rounded w-full"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
            /> */}
          {/* </div> */}

          {/* <textarea
            rows="3"
            placeholder="Write your review..."
            className="border p-2 rounded w-full"
            value={newReview.review}
            onChange={(e) =>
              setNewReview({ ...newReview, review: e.target.value })
            }
          ></textarea>

          <div className="flex items-center gap-2">
            <label className="text-[#4B5929] font-medium">Rating:</label>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`text-2xl ${
                  newReview.rating >= num ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setNewReview({ ...newReview, rating: num })}
              >
                ★
              </button>
            ))}
          </div> */}

          {/* <button
            onClick={handleConfirmReview}
            className="bg-[#af926a] text-white px-4 py-2 rounded hover:bg-[#8B6F47] transition"
          >
            Confirm Review
          </button> */}
        {/* </div> */}
      {/* )} */}
      {/* <div className="flex justify-center mt-8 relative">
        <button
          onClick={() => setShowForm(true)}
          className="relative bg-[#4B5929] hover:bg-[#A8C686] text-white font-medium text-lg px-3 h-[50px] rounded-[10px] transition-all duration-300 transform hover:scale-105 shadow-md cursor-pointer"
        >
          Write a review &gt;
        </button>
      </div> */}
    </section>
  );
}

export default VoicesSection;