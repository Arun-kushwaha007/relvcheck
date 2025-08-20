// client/src/pages/HomePage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const [dragActive, setDragActive] = useState(false);
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
   const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/pdf') {
          setPdfFile(file);
        } else {
          alert('Please drop a PDF file.');
        }
      }
    };
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

  // ...existing code...
  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-12">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M12 21l-8-5v-8l8-5 8 5v8l-8 5z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">
              Video-Book Relevancy
              <br />
              <span className="text-5xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Analyzer
              </span>
            </h1>

            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Discover the connections between written knowledge and video content. 
              Our AI-powered analyzer compares PDF books with YouTube videos to reveal 
              content relevancy and knowledge gaps.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { icon: "🤖", text: "AI-Powered Analysis" },
                { icon: "📊", text: "Detailed Insights" },
                { icon: "⚡", text: "Fast Processing" },
                { icon: "🎯", text: "Precise Matching" }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white/90 text-sm font-medium hover:bg-white/20 transition-all duration-300 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <span className="mr-2">{feature.icon}</span>
                  {feature.text}
                </div>
              ))}
            </div>
          </div>

          {/* Main Analyzer Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 animate-slide-up">
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* PDF Upload Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Upload Your Book</h3>
                </div>

                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-purple-400 bg-purple-500/20' 
                      : pdfFile 
                        ? 'border-green-400 bg-green-500/20' 
                        : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  <div className="pointer-events-none">
                    {pdfFile ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg">{pdfFile.name}</p>
                          <p className="text-white/60">{formatFileSize(pdfFile.size)}</p>
                        </div>
                        <button
                          onClick={() => setPdfFile(null)}
                          className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl mx-auto flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg mb-2">
                            Drop your PDF here
                          </p>
                          <p className="text-white/60 text-sm">
                            or click to browse files
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* YouTube URL Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">YouTube Video</h3>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Paste your YouTube video URL here..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 text-lg"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {youtubeUrl && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-white/80 text-sm">Valid YouTube URL detected</p>
                    </div>
                  </div>
                )}

                {/* Example URLs */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-white/60 text-sm mb-3">Example formats:</p>
                  <div className="space-y-2 text-xs">
                    <div className="text-white/40">youtube.com/watch?v=...</div>
                    <div className="text-white/40">youtu.be/...</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <div className="mt-10 text-center">
              <button
                onClick={handleAnalysis}
                disabled={loading || !pdfFile || !youtubeUrl}
                className="relative group px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white font-bold text-xl shadow-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing Content...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <span>Start Analysis</span>
                    </>
                  )}
                </div>
              </button>
              
              {(!pdfFile || !youtubeUrl) && (
                <p className="text-white/60 text-sm mt-4">
                  Please provide both a PDF file and YouTube URL to begin
                </p>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.8s'}}>
            {[
              {
                icon: "🎯",
                title: "Precision Matching",
                description: "Advanced AI algorithms find exact content matches between your book and video"
              },
              {
                icon: "📊",
                title: "Detailed Analytics",
                description: "Get comprehensive similarity scores and section-by-section comparisons"
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Process entire books and hour-long videos in minutes, not hours"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
  // ...existing code...
};

export default HomePage;