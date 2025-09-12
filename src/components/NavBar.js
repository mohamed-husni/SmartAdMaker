import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../img/Smart AD Maker.png";

function Navbar({ user, handleSignOut }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const signOutAndRedirect = async () => {
    try {
      await handleSignOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={img} alt="Logo" className="h-10 w-10 rounded-full" />
          <h1 className="text-lg sm:text-xl font-bold text-yellow-400">
            SmartAdMaker
          </h1>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-yellow-300">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/generate-image" className="hover:text-yellow-300">
                Generate Poster
              </Link>
              <Link to="/gallery" className="hover:text-yellow-300">
                Gallery
              </Link>
              <button
                onClick={signOutAndRedirect}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded hover:bg-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12" // close
                  : "M4 6h16M4 12h16M4 18h16" // hamburger
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 space-y-2">
          <Link
            to="/"
            className="block py-2 hover:bg-gray-700 rounded"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/generate-image"
                className="block py-2 hover:bg-gray-700 rounded"
                onClick={() => setIsOpen(false)}
              >
                Generate Poster
              </Link>
              <Link
                to="/gallery"
                className="block py-2 hover:bg-gray-700 rounded"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <button
                onClick={() => {
                  signOutAndRedirect();
                  setIsOpen(false);
                }}
                className="block w-full text-left py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="block py-2 bg-green-500 hover:bg-green-600 rounded text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block py-2 bg-blue-500 hover:bg-blue-600 rounded text-center"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
