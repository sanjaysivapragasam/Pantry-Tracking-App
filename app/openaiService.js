// import axios from "axios";
// require('dotenv').config()

// const openai = axios.create({
//   baseURL: "https://api.openai.com/v1",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
//    // process.env.NEXT_PUBLIC_OPENAI_API_KEY
//   },
// });

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_LLAMA_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
   // "Content-Type": "application/json",
    //"HTTP-Referer": $YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
    //"X-Title": $YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  },
});



export const getOpenAIResponse = async (prompt) => {

  //console.log (prompt);
  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-8b-instruct:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const generatedText = completion.choices[0].message.content;

  // Split the generated text into sections
  const sections = generatedText.split("\n\n");

  // Extract the recipe name, ingredients, and instructions
  const recipeName = sections[0].trim();
  const ingredientsSection = sections[1].replace("Ingredients:", "").trim();
  const instructionsSection = sections[2].replace("Instructions:", "").trim();

  // Split the ingredients into an array
  const ingredients = ingredientsSection.split(",").map((item) => item.trim());

  return {
    recipeName,
    ingredients,
    instructions: instructionsSection,
  };
};

//   try {
//     const response = await openai.post("/chat/completions", {
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 100,
//     });
//     return response.data.choices[0].message.content;
//   } catch (error) {
//     console.error("Error calling OpenAI:", error);
//     if (error.response) {
//       console.error(error.response.status, error.response.data);
//       throw new Error(
//         `OpenAI API error: ${error.response.status} ${error.response.data.error.message}`
//       );
//     } else {
//       throw error;
//     }
//   }
