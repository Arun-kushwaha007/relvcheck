const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  youtubeUrl: { type: String, required: true },
  bookFilename: { type: String, required: true },
  relevancePercentage: { type: Number, required: true },
  sectionSimilarities: [
    {
      bookSection: String,
      videoSection: String,
      similarity: Number,
    },
  ],
  mismatchedParts: [String],
  summary: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analysis', analysisSchema);