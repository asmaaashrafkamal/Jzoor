import React, { useState, useMemo, useEffect } from 'react';

function Test() {
  const [formData, setFormData] = useState({ cat_name: '', description: '', productNo: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer TOKEN' if needed
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('User saved!');
        setFormData({ cat_name: '', description: '', productNo: '' });
      } else {
        setMessage(data.message || 'Error saving user');
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="cat_name"
          placeholder="Name"
          className="border p-2 w-full"
          value={formData.cat_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="description"
          className="border p-2 w-full"
          value={formData.description}
          onChange={handleChange}
          required
        />
  <input
          type="text"
          name="productNo"
          placeholder="productNo"
          className="border p-2 w-full"
          value={formData.productNo}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
      </form>
      {message && <p className="mt-2 text-green-500">{message}</p>}
    </div>
  );
}

export default Test;
