import React, { useState } from "react";
import { getOpenAIResponse } from "../openaiService";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

const OpenAIComponent = ({ inventory }) => {
  //const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRecipe = async () => {
    setIsLoading(true);
    setError("");
    try {
      const ingredients = inventory
        .map((item) => `${item.id} (${item.quantity})`)
        .join(", ");
      //.map((item) => `${item.id} (${item.quantity})`)
      // const prompt = `Generate a simple, tasty recipe that uses some of the following ingredients while creating an appealing dish: ${ingredients}. The recipe should include: a Recipe title, ingredients (with quantities, and instructions (3-5 steps). The goal is to create a recipe that is easy to make and sounds appetizing, even if it does not use every single ingredient on the list.`;

      const prompt = `Generate a recipe using some of these ingredients: ${ingredients}. 
Please provide the recipe in the following format:
1. Recipe Name: [Recipe Name]
2. Ingredients: [List of ingredients with quantities, separated by commas]
3. Instructions: [Step-by-step instructions in a numbered list]
Please format the answer in a simple, clean format.`;

      //const prompt = `Generate only 1 recipe with preparation/cooking instructions, and quantities using some of these ingredients: ${ingredients}. `;
      // It is okay to not use all ingredients, as the user wants simple and easy recipes that taste good. Please provide the recipe name, ingredients used (with quantities), and brief instructions. Please format the response in a clear, easy-to-read manner.
      // const aiResponse = await getOpenAIResponse(prompt);
      // setResponse(aiResponse);

      const aiResponse = await getOpenAIResponse(prompt);
      setResponse(aiResponse);
      // const {
      //   recipeName,
      //   ingredients: recipeIngredients,
      //   instructions,
      // } = await getOpenAIResponse(prompt);
      // setResponse({ recipeName, ingredients: recipeIngredients, instructions });
    } catch (err) {
      if (
        err.message.includes("429") &&
        err.message.includes("exceeded your current quota")
      ) {
        setError("OpenAI API quota exceeded. Please try again later.");
      } else {
        setError(
          "An error occurred while generating the recipe. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Typography variant="h4" color="#663399" gutterBottom>
        AI Recipe Suggestions
      </Typography>
      <Button
        onClick={generateRecipe}
        variant="contained"
        disabled={isLoading}
        sx={{
          backgroundColor: "#9370db",
          "&:hover": {
            backgroundColor: "#663399",
          },
          mb: 0,
          mt: 0,
        }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Generate Recipe"}
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2, color: "#663399" }}>
          {error}
        </Alert>
      )}

      {response && (
        <Box mt={3}>
          <Typography
            variant="body1"
            color="#663399"
            component="div"
            whiteSpace="pre-wrap"
          >
            {response}
          </Typography>
        </Box>
      )}

      {/* {response && (
        <Box mt={3}>
          <Typography variant="h6" color="#663399" gutterBottom>
            {response.recipeName}
          </Typography>
          <Typography variant="body1" color="#663399" gutterBottom>
            Ingredients:
          </Typography>
          <ul>
            {response.ingredients.map((ingredient, index) => (
              <li key={index} style={{ color: "#663399" }}>
                {ingredient}
              </li>
            ))}
          </ul>
          <Typography variant="body1" color="#663399" gutterBottom>
            Instructions:
          </Typography>
          <ol>
            {response.instructions.split('\n').map((instruction, index) => (
              <li key={index} style={{ color: "#663399" }}>
                {instruction}
              </li>
            ))}
          </ol>
        </Box>
      )} */}
    </Box>
  );
};

export default OpenAIComponent;

//   return (
//     <Box
//       justifyContent={"center"}
//       alignItems={"center"}
//       display={"flex"}
//       flexDirection={"column"}
//     >
//       <Typography variant="h4" color="#663399" gutterBottom>
//         AI Recipe Suggestions
//       </Typography>
//       <Button
//         onClick={generateRecipe}
//         variant="contained"
//         disabled={isLoading}
//         sx={{
//           backgroundColor: "#9370db",
//           "&:hover": {
//             backgroundColor: "#663399",
//           },
//           mb: 0,
//           mt: 0,
//         }}
//       >
//         {isLoading ? <CircularProgress size={24} /> : "Generate Recipe"}
//       </Button>
//       {error && (
//         <Alert severity="error" sx={{ mt: 2, color: "#663399" }}>
//           {error}
//         </Alert>
//       )}
//       {response && (
//         <Box mt={3}>
//           <Typography variant="h6" color="#663399" gutterBottom>
//             {response.recipeName}
//           </Typography>
//           <Typography variant="body1" color="#663399" gutterBottom>
//             Ingredients:
//           </Typography>
//           <ul>
//             {response.ingredients.map((ingredient, index) => (
//               <li key={index} style={{ color: "#663399" }}>
//                 {ingredient}
//               </li>
//             ))}
//           </ul>
//           <Typography variant="body1" color="#663399" gutterBottom>
//             Instructions:
//           </Typography>
//           <Typography variant="body1" color="#663399" whiteSpace="pre-wrap">
//             {response.instructions}
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default OpenAIComponent;
