import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const MyAccount = () => {
  const [twoStep, setTwoStep] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [gender, setGender] = useState('');
    const [state, setState] = useState('');
    const [address, setAdressName] = useState('');
    const [Birth_date, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
const handleSubmit = async (e) => {
  e.preventDefault();
//
//   if (!agree) {
//     alert("You must agree to the terms and conditions.");
//     return;
//   }
//
//   if (password !== confirmPassword) {
//     alert("Passwords do not match.");
//     return;
//   }

  const formData = new FormData();
  formData.append("name", fullName);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("password_confirmation", confirmPassword);
  formData.append("gender", gender);
  formData.append("state", state);
  formData.append("address", address);
  formData.append("Birth_date", Birth_date);
  formData.append("phone", phone);
  if (image) {
    formData.append("image", image);
  }

  try {
    const response = await axios.post(
      "http://localhost:8000/StoreProfile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 201) {
      alert("Update successful!");
    //   navigate(accountType === "Seller" ? "/SellerLogin" : "/Login");
    }
  } catch (error) {
    if (error.response && error.response.data.errors) {
      const errors = error.response.data.errors;
      alert(Object.values(errors).flat().join("\n"));
    } else {
      alert("Update failed. Please try again.");
    }
  }
};
  useEffect(() => {
    axios.get("http://localhost:8000/check-login", { withCredentials: true })
      .then(res => {
         console.log(res.data);
        if (res.data.role == "C") {
        const u = res.data.user;
        setUser(u);
        setFullName(u.customer_name || '');
        setEmail(u.customer_email || '');
        setPhone(u.customer_phone || '');
        setBirthDate(u.customer_date || '');
        setGender(u.customer_gender || '');
        setState(u.customer_state || '');
        setAdressName(u.customer_address || '');
         console.log(res.data.user);
        } else {
         // If no session, redirect to login page
          navigate("/login");
        }
      })
      .catch(() => {
        // On any error, redirect to login page
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div>Checking login status...</div>;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">My Account</h1>

        {/* <p className="text-sm text-gray-500">You can update your information here</p> */}
        <div className="flex items-center  space-x-4 mt-4">
          <img
            src={`http://localhost:8000/storage/${image}`}
            alt="Profile"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <div className="flex gap-2">
          <button className="bg-green text-white text-sm px-2 py-2 rounded hover:bg-green-hover">
            + Change Image
          </button>
          <button className="bg-green-hover text-sm text-white px-2 py-2 rounded hover:bg-green">
            Remove Image
          </button>
          </div>
          <p className="text-sm text-gray-500 pt-2">We Support PENGs, JPGs and GIFs Under 2MB</p>

          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-gray-50 rounded-lg shadow p-4 space-y-4">
        <h2 className="text-lg font-medium text-[#4B5929]">Personal Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Firstname"
          value={fullName}   onChange={(e) => setFullName(e.target.value)}/>
          <input className="border p-2 rounded" placeholder="Email" type="email"
          value={email}   onChange={(e) => setEmail(e.target.value)}/>
          <input className="border p-2 rounded" placeholder="Phone number"
          value={phone}   onChange={(e) => setPhone(e.target.value)}/>
          <input className="border p-2 rounded" placeholder="Date of Birth" type="date"
          value={Birth_date}  onChange={(e) => setBirthDate(e.target.value)}/>
          <input className="border p-2 rounded" placeholder="Gender"
          value={gender}   onChange={(e) => setGender(e.target.value)}/>
        </div>
      </div>

     {/* Address */}
<div className="bg-gray-50 rounded-lg shadow p-4 space-y-4">
  <h2 className="text-lg font-medium text-[#4B5929]">Delivery Address</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Country - ثابت غير قابل للتعديل */}
    <input
      className="border p-2 rounded bg-gray-100 cursor-not-allowed"
      value="Palestine"
      readOnly
    />

    {/* State */}
    <input className="border p-2 rounded" autoFocus placeholder="State"
     value={state}   onChange={(e) => setState(e.target.value)}/>

    {/* s */}
    <input className="border p-2 rounded" placeholder="street"
    value={address}   onChange={(e) => setAdressName(e.target.value)}/>
  </div>

  {/* الجملة التحذيرية */}
  <p className="text-sm text-red pt-1">
    *Delivery is only available within Palestine, Payments accepted worldwide.
  </p>
</div>


      {/* Security */}
      <div className="bg-gray-50 rounded-lg shadow p-4 space-y-4">
        <h2 className="text-lg font-medium text-[#4B5929]">Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Enter Old Password" type="password"  />
          <input className="border p-2 rounded" placeholder="Enter New Password" type="password" />
          <input className="border p-2 rounded col-span-2" placeholder="Confirm New Password" type="password" />
        </div>
        <button className="bg-[#af926a] text-white px-4 py-2 rounded hover:bg-[#8B6F47] mt-2"
          onClick={handleSubmit}>
          Update
        </button>
      </div>

      {/* 2 Step Verification */}
      <div className="bg-gray-50 rounded-lg shadow p-4 flex items-center justify-between">
        <div>
        <span className="text-[#4B5929] font-medium">2 Step Verification</span>

            <p className="text-gray-500">Additional Layer Of Security To Your Account During Login</p>
        </div>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={twoStep}
            onChange={() => setTwoStep(!twoStep)}
          />
          <div className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${twoStep ? "bg-green" : ""}`}>
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${twoStep ? "translate-x-5" : ""}`}
            ></div>
          </div>
        </label>
      </div>

      {/* Delete Account */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold text-red-600">Delete Account</h2>
        <p className="text-sm text-red-500">
        When you delete your account, you lose access to Front account services, and we permanently delete your personal data. You can cancel the deletion for 14 days.
        </p>
        <div className="flex gap-4">
          <button className="bg-red text-white px-4 py-2 rounded hover:bg-red/50">Delete</button>
          <button className="bg-white border border-red text-red px-4 py-2 rounded hover:bg-red">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
