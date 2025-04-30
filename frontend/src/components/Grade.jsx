import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "./Logo";
import Image from "./Image";
import Footer from "./Footer";

function Grade() {
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
          "https://studentmanagement-anwx.onrender.com/api/v1/routes/get-marks",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setCourses(response.data?.courses || []);
        setSubjects(response.data?.subjects || []);
      } catch (error) {
        console.error("Error fetching course details", error);
      }
    };

    fetchCourseDetails();
  }, []);

  const pendingSubjects = (subjects || []).filter(
    (sub) => sub.course === selectedCourse && sub.status === "Pending"
  );
  const completedSubjects = (subjects || []).filter(
    (sub) => sub.course === selectedCourse && sub.status === "Completed"
  );

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
    <div className="w-full md:w-[60%] flex flex-col items-center bg-gray-100 shadow-md h-full">
      <Logo />
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <h1 className="text-2xl text-center font-bold mb-4">My Grades</h1>

          <select
            className="border p-2 rounded mb-4 w-full max-w-xs"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a Course</option>
            {courses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>

          {selectedCourse && (
            <div className="w-full max-w-[800px] overflow-hidden">
              <div
                className={`w-full flex flex-wrap gap-4 ${
                  completedSubjects.length === 0 || pendingSubjects.length === 0
                    ? "justify-center"
                    : "md:grid md:grid-cols-2"
                }`}
              >
                {completedSubjects.length > 0 && (
                  <SubjectTable
                    title="Exam Completed Subjects"
                    subjects={completedSubjects}
                  />
                )}
                {pendingSubjects.length > 0 && (
                  <SubjectTable
                    title="Exam Pending Subjects"
                    subjects={pendingSubjects}
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

const SubjectTable = ({ title, subjects }) => {
  return (
    <div className="w-full max-w-lg overflow-x-auto md:max-w-full">
      <h2
        className={`text-lg font-semibold mb-2 ${
          title === "Exam Pending Subjects" ? "text-red-600" : "text-green-600"
        }`}
      >
        {title}
      </h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2 py-1 text-sm sm:px-4 sm:py-2">
              Subject
            </th>
            {title === "Exam Completed Subjects" && (
              <>
                <th className="border border-gray-300 px-2 py-1 text-sm sm:px-4 sm:py-2">
                  Exam Date
                </th>
                <th className="border border-gray-300 px-2 py-1 text-sm sm:px-4 sm:py-2">
                  Obtain Marks
                </th>
                <th className="border border-gray-300 px-2 py-1 text-sm sm:px-4 sm:py-2">
                  Total Marks
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index} className="text-center">
              <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2">
                {subject.subjectname}
              </td>
              {title === "Exam Completed Subjects" && (
                <>
                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2">
                    {subject.exam_date || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2">
                    {subject.marks_obtain || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2">
                    {subject.marks_outoff || "N/A"}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grade;
