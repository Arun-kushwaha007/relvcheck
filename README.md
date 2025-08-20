# Video-Book Relevancy Analyzer

This application analyzes the content relevancy between a PDF document (like a book) and a YouTube video. It uses AI-powered embeddings and summarization to compare the text from the book with the transcript of the video, providing a relevance score and a summary of the differences.

## Features

-   Upload a PDF file.
-   Provide a YouTube video URL.
-   Analyzes the relevancy between the PDF content and the YouTube video transcript.
-   Displays a relevance percentage.
-   Shows sections of the video transcript that are similar to the book.
-   Summarizes the parts of the video that are not found in the book.
-   Saves analysis history in a database.

## Technologies Used

-   **Frontend:** React, Vite, Tailwind CSS
-   **Backend:** Node.js, Express
-   **Database:** MongoDB
-   **AI:** Google Gemini (for embeddings and content generation)
-   **Other:** Axios, Mongoose, pdf-parse, youtube-transcript-api

## Setup and Installation

To get this project up and running locally, you'll need to set up both the server and the client.

### Prerequisites

-   Node.js and npm
-   MongoDB instance (local or cloud-based)
-   A Google Gemini API Key

### Backend (Server)

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a file named `.env` in the `server` directory and add the following environment variables:

    ```
    MONGODB_URI=<your_mongodb_connection_string>
    GEMINI_API_KEY=<your_google_gemini_api_key>
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:5000`.

### Frontend (Client)

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the client:**
    ```bash
    npm run dev
    ```
    The client will be running on `http://localhost:5173` by default and will connect to the server.

## How It Works

1.  The user uploads a PDF and provides a YouTube URL on the frontend.
2.  The PDF is sent to the `/api/upload-pdf` endpoint, where its text is extracted and stored temporarily on the server.
3.  The YouTube URL is sent to the `/api/analyze-video` endpoint.
4.  The server fetches the YouTube video's transcript.
5.  Both the book text and the video transcript are broken down into smaller chunks.
6.  The Google Gemini API is used to generate embeddings (numerical representations) for each chunk of text.
7.  The application calculates the cosine similarity between the video's text chunks and the book's text chunks to find matches.
8.  A relevance score is calculated based on how many video chunks have a strong match in the book.
9.  For the parts of the video that don't match the book, the Gemini API is used again to generate a summary of the differences.
10. The results are saved to the MongoDB database and sent back to the client for display.
