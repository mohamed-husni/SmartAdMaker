import React, { useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { doc, collection, setDoc } from 'firebase/firestore'; 
import { db, auth } from '../firebaseConfig'; 

function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false); 

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setSaveSuccess(false); // Reset saveSuccess when a new image is generated
    const API_URL = "https://api-inference.huggingface.co/models/mohamedhusni/Advertisement_poster_LORA_part3";
    const HF_TOKEN = "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";
    const headers = {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'image/png'
    };

    try {
      const response = await axios.post(
        API_URL,
        { inputs: prompt },
        { headers, responseType: 'arraybuffer' }
      );

      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const imageUrl = `data:image/png;base64,${base64Image}`;
      setImageUrl(imageUrl);
    } catch (error) {
      setError("Error generating image. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to save image to Firebase Firestore
  const saveImageToGallery = async () => {
    const user = auth.currentUser;  // Get current logged-in user
    if (!user) {
      setError("You must be logged in to save images.");
      return;
    }

    try {
      const imageDocRef = doc(collection(db, 'users', user.uid, 'images')); // Each user has their own collection
      await setDoc(imageDocRef, {
        imageUrl,  // Base64 image data
        prompt,    // The prompt used to generate the image
        createdAt: new Date().toISOString() // Timestamp
      });

      setSaveSuccess(true); // Set success flag
      console.log("Image successfully saved to Firestore!");
      alert("Image saved successfully to your gallery!");
      setImageUrl("");  
      setPrompt(""); 
      
    } catch (error) {
      setError("Error saving image to Firestore.");
      console.error("Error saving image:", error);
    }
  };

  // Function to handle image deletion
  const deleteImage = () => {
    setImageUrl("");  // Reset the image URL to empty
    setPrompt("");    // Optionally reset the prompt to allow new input
    setSaveSuccess(false); // Reset save status
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-lg">
      <h2 className="text-2xl text-center font-semibold mb-4">Enter Your text and Generate an 
        Advertisement poster
      </h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt"
        className="border p-2 w-full h-32 mb-4" // Increase height of text area
      />
      {/* Generate Button */}
      <button
        onClick={generateImage}
        className="bg-blue-500 p-2 rounded w-full mb-4"
        disabled={loading || imageUrl}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {/* Display error message if there's an error */}
      {error && <p className="text-red-500">{error}</p>}
      {/* Show the image, download, and delete options if an image is generated */}
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Generated" className="mt-4 w-full h-auto" /> {/* Make image larger */}
          {/* Download Button */}
          <a
            href={imageUrl}
            download="generated_image.png"
            className=" text-black p-2 rounded mt-4 inline-block hover:bg-green-700"
          >
            Download Image
          </a>
          {/* Save to Firebase Button */}
          <button
            onClick={saveImageToGallery}
            className=" text-black p-2 rounded ml-4 hover:bg-purple-700"
            disabled={saveSuccess} 
            // Disable if already saved
          >
            
            {saveSuccess ? "Saved" : "Save to Gallery"}
          </button>
          {/* Delete/Cancel Button */}
          <button
            onClick={deleteImage}
            className=" text-red p-2 rounded ml-4 hover:bg-red-700"
          >
            Delete Image
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageGeneration;
