import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebaseConfig.js";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed in:", userCredential.user);
        navigate("/"); 
        })
      .catch((error) => {
        console.error("Error signing in:", error.message);
        setError("Invalid email or password. Please try again.");
      });
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-4 sm:p-6">
    <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-md md:max-w-lg">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
        Welcome Back
      </h2>
      <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
        Sign in to <span className="font-semibold text-indigo-600">SmartAdMaker</span> and keep creating stunning ad posters.
      </p>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSignIn} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm sm:text-base"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm sm:text-base"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 shadow-md transition-all text-sm sm:text-base"
        >
          Sign In
        </button>
      </form>

      {/* Extra links */}
      <p className="text-center text-sm sm:text-base text-gray-600 mt-6">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-indigo-600 font-semibold hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  </div>
);

}

export default SignIn;
