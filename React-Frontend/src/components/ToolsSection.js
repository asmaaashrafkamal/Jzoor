import React from "react";
import Title from "./Title";
import { Link } from "react-router-dom";
import useScrollReveal from "../assets/useScrollReveal";

const ToolsSection = () => {
    useScrollReveal('.reveal-top-tools', 'topInterval');
  
  return (
    <section className="tools pt-[60px] pb-[60px] container" id="Tools">
     <Title name="Tools & Care" description="Because every leaf deserves a little extra care" />
    
     <div className=" sm:py-2 md:py-5 cardss mx-auto grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 justify-items-center">
  {[
    {
      title: 'Pots',
      to:'/Pots',
      img: '/imges/Keep ALIVE_ 10 Best LOW Light Indoor Plants (Easy….webp', // استبدل باسم صورة حقيقي
    },
    {
      title: 'Care',
      to:'/Care',
      img: '/imges/Person Holding Green Succulent Plant · Free Stock….webp',
    },
    {
      to:'/Accessories',
      title: 'Accessories',
      img: '/imges/Monstera Macrame Wristlet, Leaf Macrame Wristlet….webp',
    },
    {
      to:'/Storage',
        title: 'Storage & Maintenance',
        img: '/imges/Storage.webp',
      },
     
  ].map((card, index) => (
    <div
      key={index}
      className="reveal-top-tools group cursor-pointer relative rounded-xl overflow-hidden bg-white max-w-sm w-full h-[400px]"
    >
      <img
        src={card.img}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out scale-110 group-hover:scale-125 group-hover:rotate-2 cursor-pointer"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-500"></div>
      <div className="absolute inset-0 flex flex-col justify-between text-white text-center z-10">
        <h2 className="text-xl md:text-2xl font-bold mt-[60px]">{card.title}</h2>
        <div className="flex justify-center mb-[60px]">
        <Link
                to={card.to}
                className="no-underline px-3 py-2 bg-[#8B6F47]/70 border-2 border-[#5a422b] hover:bg-[#5a422b] hover:border-[#4a341f]  rounded-full hidden group-hover:block translate-y-10  group-hover:translate-y-0 transition-all duration-500 text-white text-center"
              >
                See All
              </Link>
        </div>
      </div>
    </div>
  ))}
</div>

     
    </section>
  );
};

export default ToolsSection;
