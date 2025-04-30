import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "./Image";
import Footer from "./Footer";
import Logo from "./Logo";
import { useSelector } from "react-redux";

function Courses() {
  const user = useSelector((state) => state.auth.user);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(
          "https://studentmanagement-anwx.onrender.com/api/v1/routes/course-details",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const data = response.data;
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error("Invalid data format. Expected an array.");
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching course details", error);
        setCourses([]);
      }
    };

    fetchCourseDetails();
  }, []);

  const uniqueCourses = Array.isArray(courses)
    ? [...new Set(courses.map((c) => c.course).filter(Boolean))]
    : [];

  useEffect(() => {
    if (selectedCourse && Array.isArray(courses)) {
      const filteredSubjects = courses.filter(
        (course) => course.course === selectedCourse
      );
      setSubjects(filteredSubjects.length ? filteredSubjects : []);
    } else {
      setSubjects([]);
    }
  }, [selectedCourse, courses]);

  const pendingSubjects = subjects.filter((sub) => sub.status === "Pending");
  const pursuingSubjects = subjects.filter((sub) => sub.status === "Persuing");
  const completedSubjects = subjects.filter(
    (sub) => sub.status === "Completed"
  );

  const activeTables = [
    pendingSubjects.length > 0,
    pursuingSubjects.length > 0,
    completedSubjects.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-gray-100 shadow-md h-full">
        <Logo />
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <h2 className="text-sm text-center font-bold mb-4">
            Welcome, {user?.name || "Student"}
          </h2>

          <h1 className="text-2xl text-center font-bold mb-4">
            My Course Details
          </h1>

          <select
            className="border p-2 sm:p-3 rounded mb-4 w-full max-w-xs text-sm sm:text-base"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a Course</option>
            {uniqueCourses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>

          {selectedCourse && (
            <div
              className={`w-full max-w-screen-lg px-2 sm:px-4 ${
                activeTables === 1 ? "flex justify-center" : ""
              }`}
            >
              <div
                className={`grid ${
                  activeTables === 1
                    ? ""
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                } gap-4 w-full`}
              >
                {pendingSubjects.length > 0 && (
                  <Table title="Pending Subjects" subjects={pendingSubjects} />
                )}
                {pursuingSubjects.length > 0 && (
                  <Table
                    title="Pursuing Subjects"
                    subjects={pursuingSubjects}
                  />
                )}
                {completedSubjects.length > 0 && (
                  <Table
                    title="Completed Subjects"
                    subjects={completedSubjects}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

const Table = ({ title, subjects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const subjectsPerPage = 14;

  const currentSubjects = Array.isArray(subjects)
    ? subjects.slice(
        (currentPage - 1) * subjectsPerPage,
        currentPage * subjectsPerPage
      )
    : [];

  const totalPages = Math.ceil(
    (Array.isArray(subjects) ? subjects.length : 0) / subjectsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      startPage = 1;
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-2 py-1 sm:px-3 sm:py-1.5 border rounded text-xs sm:text-sm ${
            currentPage === i ? "bg-gray-300" : "bg-white"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const titleColors = {
    "Pending Subjects": "text-red-500",
    "Pursuing Subjects": "text-yellow-500",
    "Completed Subjects": "text-green-500",
  };

  return (
    <div className="bg-white w-full p-4 rounded-lg shadow-md overflow-auto max-w-full mx-auto">
      <h2
        className={`text-base sm:text-lg font-bold mb-2 ${
          titleColors[title] || "text-black"
        }`}
      >
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm md:text-base font-semibold">
          <thead>
            <tr className="bg-gray-200 border border-gray-500">
              <th className="border border-gray-500 p-2 sm:p-3 text-center">
                Subject
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSubjects.map((sub, index) => (
              <tr key={index} className="border border-gray-500">
                <td className="border border-gray-500 p-2 sm:p-3 text-center">
                  {sub.subjectname || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
        {renderPageNumbers()}
      </div>
    </div>
  );
};

export default Courses;
