const express = require("express");
const dotenv = require("dotenv");

const app = express();
const port = 3000;

dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.post("/api/gemini/prompt/send", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ message: "Please send a valid prompt" });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`;

    const fetchResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await fetchResponse.json();
    console.log(data)

    return res.status(200).json({ response: data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate content" });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

module.exports = { app };