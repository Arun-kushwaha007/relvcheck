const pdf = require('pdf-parse');
const { YoutubeTranscript } = require('youtube-transcript-api');

async function extractPdfText(buffer) {
  const data = await pdf(buffer);
  return data.text;
}

async function extractYoutubeTranscript(url) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    return transcript.map((item) => item.text).join(' ');
  } catch (error) {
    throw new Error('Could not fetch YouTube transcript.');
  }
}

module.exports = { extractPdfText, extractYoutubeTranscript };