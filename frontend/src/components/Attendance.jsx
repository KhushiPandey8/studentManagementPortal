import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import Image from "./Image";
import Footer from "./Footer";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // To track the current page
  const [rowsPerPage] = useState(15); // Number of rows to show per page
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const batchtime = params.get("batchtime");
  const Subject = params.get("Subject");

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user || !token || !batchtime || !Subject) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `https://studentmanagement-anwx.onrender.com/api/v1/routes/attendance?batchtime=${batchtime}&Subject=${Subject}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }

        const data = await response.json();

        // Filter duplicates based on date and topic
        const uniqueAttendance = data.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.date === value.date && t.topic === value.topic
            )
        );

        setAttendance(uniqueAttendance);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, [navigate, user, token, batchtime, Subject]);

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-GB")
      : "N/A";
  };

  // Calculate the indexes for the current page
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentAttendance = attendance.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(attendance.length / rowsPerPage);

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-gray-100 shadow-md h-full">
        <Logo />
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <h1 className="text-md font-bold text-gray-800 mb-3 mt-4 text-center">
            Attendance Details
          </h1>

          <div className="w-full flex flex-wrap justify-center md:justify-evenly items-center my-2 gap-2 text-center md:text-left text-[11px] leading-tight">
            <h2 className="font-bold text-[12px]">Subject:</h2>
            <p className="text-gray-700 text-[11px]">
              {attendance?.[0]?.subject_name || "N/A"}
            </p>

            <h2 className="font-bold text-[12px]">Faculty:</h2>
            <p className="text-gray-700 text-[11px]">
              {attendance?.[0]?.faculty || "N/A"}
            </p>

            <h2 className="font-bold text-[12px]">Start Date:</h2>
            <p className="text-gray-700 text-[11px]">
              {formatDate(attendance?.[0]?.startdate)}
            </p>

            <h2 className="font-bold text-[12px]">End Date:</h2>
            <p className="text-gray-700 text-[11px]">
              {formatDate(attendance?.[0]?.enddate)}
            </p>
          </div>

          {/* Smaller Responsive Table */}
          <div className="w-full overflow-x-auto px-2">
            <table className="w-full border-collapse border border-gray-300 text-[12px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-1 text-center border">Date</th>
                  <th className="p-1 text-center border">Topic</th>
                  <th className="p-1 text-center border">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentAttendance.length > 0 ? (
                  currentAttendance.map((record, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="p-1 text-center border">
                        {formatDate(record.date)}
                      </td>
                      <td className="p-1 text-center border">{record.topic}</td>
                      <td
                        className={`p-1 text-center font-semibold border ${
                          record.attendence === "Present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {record.attendence}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center text-gray-500 py-1 border"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-2 border border-gray-300 rounded-md"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 mx-2 border ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "border-gray-300"
                } rounded-md`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-2 border border-gray-300 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default Attendance;
