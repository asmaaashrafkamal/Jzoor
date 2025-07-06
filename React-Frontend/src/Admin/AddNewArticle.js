import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUploadCloud } from "react-icons/fi";

const AddNewArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("Published");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ Check admin login
  useEffect(() => {
  axios
    .get("http://localhost:8000/check-login", { withCredentials: true })
    .then((res) => {
      console.log("Session Response:", res.data); // Debug

      const role = res.data?.role;

      if (role === "A" || role === "D") {
        setUser(res.data.user);
      } else {
        console.warn("Unauthorized role or missing session.");
        window.location.href="/admin/login";
      }
    })
    .catch((error) => {
      console.error("Login check failed:", error);
        window.location.href="/admin/login";
    })
    .finally(() => setLoading(false));
}, [navigate]);


  if (loading) return <div>Checking login status...</div>;

  // ✅ Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit form
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("status", status);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await axios.post("http://localhost:8000/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Article created successfully!");
      console.log(res.data);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Failed to publish article. See console.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-md shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Article</h2>

        {/* Status Selection */}
        <div className="mb-4 flex items-center space-x-2">
          <label className="text-sm text-gray-700">Status:</label>
          {["Published", "Drafted", "Status"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === s
                  ? s === "Published"
                    ? "bg-green-100 text-green-700"
                    : s === "Drafted"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow-sm w-full border-gray-300 rounded-md p-2"
            placeholder="Enter title"
          />
        </div>

        {/* Body Textarea */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Post Body</label>
          <textarea
            rows="6"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="shadow-sm w-full border-gray-300 rounded-md p-2"
            placeholder="Write your article here..."
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
          <label
            htmlFor="imageUpload"
            className="cursor-pointer flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-indigo-400 hover:bg-gray-50 transition"
          >
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-40 rounded-md mx-auto" />
              ) : (
                <>
                  <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-indigo-600">Upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
            <input
              id="imageUpload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-[#4B5929] text-white font-semibold rounded-md py-2 px-4 hover:bg-[#3c471f] focus:ring-2 focus:ring-offset-2 focus:ring-[#4B5929]"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewArticle;
