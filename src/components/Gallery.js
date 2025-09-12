import React, { useState, useEffect } from "react";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Toaster, toast } from "react-hot-toast";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error("You must be logged in to view your gallery.");
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
        toast.error("Failed to fetch gallery.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Delete image
  const deleteImage = async (imageId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const imageDocRef = doc(db, "users", user.uid, "images", imageId);
      await deleteDoc(imageDocRef);
      setImages((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
      toast.success("Image deleted successfully.");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading your gallery...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-8">
        Your Gallery
      </h2>

      {images.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No images yet. Start generating creative posters!
        </p>
      ) : (
        <div className="container mx-auto">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <img
                  src={image.imageUrl}
                  alt={`Generated from prompt: ${image.prompt}`}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-2xl"
                />

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <p className="text-gray-800 font-semibold text-center mb-1 truncate">
                      {image.prompt}
                    </p>
                    <p className="text-xs text-gray-400 text-center mb-3">
                      {new Date(image.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mt-auto">
                    <a
                      href={image.imageUrl}
                      download="advertisement_poster.png"
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl shadow-md text-center transition-transform transform hover:scale-105"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-md transition-transform transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
