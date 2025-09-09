import React from 'react';
import img from '../img/gif3.gif';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-white px-4">
      <div className="flex flex-col md:flex-row items-center max-w-7xl w-full shadow-lg rounded-lg overflow-hidden bg-white">
        {/* Hero Image */}
        <div className="md:w-1/2 w-full">
          <img
            src={img}
            alt="Welcome to Text-to-Image Generator"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center items-start text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-orange-500 mb-4 animate-fade-in">
            Welcome to Smart Ad Maker
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 animate-fade-in delay-200">
            Turn your ideas into stunning advertisement posters in seconds.
          </p>
          <Link
            to="/signin"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in delay-400"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
