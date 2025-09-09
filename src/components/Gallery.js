import React, { useState, useEffect } from "react";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images when the component loads
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("You must be logged in to view your gallery.");
          setLoading(false);
          return;
        }

        const imagesRef = collection(db, "users", user.uid, "images");
        const q = query(imagesRef);
        const querySnapshot = await getDocs(q);
        const imagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(imagesData);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Error fetching your gallery. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Delete image function
  const deleteImage = async (imageId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const imageDocRef = doc(db, "users", user.uid, "images", imageId);
      await deleteDoc(imageDocRef);
      setImages((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete the image. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading your gallery...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Your Gallery</h2>
      {images.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No images in your gallery yet. Start generating creative posters!
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative flex flex-col items-center"
            >
              <img
                src={image.imageUrl}
                alt={`Generated from prompt: ${image.prompt}`}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 w-full flex flex-col items-center">
                <p className="text-gray-800 font-semibold text-center mb-1 truncate">
                  {image.prompt}
                </p>
                <p className="text-xs text-gray-400 text-center mb-3">
                  {new Date(image.createdAt).toLocaleString()}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href={image.imageUrl}
                    download="advertisement_poster.png"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold rounded-xl shadow-md transition-transform transform hover:scale-105"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-xl shadow-md transition-transform transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
