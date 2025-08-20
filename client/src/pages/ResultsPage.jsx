// client/src/pages/ResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResultsPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/result/${id}`);
        setResult(res.data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) return <div>Loading results...</div>;
  if (!result) return <div>No results found.</div>;

  const getSimilarityColor = (similarity) => {
    if (similarity > 0.8) return 'bg-green-500';
    if (similarity > 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Analysis Results</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold">Overall Relevance: {result.relevancePercentage}%</h2>
        <p><strong>YouTube URL:</strong> <a href={result.youtubeUrl} target="_blank" rel="noopener noreferrer">{result.youtubeUrl}</a></p>
        <p><strong>Book:</strong> {result.bookFilename}</p>
        <p className="mt-4"><strong>AI Summary of Differences:</strong> {result.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-2xl font-semibold mb-3">Similarity Heatmap</h3>
          {result.sectionSimilarities.map((item, index) => (
            <div key={index} className="border p-4 rounded mb-2">
              <div className="flex justify-between items-center">
                <p className="font-bold">Similarity: {(item.similarity * 100).toFixed(2)}%</p>
                <div className={`w-10 h-4 rounded ${getSimilarityColor(item.similarity)}`}></div>
              </div>
              <p><strong>Video Section:</strong> {item.videoSection}</p>
              <p><strong>Matched Book Section:</strong> {item.bookSection}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-3">Mismatched Parts</h3>
          {result.mismatchedParts.map((part, index) => (
            <p key={index} className="bg-red-100 p-2 rounded mb-2">{part}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;