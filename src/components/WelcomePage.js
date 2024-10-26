import React from 'react';
import img from '../img/gif3.gif';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="max-auto">
      <div className="flex flex-col md:flex-row">
        {/* Hero Image */}
        <div className="md:w-1/2 w-full">
          <img
            src={img}
            alt="Welcome to Text-to-Image Generator"
            className="w-full h-auto"
          />
        </div>
        {/* Text Overlay */}
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center max-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-orange mb-4">
            Welcome to the Text-to-Image Adventure!
          </h1>
          <p className="text-lg md:text-xl text-black mb-4">
            Unleash your creativity. Transform words into stunning visuals.
          </p>
          <Link
            to="/signin"
            className="bg-blue-500 text-white px-6 py-2 rounded mt-6 hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
  
}

export default WelcomePage;
