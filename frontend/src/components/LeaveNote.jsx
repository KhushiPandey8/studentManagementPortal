import React from 'react';
import Logo from './Logo';
import Footer from './Footer';
import Image from './Image';

function LeaveNote() {
  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-gray-100 shadow-md h-full">
        <Logo />
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <h1 className="text-2xl font-bold mb-6 text-center">Leave Note</h1>

          {/* No data message */}
          <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
            <svg
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75h.008v.008H9.75V9.75zm0 4.5h.008v.008H9.75v-.008zm4.5-4.5h.008v.008h-.008V9.75zm0 4.5h.008v.008h-.008v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-semibold">No leave notes available</p>
            <p className="text-sm text-gray-400">When a leave note is submitted, it will be displayed here.</p>
          </div>
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default LeaveNote;
