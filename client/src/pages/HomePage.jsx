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
      await axios.post('http://localhost:5001/api/upload-pdf', pdfFormData);

      const res = await axios.post('http://localhost:5001/api/analyze-video', { youtubeUrl });
      navigate(`/results/${res.data._id}`);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Video-Book Relevancy Analyzer</h1>
        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        <input
          type="text"
          placeholder="YouTube Video URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
          <button
            onClick={handleAnalysis}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;