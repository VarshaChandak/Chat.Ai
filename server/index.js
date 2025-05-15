const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ Initialize OpenAI with API Key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Route to handle message from frontend
app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use gpt-4 only if your key supports it
      messages: [{ role: "user", content: userMessage }],
    });

    const reply = chatCompletion.choices[0].message.content.trim();
    res.json({ reply });
  } catch (err) {
    // 🛠 Improved error logging
    console.error("OpenAI API error:", err?.response?.data || err.message || err);
    res.status(500).json({ reply: "⚠️ Sorry, something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
