import React, { useState } from 'react';
import axios from 'axios';

function PromptGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://api-inference.huggingface.co/models/yazdipour/text-to-sparql-t5-base-qald9';  // Replace with your model of choice
  const API_KEY = "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";  // Replace with your API key

  const generatePrompt = async () => {
    setLoading(true);
    setError(null);

    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    };

    const data = {
      inputs: prompt,
    };

    try {
      const response = await axios.post(API_URL, data, { headers });
      const textResponse = response.data[0].generated_text; // Accessing generated text
      setGeneratedText(textResponse);
    } catch (error) {
      setError('Error generating prompt. Try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-lg">
      <h1>AI Prompt Generator</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter some text or prompt seed"
      />
      <button onClick={generatePrompt} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Prompt'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {generatedText && (
        <div>
          <h2>Generated Prompt:</h2>
          <p>{generatedText}</p>
        </div>
      )}
    </div>
  );
}

export default PromptGenerator;
