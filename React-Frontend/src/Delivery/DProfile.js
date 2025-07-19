import React, { useState } from 'react';
import {
  FaExternalLinkAlt, // For export/share icon
  FaCog, // For settings icon
  FaLock, // For email security/verification icon
  FaEye, // For show password
  FaEyeSlash, // For hide password
  FaEdit, // For edit icon
  FaCalendarAlt, // For date picker
  FaChevronDown, // For dropdown arrows
  FaCreditCard, // For credit card icon
  FaPlus // For the add icon in biography, if applicable
} from 'react-icons/fa'; // Importing necessary icons from react-icons/fa
import { Link } from 'react-router-dom';

export function UserProfilePage() {
  // State for Profile Update section
  const [firstName, setFirstName] = useState('Ahmad');
  const [lastName, setLastName] = useState('Kanaan');
  const [password, setPassword] = useState('********'); // Placeholder for password
  const [phoneNumber, setPhoneNumber] = useState('(970) 559-0120');
  const [email, setEmail] = useState('Ahmad.Kanaan@example.com');
  const [dateOfBirth, setDateOfBirth] = useState('12- January- 1999');
  const [location, setLocation] = useState('2972 Westheimer Rd. Santa Ana, Illinois 85486');
  const [creditCard, setCreditCard] = useState('843-4359-4444');
  const [biography, setBiography] = useState('Plant lover | E-commerce enthusiast | Committed to sustainable living\nI manage Juzoor, where I help connect people with beautiful, healthy plants and easy care tips—delivered locally with love.');

  // State for Change Password section
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');

  // State for password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);

  return (
    <div className="p-4 bg-[#f3f4f6]">
      <h1 className="text-xl font-semibold text-gray-800">About Section</h1> {/* Added "About Section" title */}
      <div className="min-h-screen font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left Column: Profile Card and Change Password */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-end items-center mb-4 space-x-2">
                <button className="text-gray-500 hover:text-gray-700" title="Export">
                  <FaExternalLinkAlt className="w-5 h-5" /> {/* Replaced SVG with FaExternalLinkAlt */}
                </button>
                <button className="text-gray-500 hover:text-gray-700" title="Settings">
                  <FaCog className="w-5 h-5" /> {/* Replaced SVG with FaCog */}
                </button>
              </div>
              <img
                src="/imges/deivery.webp" // Updated image source to "deivery.webp"
                alt="Ahmad Kanaan"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Ahmad Kanaan</h2>
              <p className="text-sm text-gray-600 mb-2 flex items-center justify-center">
                {email}
                <FaLock className="w-4 h-4 ml-2 text-gray-400" /> {/* Replaced SVG with FaLock */}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Plant lover | E-commerce enthusiast | Committed to sustainable living
              </p>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
                <a href="#" className="text-blue-600 text-sm">Need help?</a>
              </div>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    title={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                <Link to="/ForgetPass"  className="text-blue-600 text-sm mt-1 block">Forgot Current Password? Click here</Link>
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="reEnterPassword" className="block text-sm font-medium text-gray-700 mb-1">Re-enter Password</label>
                <div className="relative">
                  <input
                    type={showReEnterPassword ? 'text' : 'password'}
                    id="reEnterPassword"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={reEnterPassword}
                    onChange={(e) => setReEnterPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowReEnterPassword(!showReEnterPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    title={showReEnterPassword ? 'Hide password' : 'Show password'}
                  >
                    {showReEnterPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button className="w-full bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 transition-colors mt-4">
                Save Change
              </button>
            </div>
          </div>

          {/* Right Column: Profile Update Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Profile Update</h2>
                <button className="flex items-center text-gray-500 hover:text-gray-700" title="Edit Profile">
                  <FaEdit className="w-5 h-5 mr-1" /> {/* Replaced SVG with FaEdit */}
                  Edit
                </button>
              </div>

              {/* Profile Picture Upload */}
              <div className="flex items-center mb-6">
                <img
                  src="/imges/deivery.webp" // Placeholder for profile picture update
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                    Upload New
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="profilePassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    id="profilePassword"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      id="phoneNumber"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-16 py-2 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <img src="https://flagcdn.com/w20/ps.webp" alt="Palestine Flag" className="h-4 w-6 rounded-sm" />
                      <FaChevronDown className="w-4 h-4 ml-1 text-gray-400" /> {/* Replaced SVG with FaChevronDown */}
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      id="dateOfBirth"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaCalendarAlt className="w-5 h-5 text-gray-400" /> {/* Replaced SVG with FaCalendarAlt */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  id="location"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Credit Card */}
              <div className="mb-6">
                <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">Credit Card</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    id="creditCard"
                    className="block w-full rounded-md border-gray-300 pl-10 pr-10 py-2 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={creditCard}
                    onChange={(e) => setCreditCard(e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaCreditCard className="w-5 h-5 text-gray-400" /> {/* Replaced SVG with FaCreditCard */}
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <FaChevronDown className="w-4 h-4 text-gray-400" /> {/* Replaced SVG with FaChevronDown */}
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div>
                <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                <div className="relative">
                  <textarea
                    id="biography"
                    rows="5"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                  ></textarea>
                  <div className="absolute bottom-2 right-2 text-gray-400">
                    <FaEdit className="w-5 h-5" /> {/* Replaced SVG with FaEdit */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
