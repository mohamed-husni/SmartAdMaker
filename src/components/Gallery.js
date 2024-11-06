import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

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

        // Fetch images from Firestore collection
        const imagesRef = collection(db, 'users', user.uid, 'images');
        const q = query(imagesRef);
        const querySnapshot = await getDocs(q);
        const imagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

      // Delete the document from Firestore
      const imageDocRef = doc(db, 'users', user.uid, 'images', imageId);
      await deleteDoc(imageDocRef);

      // Update the state to remove the deleted image from the list
      setImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete the image. Please try again.");
    }
  };

  if (loading) return <p>Loading your gallery...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Gallery</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {images.length === 0 ? (
          <p>No images in your gallery yet. Start generating images!</p>
        ) : (
          images.map((image, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg relative flex flex-col items-center"
            >
              <img
                src={image.imageUrl}
                alt={`Generated from prompt: ${image.prompt}`}
                className="w-full h-auto object-cover mb-4"
              />
              <p className="text-gray-600 text-center">{image.prompt}</p>
              <p className="text-xs text-gray-400 text-center">
                {new Date(image.createdAt).toLocaleString()}
              </p>
  
              {/* Download Button */}
              <a
                href={image.imageUrl}
                download="generated_image.png"
                className="bg-green-500 text-white p-2 rounded mt-4 inline-block hover:bg-green-700"
              >
                Download Image
              </a>
              {/* Delete Button */}
              <button
                onClick={() => deleteImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
  
}

export default Gallery;
