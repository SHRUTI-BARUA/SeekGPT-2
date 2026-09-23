import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import ChatRoutes from "./routes/chat.js";
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use("/api", ChatRoutes);
const connectDB = async () => {
  try {
    //console.log(process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connected");
  } catch (err) {
    console.log("Failed to connect", err);
  }
};

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
  connectDB();
});


/*
app.post("/test", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/