import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/store";
// import Button from './Button';
import images from "../constant/Icon";

function Footer({ setUser }) { 
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    fetch("https://studentmanagement-anwx.onrender.com/api/v1/routes/logout", { 
        method: "POST", 
        credentials: "include",
        withCredentials:true
    })
    .then(response => response.json())
    .then(() => {
        dispatch(logout());
        if (setUser) setUser(null);
        navigate("/login");
    })
    .catch(error => console.error("Logout failed:", error));
  };

  return (
    <div className="w-full h-14 mt-auto bg-gradient-to-r from-slate-500 to-slate-950 text-white flex justify-center items-center relative">
      <footer className="flex justify-around w-full px-6 relative">
        {[
          { name: "Back", icon: images.btn, action: () => navigate(-1) },
          { name: "Home", icon: images.home, link: "/" },
          { name: "Notification", icon: images.notify, link: "/" },
          { name: "Logout", icon: images.logout, action: handleLogout },
          { name: "Profile", icon: images.profile, link: "/profile" },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center relative cursor-pointer"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onClick={item.action || (() => {})}
          >
            {item.link ? (
              <Link to={item.link}>
                <img src={item.icon} alt={item.name} className="h-8  w-8 md:h-10 md:w-10 shadow-md rounded-xl p-1 bg-gray-100 hover:bg-gray-200 transition-transform duration-200 transform hover:scale-110" />
              </Link>
            ) : (
              <img src={item.icon} alt={item.name} className="h-8  w-8 md:h-10 md:w-10 shadow-md rounded-xl p-1 bg-gray-100 hover:bg-gray-200 transition-transform duration-200 transform hover:scale-110" />
            )}
            {hovered === index && (
              <div className="absolute -top-6 bg-gray-800 text-white text-xs rounded-md px-2 py-1 shadow-md">{item.name}</div>
            )}
          </div>
        ))}
      </footer>
    </div>
  );
}

export default Footer;
