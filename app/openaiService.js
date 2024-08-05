import axios from "axios";
require('dotenv').config()

const openai = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
   // process.env.NEXT_PUBLIC_OPENAI_API_KEY
  },
});

export const getOpenAIResponse = async (prompt) => {
  try {
    const response = await openai.post("/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
      throw new Error(
        `OpenAI API error: ${error.response.status} ${error.response.data.error.message}`
      );
    } else {
      throw error;
    }
  }
};
