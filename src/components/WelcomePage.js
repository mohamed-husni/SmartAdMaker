import React, { useEffect, useState } from "react";
import img from "../img/best-advertisement.webp";
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
    <main className="min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-50 px-6 py-12 flex flex-col items-center">
      <section className="max-w-7xl w-full flex flex-col-reverse lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
        {/* Text */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Welcome to <span className="text-orange-500">Smart Ad Maker</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Transform your ideas into stunning advertisement posters in seconds — no design skills required.
          </p>
          <Link
            to={user ? "/generate-image" : "/signin"}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8 py-3 shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300"
            aria-label="Get started with Smart Ad Maker"
          >
            Get Started
          </Link>
        </div>

        {/* Hero Image */}
        <div className="flex-1 max-w-lg drop-shadow-lg rounded-lg overflow-hidden">
          <img
            src={img}
            alt="Welcome to Smart Ad Maker"
            className="w-full h-auto object-cover rounded-lg"
            loading="eager"
          />
        </div>
      </section>

      {/* Recently Created Advertisements */}
      <section className="max-w-7xl w-full mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recently Created Advertisements</h2>

        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-500 italic text-center">Created posters will appear here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image) => (
              <div
                key={image.id}
                className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition cursor-pointer flex flex-col overflow-hidden"
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
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-gray-800 font-semibold line-clamp-2">{image.prompt}</p>
                  <time
                    className="text-xs text-gray-400 mt-auto"
                    dateTime={image.createdAt ? new Date(image.createdAt).toISOString() : undefined}
                  >
                    {image.createdAt ? new Date(image.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ""}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default WelcomePage;
