import React, { useState } from "react";
import { InferenceClient } from "@huggingface/inference";
import { auth } from "../firebaseConfig";
import { Toaster, toast } from "react-hot-toast";

const client = new InferenceClient(process.env.REACT_APP_HF_TOKEN);

function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generate image
  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first.");
      return;
    }

    setLoading(true);
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
      toast.success("Poster generated successfully!");
    } catch (err) {
      console.error("Error generating image:", err);
      toast.error("Failed to generate poster. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save image
  const handleSave = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }

    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1];
      try {
        const res = await fetch("https://smartadmaker-backend-157053047400.asia-south1.run.app/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64Data, userId, prompt }),
        });

        const data = await res.json();
        console.log("Saved:", data.url);
        setSaveSuccess(true);
        toast.success("Image saved to gallery!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to save image.");
      }
    };
  };

  // Delete/reset image
  const handleDelete = () => {
    setImageUrl("");
    setSaveSuccess(false);
    toast("Poster cleared.", { icon: "🗑️" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Left: Prompt Input & Actions */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center md:text-left">
            AI Advertisement Poster Generator
          </h2>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your poster idea... (e.g. modern milk ad, festival sale, etc.)"
            className="w-full border rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-blue-500 mb-4"
            rows={5}
          />

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              onClick={generateImage}
              disabled={loading}
              className={`px-6 py-2 rounded-xl font-semibold shadow-md transition ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            {imageUrl && (
              <>
                <button
                  onClick={handleSave}
                  disabled={saveSuccess}
                  className={`px-6 py-2 rounded-xl font-semibold shadow-md transition ${
                    saveSuccess
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  {saveSuccess ? "Saved" : "Save"}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Image Preview */}
        {imageUrl ? (
          <div className="flex-1 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Generated Poster
            </h3>
            <img
              src={imageUrl}
              alt="Generated Poster"
              className="rounded-xl shadow-lg w-80 h-80 object-cover"
            />
            <a
              href={imageUrl}
              download="poster.png"
              className="mt-4 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow transition"
            >
              Download
            </a>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-xl">
            <p className="text-center">Your generated poster will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageGeneration;
