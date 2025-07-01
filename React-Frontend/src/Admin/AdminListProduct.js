import React from 'react'
import DiscoverProductManagement from './components/DiscoverProductManagement'
import Title from './components/Title'

const AdminListProduct = () => {
  return (
    <div className="p-6 bg-[#F3F4F6]">
      <div className="pb-4">
        <Title title="Product List" />
      </div>
    {/* <h1 className="text-xl font-semibold text-gray-800">Product List</h1> */}

     
      <DiscoverProductManagement />
    </div>
  )
}

export default AdminListProduct
