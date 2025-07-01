import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import Title from "../components/Title";

const JournalList = () => {
  const { journals } = useContext(ProductContext);

  return (
    <div className="bg-[#FAF7F2]">
    <section className="pb-[60px] pt-[50px] md:pt-[100px] container" 
 id="Journals"
    >
      <Title
        name="Olive Journal"
        description="A journal of tradition, nature, and the hands"
      />

      <div className="">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 justify-center items-stretch sm:py-2 md:py-5 ">
          {journals.map((journal) => (
            <Link
              to={`/JournalDetails/${journal.id}`}
              key={journal.id}
              className= "reveal-top-card no-underline max-w-sm group block bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] duration-300"
            >
              <div className="relative w-full h-60 sm:h-64 md:h-72 overflow-hidden image">
                <img
                  src={journal.image}
                  alt={journal.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4 flex flex-col gap-1 h-[150px]">
                <h3 className="text-[18px] font-bold text-[#333]">
                  {journal.title}
                </h3>
                <p className="text-[14px] text-gray-600">
                  {journal.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
       <div className=" flex justify-center mt-8 relative">
                
              </div>
    </section>
    </div>
  );
};

export default JournalList;
