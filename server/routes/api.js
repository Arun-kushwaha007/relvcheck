// server/routes/api.js
const express = require('express');
const multer = require('multer');
const { extractPdfText, extractYoutubeTranscript } = require('../services/textExtractor');
const { analyzeContent } = require('../services/aiService');
const Analysis = require('../models/Analysis');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

let bookData = { text: null, filename: null }; // Temporary in-memory storage

router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    const text = await extractPdfText(req.file.buffer);
    bookData = { text, filename: req.file.originalname };
    res.status(200).json({ message: 'PDF processed successfully.' });
  } catch (error) {
    res.status(500).send('Error processing PDF.');
  }
});

router.post('/analyze-video', async (req, res) => {
  const { youtubeUrl } = req.body;
  if (!youtubeUrl || !bookData.text) {
    return res.status(400).send('YouTube URL and PDF are required.');
  }
  try {
    const videoTranscript = await extractYoutubeTranscript(youtubeUrl);
    const analysisResult = await analyzeContent(bookData.text, videoTranscript);

    const newAnalysis = new Analysis({
      youtubeUrl,
      bookFilename: bookData.filename,
      ...analysisResult,
    });
    await newAnalysis.save();

    res.status(200).json(newAnalysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/result/:id', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).send('Analysis not found.');
    }
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).send('Server error.');
  }
});

router.get('/history', async (req, res) => {
    try {
        const analyses = await Analysis.find().sort({ createdAt: -1 });
        res.status(200).json(analyses);
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

module.exports = router;