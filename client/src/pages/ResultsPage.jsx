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

  const getSimilarityColor = (similarity) => {
    if (similarity > 0.8) return 'from-emerald-400 to-green-500';
    if (similarity > 0.6) return 'from-amber-400 to-yellow-500';
    return 'from-rose-400 to-red-500';
  };

  const getSimilarityRing = (similarity) => {
    if (similarity > 0.8) return 'ring-emerald-200 bg-emerald-50';
    if (similarity > 0.6) return 'ring-amber-200 bg-amber-50';
    return 'ring-rose-200 bg-rose-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-pink-400 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <p className="text-white text-xl font-light tracking-wide">Analyzing results...</p>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <p className="text-white text-xl font-light">No results found</p>
          <p className="text-white/70 mt-2">The analysis couldn't be retrieved</p>
        </div>
      </div>
    );
  }

  const relevancePercentage = result.relevancePercentage;
  const getRelevanceColor = () => {
    if (relevancePercentage >= 80) return 'from-emerald-400 to-green-500';
    if (relevancePercentage >= 60) return 'from-amber-400 to-yellow-500';
    return 'from-rose-400 to-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            Analysis Results
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Main Results Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 animate-slide-up">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="relative">
                <div className={`w-24 h-24 bg-gradient-to-r ${getRelevanceColor()} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-xl font-bold">{relevancePercentage}%</span>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent animate-ping"></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Overall Relevance</h2>
                <p className="text-white/70">Content alignment analysis</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                YouTube Source
              </h3>
              <a 
                href={result.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors break-all underline decoration-blue-400/50 hover:decoration-blue-300"
              >
                {result.youtubeUrl}
              </a>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Reference Book
              </h3>
              <p className="text-white/80">{result.bookFilename}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              AI Analysis Summary
            </h3>
            <p className="text-white/90 leading-relaxed">{result.summary}</p>
          </div>
        </div>

        {/* Content Analysis Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Similarity Heatmap */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mr-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              Similarity Heatmap
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {result.sectionSimilarities.map((item, index) => (
                <div 
                  key={index} 
                  className={`${getSimilarityRing(item.similarity)} rounded-2xl p-5 border ring-1 hover:ring-2 transition-all duration-300 hover:scale-[1.02] animate-fade-in`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-800 text-lg">
                      {(item.similarity * 100).toFixed(1)}% Match
                    </span>
                    <div className={`w-16 h-3 bg-gradient-to-r ${getSimilarityColor(item.similarity)} rounded-full shadow-lg`}>
                      <div className="w-full h-full bg-white/30 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-slate-700 text-sm mb-1">Video Section:</p>
                      <p className="text-slate-600 text-sm leading-relaxed bg-white/50 rounded-lg p-3">
                        {item.videoSection}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 text-sm mb-1">Book Reference:</p>
                      <p className="text-slate-600 text-sm leading-relaxed bg-white/50 rounded-lg p-3">
                        {item.bookSection}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mismatched Parts */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl animate-slide-up" style={{animationDelay: '0.4s'}}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg mr-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              Content Discrepancies
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {result.mismatchedParts.length > 0 ? (
                result.mismatchedParts.map((part, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{part}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-white/80 text-lg">No significant discrepancies found!</p>
                  <p className="text-white/60 text-sm mt-2">Content alignment looks great</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-white\/20 {
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        
        .scrollbar-track-transparent {
          scrollbar-track-color: transparent;
        }
        
        /* Webkit scrollbar styles */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ResultsPage;