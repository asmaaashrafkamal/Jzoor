import { Link } from 'react-router-dom';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export function BestSellingProduct() {
  // const products = [
  //   { name: 'Mint', totalOrder: 104, status: 'Stock', price: '$999.00', image: 'imges/Rectangle 41.webp' },
  //   { name: 'Taste Of Palestine', totalOrder: 56, status: 'Stock out', price: '$999.00', image: 'imges/roberta-sorge-uOBApnN_K7w-unsplash.webp' },
  //   { name: 'Hand-Painted Tatreez Mug', totalOrder: 266, status: 'Stock', price: '$999.00', image: 'imges/f769ad49-1fc1-4c9c-b61e-6f8308e2897d.webp' },
  //   { name: 'Loquat', totalOrder: 506, status: 'Stock', price: '$999.00', image: 'imges/loquats-7228865_1280 (1).webp' },
  // ];
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/best-sellers")
      .then(res => {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setProducts(data);
      })
      .catch(err => {
        console.error("Failed to fetch best sellers", err);
      });
  }, []);
  
  return (
    <div className="border border-gray-200 rounded-2xl p-4 shadow-md bg-white  font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Best selling product</h2>
        <button className="flex items-center px-3 py-1 bg-gray-100 rounded-md text-gray-700 text-sm">
          Filter
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL ORDER</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md mr-3" />
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.totalOrder}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  product.status === 'Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-blue-600 hover:bg-gray-50">Details</button>
      </div>
    </div>
  );
}