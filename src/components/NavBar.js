import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import img from '../img/Smart AD Maker.png';

function Navbar({ user, handleSignOut }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-5 text-white flex justify-between items-center max-w-8xl  max-h-24 ">
      <div className="flex items-center space-x-2">
      <img
      src={img}
      alt="logo"
      className="h-full max-h-24 w-auto rounded-full"></img>
      <h2 className="text-xl font-semibold  alig">SmartAdMAker</h2>
      </div>
      <div className="hidden md:flex space-x-10 ">
        <Link to="/" className="text-blue-300 hover:text-blue-500">
          Home
        </Link>
        {user ? (
          <>
            <Link to="/generate-image" className="text-blue-300 hover:text-blue-500">
              Generate Image
            </Link>
            <Link to="/gellery" className="text-blue-300 hover:text-blue-500">
              View Gallery
            </Link>
            {/* <Link to="/prompt" className="text-blue-300 hover:text-blue-500">
              generate prompt
            </Link> */}
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="bg-green-500 text-white p-2 rounded hover:bg-green-700">
              Sign In
            </Link>
            <Link to="/register" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-gray-800 w-full mt-2 space-y-2">
          <Link to="/" className="text-blue-300 hover:text-blue-500 w-full text-center">
            Home
          </Link>
          {user ? (
            <>
              <Link to="/generate-image" className="text-blue-300 hover:text-blue-500 w-full text-center">
                Generate Image
              </Link>
              <Link to="/gellery" className="text-blue-300 hover:text-blue-500 w-full text-center">
                View Gallery
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-700 w-full"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="bg-green-500 text-white p-2 rounded hover:bg-green-700 w-full text-center  mx-16">
                Sign In
              </Link>
              {/* <Link to="/register" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 w-full text-center">
                Register
              </Link> */}
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
