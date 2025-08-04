import { Link } from 'react-router-dom';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export function TopProducts() {
  // const products = [
  //   { name: 'Chamomile', item: 'FFXZ-4567', price: '$15.00', image: 'imges/Rectangle 41.webp' },
  //   { name: 'Olive Tree', item: 'FFXZ-4567', price: '$50.40', image: 'imges/Rectangle 43.webp' },
  //   { name: 'Lavender', item: 'FFXZ-4567', price: '$35.40', image: 'imges/66858fac-be77-4de0-a1d0-2e2806295950.webp' },
  //   { name: 'Marigold', item: 'FFXZ-4567', price: '$80.00', image: 'imges/Rectangle 43.webp' },
  // ];
  const [products, setTopProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/top-products")
      .then(res => {
        setTopProducts(res.data.data || []);
      })
      .catch(err => {
        console.error("Error loading top products", err);
      });
  }, []);
  
  return (
    <div className="border border-gray-200 rounded-2xl p-4 shadow-md bg-white  font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
        <Link to="/admin/productList" className="text-blue-600 text-sm">All product</Link>
      </div>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {products.map((product, index) => (
        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
          <div className="flex items-center">
            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md mr-3" />
            <div>
              <p className="text-gray-800 font-medium">{product.name}</p>
              <p className="text-gray-500 text-sm">Item: {product.item}</p>
            </div>
          </div>
          <p className="text-gray-900 font-semibold">{product.price}</p>
        </div>
      ))}
    </div>
  );
}