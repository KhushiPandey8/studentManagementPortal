import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Image from "./Image";
import Logo from "./Logo";
import { useSelector } from "react-redux";

function FeeHistory() {
  const user = useSelector((state) => state.auth.user);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://studentmanagement-anwx.onrender.com/api/v1/routes/fee-details",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setFees(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching fee details", error);
      }
    };
    fetchFeeDetails();
  }, []);

  const courseGroups = {};
  const courseNamesArr = new Set();

  fees.forEach((fee) => {
    const courseName = fee.course || "Unknown Course";
    courseNamesArr.add(courseName);
    if (!courseGroups[courseName]) {
      courseGroups[courseName] = {
        courseFees: fee.courseFees || 0,
        payments: [],
      };
    }
    courseGroups[courseName].payments.push(fee);
  });

  const courseNames = [...courseNamesArr].join(", ");
  const totalCourseFees = Object.values(courseGroups).reduce(
    (sum, group) => sum + group.courseFees,
    0
  );

  const totalPaid = fees.reduce((sum, fee) => sum + (fee.Paid || 0), 0);
  const totalBalance = totalCourseFees - totalPaid;

  const renderedRows = [];
  let runningTotalPaid = 0;

  fees.forEach((fee, index) => {
    const paidThis = fee.Paid || 0;
    runningTotalPaid += paidThis;
    const balance = totalCourseFees - runningTotalPaid;

    renderedRows.push(
      <tr key={index} className="border border-gray-500 text-xs">
        <td className="border border-gray-500 p-1 text-center">{fee.Receipt || "N/A"}</td>
        <td className="border border-gray-500 p-1 text-center">
          {fee.Dates ? new Date(fee.Dates).toLocaleDateString("en-GB") : "N/A"}
        </td>
        <td className="border border-gray-500 p-1 text-center">{totalCourseFees}</td>
        <td className="border border-gray-500 p-1 text-center">{paidThis}</td>
        <td className="border border-gray-500 p-1 text-center">{balance}</td>
        <td className="border border-gray-500 p-1 text-center">{fee.ModeOfPayement || "N/A"}</td>
        <td className="border border-gray-500 p-1 text-center">{fee.Recieve || "N/A"}</td>
      </tr>
    );
  });

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-gray-100 shadow-md h-full">
        <Logo />
        
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <div className="p-4 w-full">
            <h1 className="text-xl text-center font-bold mb-4">Fees Details</h1>
            <table className="w-full mb-4 border border-gray-400 text-xs">
              <tbody>
                <tr className="border border-gray-400">
                  <td className="font-bold p-2 border w-1/3">Name</td>
                  <td className="p-2 border text-red-500">{user?.name || "N/A"}</td>
                </tr>
                <tr className="border border-gray-400">
                  <td className="font-bold p-2 border">Course Name</td>
                  <td className="p-2 border">{courseNames || "N/A"}</td>
                </tr>
                <tr className="border border-gray-400">
                  <td className="font-bold p-2 border">Charged Amount</td>
                  <td className="p-2 border">{totalCourseFees || "N/A"}</td>
                </tr>
                <tr className="border border-gray-400">
                  <td className="font-bold p-2 border">Paid Amount</td>
                  <td className="p-2 border">{totalPaid || "N/A"}</td>
                </tr>
                <tr className="border border-gray-400">
                  <td className="font-bold p-2 border">Balance Amount</td>
                  <td className="p-2 border">{totalBalance}</td>
                </tr>
              </tbody>
            </table>

            {/* Table for fee transactions */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1000px] w-full border-collapse border border-gray-500 text-xs">
                <thead>
                  <tr className="bg-gray-200 border border-gray-500">
                    <th className="border border-gray-500 p-1 text-center">Receipt</th>
                    <th className="border border-gray-500 p-1 text-center">Date</th>
                    <th className="border border-gray-500 p-1 text-center">Course Fees</th>
                    <th className="border border-gray-500 p-1 text-center">Fees Paid</th>
                    <th className="border border-gray-500 p-1 text-center">Balance</th>
                    <th className="border border-gray-500 p-1 text-center">Mode of Payment</th>
                    <th className="border border-gray-500 p-1 text-center">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {renderedRows.length > 0 ? (
                    renderedRows
                  ) : (
                    <tr>
                      <td colSpan="7" className="border border-gray-500 p-2 text-center">
                        No fee details available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default FeeHistory;
