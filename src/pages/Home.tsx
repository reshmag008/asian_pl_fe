import React from "react";
import banner from '../assets/banner.jpeg'
import { Link, useNavigate } from 'react-router-dom';


const HomePage = () => {
   const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
        <img
          src={banner}   // replace with your image path or URL
          alt="Poster"
          className="w-full h-auto object-cover"
        />

        {/* <div className="p-4">
        <button
          onClick={() => navigate("/auction-live")}
          className="
            w-full
            flex items-center justify-center gap-3
            rounded-xl
            bg-gradient-to-r from-red-600 to-pink-600
            px-6 py-4
            text-lg font-black uppercase tracking-wider text-white
            shadow-lg
            hover:from-red-700 hover:to-pink-700
            hover:scale-[1.02]
            transition-all duration-200
          "
        >
          <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
          LIVE AUCTION
        </button>
      </div> */}


      </div>
    </div>
  );
};

export default HomePage;