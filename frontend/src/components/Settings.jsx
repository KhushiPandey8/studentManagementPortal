import React from 'react';
import Footer from './Footer';
import Image from './Image';
import Logo from './Logo';

function Settings() {
  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-gray-100 shadow-md h-full">
        <Logo />
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>

          {/* No settings data message */}
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
                d="M12 6v6l4 2m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-semibold">No settings available</p>
            <p className="text-sm text-gray-400">Settings options will appear here when available.</p>
          </div>
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default Settings;
