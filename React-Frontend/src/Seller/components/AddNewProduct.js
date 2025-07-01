import React from 'react';
import { Link } from 'react-router-dom';

export function AddNewProduct() {
  const categories = [
    { name: 'Gifts', image: 'imges/f769ad49-1fc1-4c9c-b61e-6f8308e2897d (1).webp' },
    { name: 'Plants', image: 'imges/Tree Spotlight_ Carob tree - Canopy _ Canopy.webp' },
    { name: 'Flowers', image: 'imges/Rectangle 44.webp' },
  ];

  const products = [
    { name: 'Jasmine & Linen Set', price: '$28.00', image: 'imges/loquats-7228865_1280.webp' },
    { name: 'Loquat', price: '$10.00', image: 'imges/14678939-8be0-4601-8f6f-a69da5367e57.webp' },
    { name: 'Tulips', price: '$15.00', image: 'imges/sanju-pandita-xcVkgD7bcLA-unsplash.webp' },
  ];

  return (
    <div className="border border-gray-200 rounded-2xl p-4 shadow-md bg-white  font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Add New Product</h2>
        <Link to="/seller/addProduct" className="flex items-center text-blue-600 text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New
        </Link>
      </div>

      {/* <div className="mb-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Categories</p>
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <img src={category.image} alt={category.name} className="w-8 h-8 rounded-md mr-3" />
              <p className="text-gray-800 font-medium">{category.name}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        ))}
        <button className="mt-2 text-blue-600 text-sm">See more</button>
      </div> */}

      <div>
        <p className="text-gray-600 text-sm font-medium mb-2">Product</p>
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <img src={product.image} alt={product.name} className="w-8 h-8 rounded-md mr-3" />
              <div>
                <p className="text-gray-800 font-medium">{product.name}</p>
                <p className="text-gray-500 text-sm">{product.price}</p>
              </div>
            </div>
            {/* <Link to="seller/productList" className="px-3 py-1 border border-gray-300 rounded-md text-green-600 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add
            </Link> */}
          </div>
        ))}
        <Link to="productList" className="mt-2 no-underline text-blue-600 text-sm">See more</Link>
      </div>
    </div>
  );
}