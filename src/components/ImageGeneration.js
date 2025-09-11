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

  const handleSave = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];
        const res = await fetch("https://smartadmaker-backend-157053047400.asia-south1.run.app/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64Data, userId, prompt }),
        });
        await res.json();
        setSaveSuccess(true);
        toast.success("Image saved to gallery!");
        // Clear image and prompt so user can re-enter
        setImageUrl("");
        setPrompt("");
      };
    } catch (err) {
      console.error(err);
      toast.error("Failed to save image.");
    }
  };

  const handleDelete = () => {
    setImageUrl("");
    setSaveSuccess(false);
    setPrompt("");
    toast("Poster cleared.", { icon: "🗑️" });
  };

  const handleDownload = () => {
    // Trigger download
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "poster.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Clear the image and prompt to allow new prompt input
    setImageUrl("");
    setPrompt("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          AI Advertisement Poster Generator
        </h2>

        {/* Prompt Input */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your poster idea... (e.g. modern milk ad, festival sale, etc.)"
          className="w-full border rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-blue-500 resize-none mb-4"
          rows={4}
          disabled={!!imageUrl} // Disable prompt input when image generated
        />

        {/* Generate Button - shown only when no image */}
        {!imageUrl && (
          <button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className={`px-6 py-3 rounded-xl font-semibold shadow-md w-full transition-colors ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Generating..." : "Generate Poster"}
          </button>
        )}

        {/* Generated Image and Buttons */}
        {imageUrl && (
          <div className="flex flex-col items-center gap-5">
            <img
              src={imageUrl}
              alt="Generated Poster"
              className="rounded-xl shadow-lg w-full max-w-md object-contain"
            />
            <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
              <button
                onClick={handleDownload}
                className="flex-1 px-5 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl shadow-md font-semibold transition-colors"
              >
                Download
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-5 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl shadow-md font-semibold transition-colors"
              >
                Delete
              </button>
              <button
                onClick={handleSave}
                disabled={saveSuccess}
                className={`flex-1 px-5 py-3 rounded-xl shadow-md font-semibold transition-colors ${
                  saveSuccess
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                {saveSuccess ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageGeneration;
