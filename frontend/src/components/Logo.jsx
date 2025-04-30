import React from 'react'
import images from '../constant/Icon'

function Logo() {
  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-r from-slate-500 to-slate-950 text-white h-16 shadow-md">
          <img
        src={images.logo}
        alt="I-tech Logo"
        className="h-12 w-[100px] mr-3 rounded-lg border-2 border-white shadow-lg"
      />
      <h1 className="text-2xl font-extrabold font-mono tracking-widest">I-tech</h1>
    </div>
  )
}

export default Logo