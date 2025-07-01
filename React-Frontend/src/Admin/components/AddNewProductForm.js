import React, { useState, useRef } from 'react';
import {
  HiOutlineDocumentArrowDown,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineCalendar,
  HiOutlinePhoto,
} from 'react-icons/hi2';

export function AddNewProductForm() {
  const [productName, setProductName] = useState('Poppy');
  const [productDescription, setProductDescription] = useState("Bring, vibrant beauty and timeless symbolism to any space with the Poppy Flower—a striking bloom known for its delicate, paper-like petals and bold, captivating colors. Most commonly found in vivid shades of red, orange, and white, the poppy is more than just a flower; it's a powerful emblem of remembrance, peace, and resilience.");
  const [productPrice, setProductPrice] = useState('15.00');
  const [discountedPrice, setDiscountedPrice] = useState('5');
  const [taxIncluded, setTaxIncluded] = useState('yes');
  const [stockQuantity, setStockQuantity] = useState('Unlimited');
  const [stockStatus, setStockStatus] = useState('In Stock');
  const [isUnlimited, setIsUnlimited] = useState(true);
  const [highlightFeatured, setHighlightFeatured] = useState(true);
  const [productImage, setProductImage] = useState(null); // State for the image file
  const imageInputRef = useRef(null); // Ref for the hidden file input

  // --- Handlers for button functionality ---

  const handleSaveToDraft = () => {
    alert('Product saved to draft! (Functionality to be implemented)');
    console.log('Draft Data:', { productName, productDescription, productPrice, discountedPrice, taxIncluded, stockQuantity, stockStatus, isUnlimited, highlightFeatured, productImage });
  };

  const handlePublishProduct = () => {
    alert('Product published! (Functionality to be implemented)');
    console.log('Published Data:', { productName, productDescription, productPrice, discountedPrice, taxIncluded, stockQuantity, stockStatus, isUnlimited, highlightFeatured, productImage });
  };

  const handleEditDescription = () => {
    alert('Edit description activated! (Functionality to be implemented)');
    // In a real app, this might toggle a rich text editor or a modal
  };

  const handleDeleteDescription = () => {
    if (window.confirm('Are you sure you want to delete the product description?')) {
      setProductDescription('');
      alert('Product description deleted!');
    }
  };

  // --- Image Upload Handlers ---

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductImage(URL.createObjectURL(file)); // Set image preview URL
      console.log('Selected image file:', file);
    }
  };

  const handleBrowseImage = () => {
    imageInputRef.current.click(); // Programmatically click the hidden file input
  };

  const handleReplaceImage = () => {
    if (window.confirm('Are you sure you want to replace the current image?')) {
      setProductImage(null); // Clear current image
      imageInputRef.current.value = null; // Reset file input
      imageInputRef.current.click(); // Open file dialog again
    }
  };

  const handleAddImageDragDrop = () => {
    imageInputRef.current.click(); // Same as browse, for simplicity in this example
  };

  // --- Color and Size Handlers (Placeholders) ---
  const handleAddPotColor = () => {
    alert('Add new pot color functionality! (To be implemented)');
  };

  const handleAddPotSize = () => {
    alert('Add new pot size functionality! (To be implemented)');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm font-sans mx-auto ">
      {/* Header and Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          {/* Save to Draft Button */}
          <button
            onClick={handleSaveToDraft}
            className="px-4 py-2 border border-[#D1D5DB] rounded-lg text-[#4B5563] font-medium hover:bg-[#E5E7EB] flex items-center transition-colors duration-200"
            style={{ backgroundColor: '#F9FAFB' }} // Set specific background color
          >
            <HiOutlineDocumentArrowDown className="w-5 h-5 mr-2" />
            Save to draft
          </button>
          {/* Publish Product Button */}
          <button
            onClick={handlePublishProduct}
            className="px-4 py-2 bg-[#22C55E] text-white rounded-lg font-medium hover:bg-[#16A34A] transition-colors duration-200 flex items-center"
          >
            Publish Product
            <HiOutlinePlus className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Details, Pricing, Inventory */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <div className="bg-[#F9FAFB] p-6 border border-[#E5E7EB] rounded-lg">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Basic Details</h2>
            <div className="mb-4">
              <label htmlFor="productName" className="block text-sm font-medium text-[#374151] mb-1">Product Name</label>
              <input
                type="text"
                id="productName"
                className="w-full border border-[#D1D5DB] rounded-md shadow-sm p-2 text-[#374151] text-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="productDescription" className="block text-sm font-medium text-[#374151] mb-1">Product Description</label>
              <div className="relative">
                <textarea
                  id="productDescription"
                  rows="6"
                  className="w-full border border-[#D1D5DB] rounded-md shadow-sm p-2 text-[#374151] text-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E] resize-none"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                ></textarea>
                <div className="absolute bottom-2 right-2 flex space-x-2 text-[#9CA3AF]">
                  {/* Edit Button */}
                  <button onClick={handleEditDescription} className="hover:text-[#22C55E] transition-colors duration-200">
                    <HiOutlinePencil className="w-5 h-5" />
                  </button>
                  {/* Delete Button */}
                  <button onClick={handleDeleteDescription} className="hover:text-[#EF4444] transition-colors duration-200">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#F9FAFB] p-6 border border-[#E5E7EB] rounded-lg">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="productPrice" className="block text-sm font-medium text-[#374151] mb-1">Product Price</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-[#6B7280] sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="productPrice"
                    className="block w-full rounded-md border-[#D1D5DB] pl-7 pr-16 py-2 text-[#374151] text-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <img src="https://flagcdn.com/w20/ps.webp" alt="Palestine Flag" className="h-4 w-6 rounded-sm" />
                    <HiOutlineChevronDown className="w-4 h-4 ml-1 text-[#9CA3AF]" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="discountedPrice" className="block text-sm font-medium text-[#374151] mb-1">Discounted Price (Optional)</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-[#6B7280] sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="discountedPrice"
                    className="block w-full rounded-md border-[#D1D5DB] pl-7 pr-3 py-2 text-[#374151] text-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Tax Included</label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="taxYes"
                      name="taxIncluded"
                      type="radio"
                      className="h-4 w-4 text-[#22C55E] border-[#D1D5DB] focus:ring-[#22C55E]"
                      value="yes"
                      checked={taxIncluded === 'yes'}
                      onChange={(e) => setTaxIncluded(e.target.value)}
                    />
                    <label htmlFor="taxYes" className="ml-2 block text-sm text-[#1F2937]">Yes</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="taxNo"
                      name="taxIncluded"
                      type="radio"
                      className="h-4 w-4 text-[#22C55E] border-[#D1D5DB] focus:ring-[#22C55E]"
                      value="no"
                      checked={taxIncluded === 'no'}
                      onChange={(e) => setTaxIncluded(e.target.value)}
                    />
                    <label htmlFor="taxNo" className="ml-2 block text-sm text-[#1F2937]">No</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-[#374151] bg-[#F3F4F6] p-2 rounded-md">
                <span className="font-semibold text-[#16A34A]">$5</span>
                <span>Sale = $10.00</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-[#374151] mb-1">Expiration</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    id="startDate"
                    placeholder="Start"
                    className="block w-full rounded-md border-[#D1D5DB] pl-3 pr-10 py-2 text-[#374151] text-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                    value="Start" // Static for now, can be state
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <HiOutlineCalendar className="w-5 h-5 text-[#9CA3AF]" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-white mb-1 invisible">End Date Label</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    id="endDate"
                    placeholder="End"
                    className="block w-full rounded-md border-[#D1D5DB] pl-3 pr-10 py-2 text-[#374151] text-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                    value="End" // Static for now, can be state
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <HiOutlineCalendar className="w-5 h-5 text-[#9CA3AF]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-[#F9FAFB] p-6 border border-[#E5E7EB] rounded-lg">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-[#374151] mb-1">Stock Quantity</label>
                <input
                  type="text"
                  id="stockQuantity"
                  className="w-full border border-[#D1D5DB] rounded-md shadow-sm p-2 text-[#374151] text-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  disabled={isUnlimited}
                />
              </div>
              <div>
                <label htmlFor="stockStatus" className="block text-sm font-medium text-[#374151] mb-1">Stock Status</label>
                <select
                  id="stockStatus"
                  className="w-full border border-[#D1D5DB] rounded-md shadow-sm p-2 text-[#374151] text-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <label htmlFor="unlimitedToggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    id="unlimitedToggle"
                    type="checkbox"
                    className="sr-only"
                    checked={isUnlimited}
                    onChange={() => setIsUnlimited(!isUnlimited)}
                  />
                  <div className={`block w-10 h-6 rounded-full ${isUnlimited ? 'bg-[#22C55E]' : 'bg-[#D1D5DB]'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${isUnlimited ? 'translate-x-full' : ''}`}></div>
                </div>
                <div className="ml-3 text-[#4B5563] text-sm">Unlimited</div>
              </label>
            </div>
            <div className="flex items-center">
              <label htmlFor="highlightToggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    id="highlightToggle"
                    type="checkbox"
                    className="sr-only"
                    checked={highlightFeatured}
                    onChange={() => setHighlightFeatured(!highlightFeatured)}
                  />
                  <div className={`block w-10 h-6 rounded-full ${highlightFeatured ? 'bg-[#22C55E]' : 'bg-[#D1D5DB]'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${highlightFeatured ? 'translate-x-full' : ''}`}></div>
                </div>
                <div className="ml-3 text-[#4B5563] text-sm">Highlight this product in a featured section.</div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Upload Product Image, Categories */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload Product Image */}
          <div className="bg-[#F9FAFB] p-6 border border-[#E5E7EB] rounded-lg">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Upload Product Image</h2>
            <p className="text-sm text-[#4B5563] mb-3">Product Image</p>
            <div className="border border-[#D1D5DB] rounded-lg overflow-hidden mb-4">
              {productImage ? (
                <img src={productImage} alt="Product Preview" className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]">
                  No image selected
                </div>
              )}
            </div>
            {/* Hidden file input */}
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <div className="flex space-x-3 mb-4">
              {/* Browse Button */}
              <button
                onClick={handleBrowseImage}
                className="flex-1 px-4 py-2 border border-[#D1D5DB] rounded-md text-[#4B5563] text-sm hover:bg-[#E5E7EB] transition-colors duration-200"
                style={{ backgroundColor: '#F9FAFB' }}
              >
                Browse
              </button>
              {/* Replace Button (only active if an image is selected) */}
              <button
                onClick={handleReplaceImage}
                disabled={!productImage}
                className={`flex-1 px-4 py-2 border border-[#D1D5DB] rounded-md text-[#EF4444] text-sm transition-colors duration-200 ${productImage ? 'hover:bg-[#F9FAFB] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                style={{ backgroundColor: '#F9FAFB' }}
              >
                Replace
              </button>
            </div>
            {/* Add Image Button (for drag and drop area) */}
            <button
              onClick={handleAddImageDragDrop}
              className="w-full flex flex-col items-center justify-center border border-dashed border-[#D1D5DB] rounded-lg p-6 text-[#6B7280] cursor-pointer hover:border-[#22C55E] hover:text-[#22C55E] transition-colors duration-200"
              style={{ backgroundColor: '#F9FAFB' }} // Set specific background color
            >
              <HiOutlinePhoto className="w-8 h-8 mb-2" />
              <span>Add Image</span>
            </button>
          </div>

          {/* Categories */}
          <div className="bg-[#F9FAFB] p-6 border border-[#E5E7EB] rounded-lg">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Categories</h2>
            <div className="mb-4">
              <label htmlFor="productCategories" className="block text-sm font-medium text-[#374151] mb-1">Product Categories</label>
              <select
                id="productCategories"
                className="w-full border border-[#D1D5DB] rounded-md shadow-sm p-2 text-[#374151] text-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
              >
                <option>Select your product</option>
                <option>Flowers</option>
                <option>Plants</option>
                <option>Gifts</option>
                <option>Pots</option>
                <option>Care</option>
                <option>Accessory</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="productTag" className="block text-sm font-medium text-[#374151] mb-1">Product Tag</label>
              <select
                id="productTag"
                className="w-full border border-[#D1D5DB] rounded-md shadow-sm p-2 text-[#374151] text-sm focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
              >
                <option>Select your product</option>
                <option>New Arrivals</option>
                <option>Best Sellers</option>
                <option>On Sale</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-2">Select Pot color</label>
              <div className="flex space-x-2">
                {/* Pot Color Buttons (color set via bg-HEX) */}
                <button className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-[#F3F4F6] hover:scale-105 transition-transform duration-200"></button>
                <button className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-[#FDE047] hover:scale-105 transition-transform duration-200"></button>
                <button className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-[#FCA5A5] hover:scale-105 transition-transform duration-200"></button>
                <button className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-[#4B5563] hover:scale-105 transition-transform duration-200"></button>
                <button className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-[#000000] hover:scale-105 transition-transform duration-200"></button>
                {/* Add Pot Color Button */}
                <button
                  onClick={handleAddPotColor}
                  className="w-8 h-8 rounded-full border-2 border-[#22C55E] text-[#22C55E] flex items-center justify-center hover:bg-[#F0FDF4] transition-colors duration-200"
                  style={{ backgroundColor: '#F9FAFB' }}
                >
                  <HiOutlinePlus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Select Pot Sizes</label>
              <div className="flex space-x-2">
                {/* Pot Size Buttons */}
                <button className="px-4 py-2 border border-[#D1D5DB] rounded-md text-[#4B5563] text-sm hover:bg-[#E5E7EB] transition-colors duration-200" style={{ backgroundColor: '#F9FAFB' }}>S</button>
                <button className="px-4 py-2 border border-[#D1D5DB] rounded-md text-[#4B5563] text-sm hover:bg-[#E5E7EB] transition-colors duration-200" style={{ backgroundColor: '#F9FAFB' }}>M</button>
                <button className="px-4 py-2 border border-[#D1D5DB] rounded-md text-[#4B5563] text-sm hover:bg-[#E5E7EB] transition-colors duration-200" style={{ backgroundColor: '#F9FAFB' }}>XL</button>
                {/* Add Pot Size Button */}
                <button
                  onClick={handleAddPotSize}
                  className="px-4 py-2 border-2 border-[#22C55E] text-[#22C55E] rounded-md text-sm flex items-center justify-center hover:bg-[#F0FDF4] transition-colors duration-200"
                  style={{ backgroundColor: '#F9FAFB' }}
                >
                  <HiOutlinePlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons (Mobile/Smaller Screens) */}
      <div className="mt-6 flex justify-end space-x-3">
        {/* Save to Draft Button (Footer) */}
        <button
          onClick={handleSaveToDraft}
          className="px-4 py-2 border border-[#D1D5DB] rounded-lg text-[#4B5563] font-medium hover:bg-[#E5E7EB] transition-colors duration-200"
          style={{ backgroundColor: '#F9FAFB' }}
        >
          Save to draft
        </button>
        {/* Publish Product Button (Footer) */}
        <button
          onClick={handlePublishProduct}
          className="px-4 py-2 bg-[#22C55E] text-white rounded-lg font-medium hover:bg-[#16A34A] transition-colors duration-200"
        >
          Publish Product
        </button>
      </div>
    </div>
  );
}

export default AddNewProductForm;