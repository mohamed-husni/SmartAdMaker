import React, { useEffect, useState } from "react";
import img from "../img/gif3.gif";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { collection, query, getDocs, orderBy, limit, where } from "firebase/firestore";

function WelcomePage() {
  const [user] = useAuthState(auth);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setImages([]);
      setLoading(false);
      return;
    }

    const fetchUserImages = async () => {
      try {
        const imagesRef = collection(db, "users", user.uid, "images");
        const q = query(imagesRef, orderBy("createdAt", "desc"), limit(4));
        const snapshot = await getDocs(q);
        const imgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

        {/* Text + Images Section */}
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

          {/* Display few latest user images */}
          {!loading && images.length > 0 && (
            <div className="w-full mt-6 grid grid-cols-2 gap-4">
              {images.map(image => (
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt={`Generated poster from prompt: ${image.prompt}`}
                  className="rounded-lg shadow-md object-cover h-40 w-full"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
