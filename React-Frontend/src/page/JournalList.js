import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Title from "../components/Title";

const JournalList = () => {
  const location = useLocation();
  const [journals, setJournals] = useState(location.state?.journals || []);
  const [loading, setLoading] = useState(!location.state?.journals);

  useEffect(() => {
    if (!location.state?.journals) {
      fetch("http://localhost:8000/api/homeJournals")
        .then((res) => res.json())
        .then((data) => {
          setJournals(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching journals:", err);
          setLoading(false);
        });
    }
  }, [location.state]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="bg-[#FAF7F2]">
      <section className="pb-[60px] pt-[50px] md:pt-[100px] container" id="Journals">
        <Title
          name="Olive Journal"
          description="A journal of tradition, nature, and the hands"
        />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 justify-center items-stretch sm:py-2 md:py-5">
          {journals.length > 0 ? (
            journals.map((journal) => (
              <Link
                to={`/JournalDetails/${journal.id}`}
                key={journal.id}
                className="reveal-top-card no-underline max-w-sm group block bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] duration-300"
              >
                <div className="relative w-full h-60 sm:h-64 md:h-72 overflow-hidden image">
                  <img
                    src={`http://localhost:8000/storage/${journal.image}`}
                    alt={journal.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex flex-col gap-1 h-[150px]">
                  <h3 className="text-[18px] font-bold text-[#333]">{journal.title}</h3>
                  <p className="text-[14px] text-gray-600">{journal.body}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No journals found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default JournalList;
