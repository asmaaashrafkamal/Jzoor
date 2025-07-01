import React from 'react'
// import { AddNewProduct } from './components/AddNewProduct'
import AddNewProductForm from './components/AddNewProductForm'
import Title from './components/Title'

const AdminAdd = () => {
  return (
    <div className="p-6 bg-[#F3F4F6]">
      <div className="pb-4">
      <Title title="Add New Product" />

      </div>
              {/* <h1 className="text-xl font-semibold text-gray-800">Add New Product</h1> */}

      <AddNewProductForm />
    </div>
  )
}

export default AdminAdd
