// ArticlesOverview.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  HiPlus,
  HiEye,
  HiPencil,
  HiTrash,
  HiX,
  HiChevronDown,
  HiCheckCircle,
  HiClock,
  HiXCircle
} from 'react-icons/hi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Title = ({ title }) => (
  <h1 className="text-3xl font-bold mb-4" style={{ color: '#1F2937' }}>{title}</h1>
);

const statusColors = {
  Published: '#10B981',
  Drafted: '#F59E0B',
};

const ArticlesOverview = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [newStatus, setNewStatus] = useState('');
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get("http://localhost:8000/check-login", { withCredentials: true })
      .then(res => {
         console.log(res.data);
        if (res.data.role == "A"||res.data.role == "D") {
         console.log(res.data.user);
          setUser(res.data.user); // session data from backend
        } else {
         // If no session, redirect to login page
          navigate("/admin/login");
        }
      })
      .catch(() => {
        // On any error, redirect to login page
        navigate("/admin/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8000/articles`, {
        params: { search, status: statusFilter, page },
      });
      setArticles(res.data.data);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error(err);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/articles/${selected.id}`);
      fetchArticles();
      setShowDelete(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`http://localhost:8000/articles/${selected.id}`, { status: newStatus });
      fetchArticles();
      setShowEdit(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = async (article) => {
    try {
      const res = await axios.get(`http://localhost:8000/articles/${article.id}`);
      setSelected(res.data);
      setShowDetail(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 font-sans w-full overflow-x-hidden">
      <div className="flex justify-between mb-4">
        <Title title="Article Overview" />
       <Link to="addNewArticle" style={{ backgroundColor: '#047857', color: '#FFFFFF' }} className="px-5 no-underline py-2 rounded-md flex items-center justify-center text-sm font-medium hover:bg-[#065F46] transition-colors">
              <HiPlus className="w-5 h-5 mr-2" />
              New Article
            </Link>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          style={{
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  outline: 'none',
                  boxShadow: '0 0 0 1px #10B981'
           }}
          placeholder="Search..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:max-w-xs"
        />
        <div className="flex gap-2">
          {['all', 'Published', 'Drafted'].map(status => (
            <button
              key={status}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${statusFilter === status ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map(article => (
              <tr key={article.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{article.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{article.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    style={{ backgroundColor: `${statusColors[article.status] || '#E5E7EB'}`, color: '#fff' }}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex gap-2">
                  <button onClick={() => handleViewDetails(article)} className="hover:text-blue-600">
                    <HiEye />
                  </button>
                  <button onClick={() => { setSelected(article); setNewStatus(article.status); setShowEdit(true); }} className="hover:text-yellow-600">
                    <HiPencil />
                  </button>
                  <button onClick={() => { setSelected(article); setShowDelete(true); }}
                  style={{ color: '#6B7280' }}
                  className="hover:text-[#DC2626] transition-colors"
                  title="Delete Article">
                    <HiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {[...Array(lastPage)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-emerald-700 text-white' : 'bg-white text-gray-700'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showDetail && selected && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Article Details</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">
                <HiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 text-gray-700">
              <p><strong>ID:</strong> {selected.id}</p>
              <p className="mt-2"><strong>Title:</strong> {selected.title}</p>
              <p className="mt-2"><strong>Status:</strong> {selected.status}</p>
              <p className="mt-2"><strong>Body:</strong> {selected.body}</p>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Edit Status</h2>
              <button onClick={() => setShowEdit(false)} className="text-gray-400 hover:text-gray-600">
                <HiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2">
                <option value="Published">Published</option>
                <option value="Drafted">Drafted</option>
              </select>
              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={() => setShowEdit(false)} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Cancel</button>
                <button onClick={handleUpdateStatus} className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

   {showDelete && selected && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
              <button onClick={() => setShowDelete(false)} className="text-gray-400 hover:text-gray-600">
                <HiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">Are you sure you want to delete the article "<span className='font-semibold'>{selected.title || 'Untitled'}</span>"?</p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowDelete(false)} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Cancel</button>
                <button
                  onClick={handleDelete}
                  style={{ backgroundColor: 'red', color: 'white' }} // 👈 force styling
                  className="px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ArticlesOverview;
