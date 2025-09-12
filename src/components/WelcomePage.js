import React, { useEffect, useState } from "react";
import img from "../img/gif3.gif";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";

function WelcomePage() {
  const [user] = useAuthState(auth);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setImages([]);
      setLoading(false);
      return;
    }

    const fetchUserImages = async () => {
      try {
        const imagesRef = collection(db, "users", user.uid, "images");
        const q = query(imagesRef, orderBy("createdAt", "desc"), limit(6));
        const snapshot = await getDocs(q);
        const imgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setImages(imgs);
      } catch (error) {
        console.error("Failed to fetch user images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, [user]);

  // Helper for layout class based on image count
  const getGridCols = () => {
    if (images.length === 1) return "grid-cols-1 justify-items-center";
    if (images.length === 2) return "grid-cols-2";
    return "grid-cols-3";
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-orange-100 to-white px-4 py-8">
      <div className="max-w-7xl w-full shadow-lg rounded-lg overflow-hidden bg-white flex flex-col md:flex-row items-center">
        {/* Hero Image */}
        <div className="md:w-1/2 w-full">
          <img
            src={img}
            alt="Welcome to Text-to-Image Generator"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center items-start text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-orange-500 mb-4 animate-fade-in">
            Welcome to Smart Ad Maker
          </h1>
          <p className="text-lg md:text-xl text-gray-700 animate-fade-in delay-200">
            Turn your ideas into stunning advertisement posters in seconds.
          </p>
          <Link
            to={user ? "/generate-image" : "/signin"}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in delay-400"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Recently Created Advertisements Section */}
      <div className="max-w-7xl w-full mt-10 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Recently Created Advertisements</h2>

        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-500 italic text-center">Created posters will appear here.</p>
        ) : (
          <div
            className={`grid gap-6 ${getGridCols()} max-w-5xl mx-auto cursor-pointer`}
            role="list"
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                onClick={() => navigate("/gallery")}
                role="listitem"
                tabIndex={0}
                aria-label={`Advertisement created from prompt: ${image.prompt}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate("/gallery");
                }}
              >
                <img
                  src={image.imageUrl}
                  alt={`Ad generated from: ${image.prompt}`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4 bg-white">
                  <p className="text-gray-700 font-semibold truncate">{image.prompt}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WelcomePage;
