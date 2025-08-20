require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function chunkText(text, chunkSize = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}

async function getEmbeddings(textChunks) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await model.batchEmbedChunks({
    requests: textChunks.map(chunk => ({ text: chunk }))
  });
  return result.embeddings.map(e => e.values);
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

async function analyzeContent(bookText, videoTranscript) {
  const bookChunks = chunkText(bookText);
  const videoChunks = chunkText(videoTranscript);

  const bookEmbeddings = await getEmbeddings(bookChunks);
  const videoEmbeddings = await getEmbeddings(videoChunks);

  let totalSimilarity = 0;
  const sectionSimilarities = [];
  const mismatchedParts = [];

  videoEmbeddings.forEach((videoVec, i) => {
    let maxSimilarity = 0;
    let bestMatchIndex = -1;

    bookEmbeddings.forEach((bookVec, j) => {
      const similarity = cosineSimilarity(videoVec, bookVec);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestMatchIndex = j;
      }
    });

    if (maxSimilarity > 0.5) { // Similarity threshold
      totalSimilarity += maxSimilarity;
      sectionSimilarities.push({
        videoSection: videoChunks[i],
        bookSection: bookChunks[bestMatchIndex],
        similarity: maxSimilarity,
      });
    } else {
      mismatchedParts.push(videoChunks[i]);
    }
  });

  const relevancePercentage = (totalSimilarity / videoEmbeddings.length) * 100;

  // Optional: Generate a summary of differences with Gemini Pro
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Based on the following mismatched parts from a video transcript when compared to a book, provide a brief summary of the differences: ${mismatchedParts.join(', ')}`;
  const result = await model.generateContent(prompt);
  const summary = await result.response.text();

  return {
    relevancePercentage: relevancePercentage.toFixed(2),
    sectionSimilarities,
    mismatchedParts,
    summary,
  };
}

module.exports = { analyzeContent };