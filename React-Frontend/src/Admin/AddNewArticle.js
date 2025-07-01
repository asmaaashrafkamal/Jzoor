import React, { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi'; // استيراد أيقونة للرفع

const AddNewArticle = () => {
  const [status, setStatus] = useState('Published');
  const [postTitle, setPostTitle] = useState('The Art of Palestinian Embroidery');
  const [postBody, setPostBody] = useState(
    `Every thread tells a story. Palestinian embroidery, known as tatreez, is more than decorative stitching — it’s a language passed from mother to daughter, a quiet act of remembrance, and a form of cultural resistance. Each pattern, color, and motif has meaning. Some mark a woman’s village or marital status. Others, like the olive branch or watermelon, carry political symbolism — especially during times when national expression was restricted. The watermelon, for instance, became a symbol of resistance after the Palestinian flag was banned. Tatreez has always adapted. Today, artists incorporate traditional motifs into bags, jackets, and accessories, keeping the heritage alive while making it accessible to younger generations. At its heart, Palestinian embroidery is about survival — of identity, of beauty, and of belonging stitched into every square.`
  );
  const [image, setImage] = useState(null);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleTitleChange = (event) => {
    setPostTitle(event.target.value);
  };

  const handleBodyChange = (event) => {
    setPostBody(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      console.log('Selected image:', file);
    }
  };

  const handlePublish = () => {
    console.log('Publishing article with:', { status, postTitle, postBody, image });
    alert('Article published (data logged to console)!');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-md shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Article</h2>

        {/* Status Buttons Section */}
        <div className="mb-4 flex items-center space-x-2 rtl:space-x-reverse">
          <label className="text-sm text-gray-700">Status:</label>
          <button
            type="button"
            onClick={() => handleStatusChange('Status')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === 'Status' ? 'bg-gray-200 text-[#6C757D]' : 'bg-gray-200 text-[#6C757D] hover:bg-gray-300'
            }`}
          >
            Status
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange('Published')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === 'Published' ? 'bg-[#D4EDDA] text-[#28A745]' : 'bg-gray-200 text-[#6C757D] hover:bg-gray-300'
            }`}
          >
            Published
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange('Drafted')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === 'Drafted' ? 'bg-[#FFF3CD] text-[#FFC107]' : 'bg-gray-200 text-[#6C757D] hover:bg-gray-300'
            }`}
          >
            Drafted
          </button>
        </div>

        {/* Post Title Input Field */}
        <div className="mb-4">
          <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Post Title
          </label>
          <input
            type="text"
            id="postTitle"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            placeholder="Enter post title"
            value={postTitle}
            onChange={handleTitleChange}
          />
        </div>

        {/* Post Body Textarea */}
        <div className="mb-4">
          <label htmlFor="postBody" className="block text-sm font-medium text-gray-700 mb-2">
            Post Body
          </label>
          <textarea
            id="postBody"
            rows="8"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            placeholder="Write your article here..."
            value={postBody}
            onChange={handleBodyChange}
          ></textarea>
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          {/* هنا تم تغيير بنية label لتغليف منطقة السحب والإفلات بالكامل */}
          <label
            htmlFor="imageUpload"
            className="cursor-pointer mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-400 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="space-y-1 text-center">
              {image ? (
                <img src={image} alt="Uploaded" className="max-h-40 rounded-md mx-auto" />
              ) : (
                <>
                  <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center"> {/* إضافة justify-center هنا */}
                    <span className="font-medium text-indigo-600 hover:text-indigo-500">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
            {/* حقل الإدخال الفعلي مخفي ولكن يتم تنشيطه عند النقر على الـ label */}
            <input id="imageUpload" type="file" className="sr-only" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Publish Button */}
        <div className="flex justify-end">
          <button
            onClick={handlePublish}
            className="bg-[#4B5929] text-white font-semibold rounded-md py-2 px-4 hover:bg-[#3c471f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B5929] transition"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewArticle;