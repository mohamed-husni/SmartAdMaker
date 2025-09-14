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

 return (
  <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-orange-100 to-white px-2 sm:px-4 md:px-6 py-6">
    {/* Hero Section */}
    <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row">
      {/* Hero Image */}
      <div className="w-full lg:w-1/2">
        <img
          src={img}
          alt="Welcome to Smart Ad Maker"
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* Text Section */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-orange-500">
          Welcome to Smart Ad Maker
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-md">
          Turn your ideas into stunning advertisement posters in seconds.
        </p>
        <Link
          to={user ? "/generate-image" : "/signin"}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </div>

    {/* Recently Created Advertisements */}
    <div className="w-full max-w-7xl mt-10 px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Recently Created Advertisements
      </h2>

      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : images.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          Created posters will appear here.
        </p>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="rounded-lg overflow-hidden shadow hover:shadow-xl transition cursor-pointer flex flex-col"
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
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
              <div className="p-4 bg-white flex flex-col flex-grow">
                <p className="text-gray-700 font-semibold truncate">
                  {image.prompt}
                </p>
                <p className="text-xs text-gray-400 mt-auto">
                  {image.createdAt
                    ? new Date(image.createdAt).toLocaleDateString()
                    : ""}
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
