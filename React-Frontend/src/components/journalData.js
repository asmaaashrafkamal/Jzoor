import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Title from "../components/Title";
import { Link } from "react-router-dom";

const OliveJournal = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/homeJournals`)
      .then((res) => {
        setJournals(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching journals:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="bg-[#FAF7F2]">
      <section
        className="journal relative pt-[60px] pb-[60px] overflow-hidden container"
        id="Journals"
      >
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
                  <h3 className="text-[18px] font-bold text-[#333]">
                    {journal.title}
                  </h3>
                  <p className="text-[14px] text-gray-600">{journal.body}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No journals found.
            </p>
          )}
        </div>

        <div className="flex justify-center mt-8 relative">
          <Link
            to="/journalList"
            state={{ journals }} // ✅ يتم تمرير المجلات هنا
            className="no-underline relative bg-[#4B5929] text-center hover:bg-[#A8C686] text-white font-medium text-lg px-3 py-3 rounded-[10px] transition-all duration-300 transform hover:scale-105 shadow-md cursor-pointer"
          >
            See More Journal
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OliveJournal;
