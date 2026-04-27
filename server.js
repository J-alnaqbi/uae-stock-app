const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("."));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question) {
      return res.json({ answer: "Please write a question." });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an educational assistant for UAE stock market beginners. Keep answers simple. Do not give buy or sell recommendations. Always say this is educational, not financial advice."
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    res.json({
      answer: response.choices[0].message.content
    });
  } catch (error) {
    res.json({
      answer: "Sorry, AI is not working now. Please try again later."
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
