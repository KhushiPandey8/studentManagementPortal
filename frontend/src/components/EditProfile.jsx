import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../redux/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "./Logo";
import Footer from "./Footer";
import Image from "./Image";
import images from "../constant/Icon";

function EditProfile() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user.name || "",
    contact: user.contact || "",
    course: user.course || "",
    address: user.address || "",
    branch: user.branch || "",
    password: "",
    status: user.status || "",
    username: user.username || "",
    EmailId: user.EmailId || "Not Available",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cleanedFormData = {};

      Object.keys(formData).forEach((key) => {
        if (formData[key] && formData[key].trim() !== "") {
          cleanedFormData[key] = formData[key].trim();
        }
      });

      if (Object.keys(cleanedFormData).length === 0) {
        alert("Please update at least one field.");
        return;
      }

      const res = await axios.post(
        "https://studentmanagement-anwx.onrender.com/api/v1/routes/update-profile",
        cleanedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(
        loginSuccess({
          user: { ...user, ...cleanedFormData },
          token,
        })
      );

      navigate("/profile");
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Update failed!");
    }
  };

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
    <div className="w-full md:w-[60%] flex flex-col items-center bg-gray-100 shadow-md h-full">
      <Logo />
      <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center mt-4">Edit Profile</h1>

          <form
            className="mt-6 w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md"
            onSubmit={handleSubmit}
          >
            <div className="relative flex flex-col items-center mb-4">
              <img
                src={images.girl}
                alt="Profile"
                className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full border-4 border-blue-500 shadow-lg"
              />
            </div>

            {/* Inputs */}
            <input className="w-full p-3 mb-3 border rounded-md" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
            <input className="w-full p-3 mb-3 border rounded-md" type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" />
            <input className="w-full p-3 mb-3 border rounded-md" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
            <input className="w-full p-3 mb-3 border rounded-md" type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Course" />
            <input className="w-full p-3 mb-3 border rounded-md" type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
            <input className="w-full p-3 mb-3 border rounded-md" type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch" />
            <input className="w-full p-3 mb-3 border rounded-md" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="New Password (optional)" />
            <input className="w-full p-3 mb-3 border rounded-md" type="text" name="status" value={formData.status} onChange={handleChange} placeholder="Status" />
            <input className="w-full p-3 mb-3 border rounded-md bg-gray-200 text-gray-600" type="email" name="EmailId" value={formData.EmailId} readOnly />

            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-600 transition">
              Save Changes
            </button>
          </form>
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default EditProfile;
