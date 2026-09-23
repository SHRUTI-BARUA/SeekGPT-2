/* import "dotenv/config";
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
const getResponse = async (message) => {
  try {

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        }),
      }
    );

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text;

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default getResponse; */
import "dotenv/config";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";

const getResponse = async (message, history = [], imageBase64 = null) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history,
        image_base64: imageBase64,
      }),
    });

    if (!response.ok) {
      throw new Error(`ai-service responded with ${response.status}`);
    }

    const data = await response.json();
    return data.reply;

  } catch (err) {
    console.error("getResponse failed:", err.message);
    throw err;
  }
};

export default getResponse;