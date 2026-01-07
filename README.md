# Leo - Lightweight Gemini Clone

Leo is a minimal, high-performance chat interface designed to resemble Google Gemini. It can run as a full-stack Node.js application or as a static site (GitHub Pages) with a user-provided API key.

## Features
- **Modern UI**: Clean, responsive design with a premium **Bright Orange gradient** accent.
- **Themes**: Support for Light and Dark modes with seamless transitions and a custom theme picker.
- **Dual Mode**:
  - **Backend Mode**: Uses a Node.js/Express server to securely handle API calls.
  - **Static Mode (BYOK)**: Works directly in the browser by providing your own Gemini API key in the settings.
- **High Performance**: Powered by the **Gemini 2.5 Flash** model for lightning-fast, concise responses.

## Deployment to GitHub Pages

Leo is designed to be GitHub Pages ready! 

1. **Fork/Clone** this repository.
2. Go to your repository **Settings** > **Pages**.
3. Select **Deploy from a branch**.
4. Choose the `main` branch and the root or `/public` folder (ensure `index.html` is at the root of the deployment).
5. Visit your published URL.
6. Open **Settings** in the app and enter your **Gemini API Key**.

## Running Locally (Node.js)

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup API Key**:
   Create a `.env` file in the root:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. **Start the Server**:
   ```bash
   npm start
   ```
4. **Open in Browser**: `http://localhost:3000`

## Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, ES6+ JavaScript.
- **Backend**: Node.js, Express.
- **AI Model**: Google Generative AI (Gemini 2.5 Flash).
