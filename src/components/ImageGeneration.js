import React, { useState } from "react";
import { InferenceClient } from "@huggingface/inference";
import { doc, collection, setDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const client = new InferenceClient(process.env.REACT_APP_HF_TOKEN);

function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const result = await client.textToImage({
        model: "mohamedhusni/Advertisement_poster_LORA_part3",
        inputs: prompt,
        parameters: { num_inference_steps: 20 },
      });

      const blob = new Blob([result], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Error generating image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveImageToGallery = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to save images.");
      return;
    }
    try {
      const imageDocRef = doc(collection(db, "users", user.uid, "images"));
      await setDoc(imageDocRef, {
        imageUrl,
        prompt,
        createdAt: new Date().toISOString(),
      });
      setSaveSuccess(true);
      alert("Image saved successfully to your gallery!");
      setImageUrl("");
      setPrompt("");
    } catch (err) {
      console.error("Error saving image:", err);
      setError("Error saving image to Firestore.");
    }
  };

  const deleteImage = () => {
    setImageUrl("");
    setPrompt("");
    setSaveSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-6">
        {/* Left side: Text and inputs */}
        <div className="md:w-1/2 flex flex-col">
          <h2 className="text-4xl font-bold text-orange-500 mb-6 text-center md:text-left">
            Advertisement Poster Generator
          </h2>
          <p className="text-gray-600 mb-4 text-center md:text-left">
            Enter your creative idea and instantly generate stunning advertisement posters.
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your advertisement prompt here..."
            className="w-full h-40 p-4 mb-4 border-2 border-gray-300 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
          />

          <button
            onClick={generateImage}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition transform hover:scale-105 mb-4 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Poster"}
          </button>

          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        </div>

        {/* Right side: Generated image */}
        <div className="md:w-1/2 flex flex-col items-center justify-start">
          {imageUrl ? (
            <div className="w-full flex flex-col items-center">
              <img
                src={imageUrl}
                alt="Generated Poster"
                className="w-full max-w-md h-auto rounded-xl shadow-xl mb-4 object-cover"
              />

              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {/* Download Button */}
                <a
                  href={imageUrl}
                  download="advertisement_poster.png"
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-4-4m4 4l4-4M12 4v8" />
                  </svg>
                  Download
                </a>

                {/* Save Button */}
                <button
                  onClick={saveImageToGallery}
                  disabled={saveSuccess}
                  className={`flex items-center gap-2 px-5 py-3 font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 ${saveSuccess
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {saveSuccess ? "Saved" : "Save"}
                </button>

                {/* Delete Button */}
                <button
                  onClick={deleteImage}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Delete
                </button>
              </div>

            </div>
          ) : (
            <div className="text-gray-400 italic mt-8 text-center">
              Your generated poster will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageGeneration;
