// client/src/pages/HomePage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalysis = async () => {
    if (!pdfFile || !youtubeUrl) {
      alert('Please provide both a PDF file and a YouTube URL.');
      return;
    }
    setLoading(true);
    try {
      const pdfFormData = new FormData();
      pdfFormData.append('pdf', pdfFile);
      await axios.post('http://localhost:5000/api/upload-pdf', pdfFormData);

      const res = await axios.post('http://localhost:5000/api/analyze-video', { youtubeUrl });
      navigate(`/results/${res.data._id}`);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://img.icons8.com/color/96/000000/video.png"
            alt="Analyzer Icon"
            className="mb-4"
          />
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center drop-shadow">
            Video-Book Relevancy Analyzer
          </h1>
          <p className="text-gray-500 text-center text-base">
            Compare your PDF book with a YouTube video for content relevancy.
          </p>
        </div>
        <div className="space-y-6">
          <label className="block">
            <span className="text-gray-700 font-medium">Upload PDF Book</span>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition-all"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">YouTube Video URL</span>
            <input
              type="text"
              placeholder="Paste YouTube video link here"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="mt-2 w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-400 transition-all bg-purple-50 text-gray-700"
            />
          </label>
          <button
            onClick={handleAnalysis}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </div>
    </div>
  );
  // ...existing code...
};

export default HomePage;