import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const JournalDetails = () => {
  const { id } = useParams();
  const { journals } = useContext(ProductContext);
  const journal = journals.find(j => j.id === parseInt(id));

  if (!journal) {
    return <div className="text-center mt-10 text-gray-500 text-lg">Journal not found</div>;
  }

  return (
    <div className="container py-10 max-w-6xl mx-auto pt-[90px]">
      {/* المقال الأساسي */}
      <div className="bg-white flex flex-col md:flex-row sm:gap-2 md:gap-5 rounded-2xl shadow-lg p-6 mb-12">
        <img
          src={journal.image}
          alt={journal.title}
          className="w-full md:w-[300px] h-[300px] md:h-[400px] object-cover rounded-xl mb-4 md:mb-0 shadow"
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[#4B5929]">
            {journal.title}
          </h1>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {journal.content}
          </p>
        </div>
      </div>

      {/* مقالات إضافية */}
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[#af926a]">
        More Journals
      </h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {journals
          .filter(j => j.id !== journal.id)
          .map(j => (
            <SwiperSlide key={j.id}>
              <Link to={`/JournalDetails/${j.id}`} className="no-underline">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full group">
                  <img
                    src={j.image}
                    alt={j.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <p className="font-semibold text-[#4B5929] group-hover:text-[#af926a] transition-colors">
                      {j.title}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default JournalDetails;
