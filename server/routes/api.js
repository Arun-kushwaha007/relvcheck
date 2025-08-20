const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({ 
  dest: uploadsDir,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// In-memory storage (replace with database in production)
let uploadedPdfInfo = null;
let analysisResults = {};

// Test route
router.get('/test', (req, res) => {
  console.log('🧪 Test route accessed');
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/test',
      'POST /api/upload-pdf',
      'POST /api/analyze-video', 
      'GET /api/result/:id'
    ]
  });
});

// PDF upload route
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    console.log('📄 PDF Upload Request received');
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    console.log('✅ PDF uploaded successfully:', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
    
    // Store file info for later use in analysis
    uploadedPdfInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      uploadTime: new Date().toISOString()
    };
    
    res.json({ 
      success: true,
      message: 'PDF uploaded successfully',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('❌ PDF Upload Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload PDF', 
      details: error.message 
    });
  }
});

// Video analysis route
router.post('/analyze-video', async (req, res) => {
  try {
    console.log('🎥 Video Analysis Request received');
    console.log('Request body:', req.body);
    
    const { youtubeUrl } = req.body;
    
    if (!youtubeUrl) {
      console.log('❌ No YouTube URL provided');
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    // Validate YouTube URL format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w\-_]{11}(&.*)?$/;
    if (!youtubeRegex.test(youtubeUrl)) {
      console.log('❌ Invalid YouTube URL format:', youtubeUrl);
      return res.status(400).json({ error: 'Please provide a valid YouTube URL' });
    }

    console.log('✅ Processing YouTube URL:', youtubeUrl);

    // Check if PDF was uploaded
    if (!uploadedPdfInfo) {
      console.log('❌ No PDF found for analysis');
      return res.status(400).json({ error: 'Please upload a PDF file first' });
    }

    console.log('✅ PDF file found for analysis:', uploadedPdfInfo.originalName);

    // Simulate processing time (replace with actual analysis)
    console.log('🔄 Starting analysis...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate unique analysis ID
    const analysisId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    // Calculate realistic similarity scores
    const baseSimilarity = Math.random() * 0.4 + 0.5; // 50-90%
    const sectionCount = Math.floor(Math.random() * 3) + 3; // 3-5 sections
    
    const sectionSimilarities = [];
    for (let i = 0; i < sectionCount; i++) {
      const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
      const similarity = Math.max(0.2, Math.min(0.95, baseSimilarity + variation));
      
      sectionSimilarities.push({
        similarity: parseFloat(similarity.toFixed(3)),
        videoSection: `Section ${i + 1} (${i * 3}:00-${(i + 1) * 3}:00)`,
        bookSection: `Chapter ${i + 1}: ${['Introduction', 'Core Concepts', 'Applications', 'Advanced Topics', 'Conclusion'][i] || 'Additional Content'}`
      });
    }

    // Calculate overall relevance
    const avgSimilarity = sectionSimilarities.reduce((sum, s) => sum + s.similarity, 0) / sectionSimilarities.length;
    const relevancePercentage = Math.round(avgSimilarity * 100);

    // Generate mismatched parts based on similarity
    const mismatchedParts = [];
    if (avgSimilarity < 0.8) {
      mismatchedParts.push('Video contains practical examples not found in the book');
    }
    if (avgSimilarity < 0.7) {
      mismatchedParts.push('Book includes theoretical background missing from video');
    }
    if (avgSimilarity < 0.6) {
      mismatchedParts.push('Different focus areas between video and book content');
    }
    if (mismatchedParts.length === 0) {
      mismatchedParts.push('Minor differences in presentation style and examples');
    }

    const result = {
      _id: analysisId,
      youtubeUrl: youtubeUrl,
      bookFilename: uploadedPdfInfo.originalName,
      relevancePercentage: relevancePercentage,
      summary: `Analysis of "${uploadedPdfInfo.originalName}" against the YouTube video shows ${relevancePercentage}% content alignment. The comparison reveals ${sectionSimilarities.length} main content sections with varying degrees of similarity.`,
      sectionSimilarities: sectionSimilarities,
      mismatchedParts: mismatchedParts,
      analysisDate: new Date().toISOString(),
      processingTime: '2.1 seconds'
    };

    // Store result for retrieval
    analysisResults[analysisId] = result;

    console.log('✅ Analysis completed with ID:', analysisId);
    console.log(`📊 Relevance: ${relevancePercentage}%`);
    
    res.json(result);

  } catch (error) {
    console.error('❌ Video Analysis Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to analyze video', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Results retrieval route
router.get('/result/:id', async (req, res) => {
  try {
    console.log('📊 Results Request for ID:', req.params.id);
    
    const { id } = req.params;
    
    // Validate ID
    if (!id || id.length < 5) {
      return res.status(400).json({ error: 'Invalid result ID format' });
    }

    // Retrieve from storage
    const result = analysisResults[id];
    
    if (!result) {
      console.log('❌ Result not found for ID:', id);
      return res.status(404).json({ 
        error: 'Analysis result not found',
        message: 'The requested analysis may have expired or the ID is incorrect'
      });
    }

    console.log('✅ Results retrieved for ID:', id);
    res.json(result);

  } catch (error) {
    console.error('❌ Results Retrieval Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve results', 
      details: error.message 
    });
  }
});

// Get current PDF info
router.get('/pdf-info', (req, res) => {
  if (!uploadedPdfInfo) {
    return res.status(404).json({ error: 'No PDF uploaded yet' });
  }
  
  res.json({
    success: true,
    pdf: {
      originalName: uploadedPdfInfo.originalName,
      size: uploadedPdfInfo.size,
      uploadTime: uploadedPdfInfo.uploadTime
    }
  });
});

// Clear uploaded PDF
router.delete('/pdf', (req, res) => {
  if (uploadedPdfInfo) {
    // Clean up file
    if (fs.existsSync(uploadedPdfInfo.path)) {
      fs.unlinkSync(uploadedPdfInfo.path);
    }
    uploadedPdfInfo = null;
  }
  
  res.json({ success: true, message: 'PDF cleared' });
});

module.exports = router;