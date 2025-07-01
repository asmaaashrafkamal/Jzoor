import React from 'react'
import UserTrafficCard from './components/UserTrafficCard'
import Title from './components/Title'

const AdminRole = () => {
  return (
    <div className="p-6 bg-[#f3f4f6]">
      <div className="pb-4">
        <Title title="About Section" />
      </div>
      {/* <h1 className="text-xl font-semibold text-gray-800">About Section</h1> */}
      <UserTrafficCard />
    </div>
  )
}

export default AdminRole
