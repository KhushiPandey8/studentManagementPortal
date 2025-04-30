import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import images from "../constant/Icon";
import Footer from "./Footer";
import Image from "./Image";
import Logo from "./Logo";

function Navbar() {
  const [user, setUser] = useState({
    name: "",
    branch: "",
    course: "",
    photo: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <>
      <div className="inset-0 h-screen w-screen flex flex-col md:flex-row">
        <div className="w-full md:w-[60%] flex flex-col items-center bg-gray-100 shadow-md h-full">
          <Logo />
          <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
            <div className="text-center text-sm md:text-md font-mono font-bold py-4 flex flex-col items-center">
              <img
                src={images.girl || "N/A"}
                alt="Profile Light"
                className="w-20 h-20 md:w-20 md:h-20 object-cover rounded-full border-4 border-blue-500 shadow-lg"
              />
              <h1 className="mt-2 text-base md:text-md">
                {user.name || "Guest"} ({user.address || "N/A"})
              </h1>
              <p className="text-gray-600 text-xs md:text-sm">
                Branch: {user.branch || "N/A"}
              </p>
              <p className="text-gray-600 text-xs md:text-sm">
                Course: {user.course || "N/A"}
              </p>
            </div>

            {/* Menu Items */}
            <nav className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 w-full justify-items-center py-4">
              {[
                {
                  name: "My Course Status",
                  icon: images.learn,
                  link: "/course",
                },
                {
                  name: "My Batches",
                  icon: images.worksheet,
                  link: "/timetable",
                },
                {
                  name: "Fees Details",
                  icon: images.payment,
                  link: "/fee-history",
                },
                { name: "My Grades", icon: images.grade, link: "/grade" },
                { name: "Notes", icon: images.notes, link: "/notes" },
                { name: "Exam Reg", icon: images.exam, link: "/exam" },
                { name: "Leave App", icon: images.leave, link: "/leave" },
                { name: "Support", icon: images.support, link: "/support" },
                {
                  name: "Feedback",
                  icon: images.satisfaction,
                  link: "/feedback",
                },
                { name: "Setting", icon: images.Settings, link: "/settings" },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="flex flex-col items-center text-center"
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="h-16 w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 shadow-lg rounded-2xl p-4 bg-white
                    hover:bg-gray-100 transition-transform duration-200 ease-in-out transform 
                    hover:scale-110 focus:scale-110 active:scale-90"
                  />
                  <span className="font-semibold text-[0.7rem] md:text-[0.7rem] font-mono mt-1 md:mt-2 text-gray-700">
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
          <Footer />
        </div>

        <Image />
      </div>
    </>
  );
}

export default Navbar;
