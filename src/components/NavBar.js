import React, { useState } from "react";
import { Link } from "react-router-dom";
import img from "../img/Smart AD Maker.png";
import { useNavigate } from "react-router-dom";


function Navbar({ user, handleSignOut }) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

   const signOutAndRedirect = async () => {
    try {
      await handleSignOut();  // calls auth.signOut()
      navigate("/"); // redirect to home after logout
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../firebaseConfig";
// import img from "../img/gif3.gif";

// function Navbar() {
//   const [user] = useAuthState(auth);
//   const [isOpen, setIsOpen] = useState(false);

//   const signOutAndRedirect = () => {
//     auth.signOut();
//     // optionally redirect user to home or signin page here
//   };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-5 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={img}
            alt="Smart Ad Maker Logo"
            className="h-12 w-12 rounded-full shadow-md"
          />
          <h1 className="text-2xl font-bold tracking-wide text-yellow-400 select-none">
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
                to="/gallery"
              >
                Gallery
              </Link>
              <button
                onClick={signOutAndRedirect}
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
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
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
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/generate-image"
                className="block w-full text-center py-3 hover:bg-gray-700 transition"
                onClick={() => setIsOpen(false)}
              >
                Generate Poster
              </Link>
              <Link
                to="/gallery"
                className="block w-full text-center py-3 hover:bg-gray-700 transition"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <button
                onClick={() => {
                  signOutAndRedirect();
                  setIsOpen(false);
                }}
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
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full text-center py-3 bg-blue-500 hover:bg-blue-600 transition text-white font-semibold"
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

// }

// export default Navbar;
