const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Load environment variables from .env file
require("dotenv").config();

// Manually set the API key (instead of using the environment variable directly)
const apiKey = ''; // Replace with your actual API key

// Initialize Google Generative AI with the API key
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI({ apiKey });
console.log("GoogleGenerativeAI initialized:", genAI);

app.post("/gemini", async (req, res) => {
  try {
    console.log("Request received at /gemini");
    console.log("History:", req.body.history);
    console.log("Message:", req.body.message);

    // Check if the API key is correctly set
    if (!apiKey) {
      throw new Error("API key is not set in the server code");
    }

    // Fetch the model (you might need to adjust this depending on the actual API structure)
    const model = await genAI.getModel({ model: "gemini-pro" });
    console.log("Model fetched:", model);

    // Start the chat with the fetched model
    const chat = model.startChat({
      history: req.body.history,
    });
    console.log("Chat started:", chat);

    const msg = req.body.message;

    // Send the message and get the result
    const result = await chat.sendMessage(msg);
    console.log("Message sent, result:", result);

    // Extract the response text and send it back to the client
    const text = result.response;
    console.log("Response text:", text);

    res.send({ response: text });
  } catch (error) {
    console.error("Error in /gemini route:", error.message);
    res.status(500).send("Server error occurred.");
  }
});

// Start the server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
