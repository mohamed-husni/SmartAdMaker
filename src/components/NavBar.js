import React, { useState } from "react";
import { Link } from "react-router-dom";
import img from "../img/Smart AD Maker.png";

function Navbar({ user, handleSignOut }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-5 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={img}
            alt="Smart Ad Maker Logo"
            className="h-12 w-12 rounded-full shadow-md"
          />
          <h1 className="text-2xl font-bold tracking-wide text-yellow-400">
            SmartAdMaker
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link className="hover:text-yellow-300 transition-colors" to="/">
            Home
          </Link>

          {user ? (
            <>
              <Link
                className="hover:text-yellow-300 transition-colors"
                to="/generate-image"
              >
                Generate Poster
              </Link>
              <Link
                className="hover:text-yellow-300 transition-colors"
                to="/gellery"
              >
                Gallery
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-full font-semibold shadow-md"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded-full font-semibold shadow-md"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded-full font-semibold shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none p-2 rounded hover:bg-gray-700 transition"
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
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-slideDown">
          <Link
            to="/"
            className="block w-full text-center py-3 hover:bg-gray-700 transition"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/generate-image"
                className="block w-full text-center py-3 hover:bg-gray-700 transition"
              >
                Generate Poster
              </Link>
              <Link
                to="/gellery"
                className="block w-full text-center py-3 hover:bg-gray-700 transition"
              >
                Gallery
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-center py-3 bg-red-600 hover:bg-red-700 transition text-white font-semibold"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="block w-full text-center py-3 bg-green-500 hover:bg-green-600 transition text-white font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full text-center py-3 bg-blue-500 hover:bg-blue-600 transition text-white font-semibold"
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
