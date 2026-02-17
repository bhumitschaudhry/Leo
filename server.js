const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "You are Leo, a helpful and concise AI assistant. Your goal is to provide clear, accurate, and brief responses to user queries."
});

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        if (error.response) {
            console.error('API Error Response Data:', JSON.stringify(error.response, null, 2));
        }
        res.status(500).json({ error: 'Failed to get response from AI: ' + (error.message || 'Unknown error') });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Leo server running at http://localhost:${port}`);
});
