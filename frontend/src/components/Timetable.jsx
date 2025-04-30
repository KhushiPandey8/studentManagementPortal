import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "./Image";
import Footer from "./Footer";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

function Timetable() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const subjectsPerPage = 14;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://studentmanagement-anwx.onrender.com/api/v1/routes/get-batch",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        console.log("Fetched Data:", response.data);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching course details", error);
      }
    };
    fetchCourseDetails();
  }, []);

  const filterByStatus = (status) => {
    if (!selectedCourse) return;
    setSelectedStatus(status);
    const filtered = courses.filter(
      (sub) => sub.status === status && sub.course === selectedCourse
    );
    setFilteredSubjects(filtered);
  };

  const handleCourseSelection = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedStatus("");
    setFilteredSubjects([]);
  };

  const handleViewAttendance = (batchTime, Subject) => {
    const encodedBatchTime = encodeURIComponent(batchTime);
    const encodedSubject = encodeURIComponent(Subject);
    navigate(`/attend?batchtime=${encodedBatchTime}&Subject=${encodedSubject}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);
  const currentSubjects = filteredSubjects.slice(
    (currentPage - 1) * subjectsPerPage,
    currentPage * subjectsPerPage
  );

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

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-gray-100 shadow-md h-full">
        <Logo />
        <div className="mt-3 flex-1 overflow-y-auto w-full flex flex-col items-center p-3">
          <h1 className="text-xl md:text-2xl text-center font-bold mb-3">My Course Details</h1>

          <select
            className="border border-gray-400 p-1 md:p-2 rounded mb-3 text-sm md:text-base"
            value={selectedCourse}
            onChange={handleCourseSelection}
          >
            <option value="">Select a Course</option>
            {Array.from(
              new Set(
                courses
                  .filter(
                    (course) =>
                      course.course !== "COURSE" &&
                      course.subjectname !== "SUBJECTS"
                  )
                  .map((c) => c.course)
              )
            ).map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>

          {/* Status Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            {["Pending", "Persuing", "Completed"].map((status) => (
              <button
                key={status}
                className={`px-3 py-1 rounded text-xs md:text-sm ${
                  selectedStatus === status
                    ? "bg-gray-800 text-white"
                    : "bg-gray-300 text-black"
                }`}
                onClick={() => filterByStatus(status)}
                disabled={!selectedCourse}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Data Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-[600px] w-full border-collapse border border-gray-300 text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-200 text-center">
                  <th className="border p-2">Subject</th>
                  {selectedStatus !== "Pending" && (
                    <>
                      <th className="border p-2">Batch Time</th>
                      <th className="border p-2">Faculty</th>
                      <th className="border p-2">Start Date</th>
                      <th className="border p-2">End Date</th>
                      <th className="border p-2">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentSubjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={selectedStatus !== "Pending" ? 6 : 1}
                      className="text-center p-3"
                    >
                      {selectedCourse && selectedStatus
                        ? "No data found for the selected course and status."
                        : "Please select a course and status."}
                    </td>
                  </tr>
                ) : (
                  currentSubjects.map((sub, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{sub.subjectname}</td>
                      {selectedStatus !== "Pending" && (
                        <>
                          <td className="border p-2">{sub.batch_time || "N/A"}</td>
                          <td className="border p-2">{sub.faculty || "N/A"}</td>
                          <td className="border p-2">{sub.startdate || "N/A"}</td>
                          <td className="border p-2">{sub.endate || "N/A"}</td>
                          <td className="border p-2">
                            <button
                              className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs"
                              onClick={() =>
                                handleViewAttendance(sub.batch_time, sub.subjectname)
                              }
                            >
                              View
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
            {renderPageNumbers()}
          </div>
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default Timetable;
