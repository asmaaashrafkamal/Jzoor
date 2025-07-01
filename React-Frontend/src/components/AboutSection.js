import React from "react";
import useScrollReveal from "../assets/useScrollReveal";

const AboutSection = () => {
    useScrollReveal('.reveal-left', 'left');  
  useScrollReveal('.reveal-right', 'right');
  useScrollReveal('.reveal-top', 'top');

  useScrollReveal('.reveal-top-hero', 'topInterval');


  return (
    <section className="bg-white pt-6 md:py-16" id="About">
      <div className="container mx-auto max-w-6xl px-4">
        {/* القسم الرئيسي */}
        <div className="flex flex-col md:flex-row items-start md:items-center sm:gap-2 md:gap-5 px-4">
          {/* الصورة */}
          <div className="reveal-left hidden md:block flex-shrink-0 w-full md:w-1/2">
            <img
              src="imges/Group 84 (1).webp"
              alt="Olive Tree"
              className="rounded-xl object-cover   "
            />
          </div>

          {/* النص */}
          <div className="reveal-right w-full md:w-1/2 sm:text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#1d1d1d]">
              About Us – Deeply Rooted in Palestine
            </h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              At Juzoor, we believe that every plant carries a story, and every piece of land holds a memory.
            </p>
            <p className="text-gray-700 mb-3 leading-relaxed">
              Born from a love for Palestine’s nature and heritage, our mission is to promote sustainable agriculture,
              eco-education, and cultural identity.
            </p>
            <p className="text-gray-700 mb-3 leading-relaxed">
              We don’t just grow plants — we grow awareness.
            </p>
            <p className="text-gray-700 leading-relaxed italic">
              "Through our carefully selected collection of Palestinian plants, flowers, and eco-friendly gardening kits,
              we reconnect people with the land."
            </p>
          </div>
        </div>

      </div>
      
        {/* القيم */}
        <div className="bg-[#D1E7C1] mt-12 p-6 rounded-lg text-center hidden md:block">
  <h3 className="reveal-top text-lg md:text-xl font-semibold text-[#4B5929] mb-2">
    Our Values
  </h3>
  <p className="reveal-top italic font-medium text-[#4B5929] mb-6">
    "Rooted in the land. Grown with love."
  </p>

  {/* شبكة تظهر 3 أعمدة على الشاشات الصغيرة و5 أعمدة على المتوسطة وما فوق */}
  <div className="grid  grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
    {[
      { src: "imges/twemoji_olive (2).webp", label: "Connection" },
      { src: "imges/carbon_sustainability.webp", label: "Sustainability" },
      { src: "imges/Screenshot 2025-05-04 205611.webp", label: "Heritage" },
      { src: "imges/Group.webp", label: "Quality" },
      { src: "imges/Vector.webp", label: "Care & Nurture" },
    ].map((item, index) => (
      <div key={index} className="reveal-top-hero flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-full border-2 border-[#4B5929] flex items-center justify-center shadow-md transition-transform hover:scale-110">
          <img
            src={item.src}
            alt={item.label}
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
        </div>
        <span className="mt-3 text-sm md:text-base text-[#4B5929] font-medium">
          {item.label}
        </span>
      </div>
    ))}
  </div>
</div>



    </section>
  );
};

export default AboutSection;
