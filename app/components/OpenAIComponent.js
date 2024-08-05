import React, { useState } from "react";
import { getOpenAIResponse } from "../openaiService";
import {
  Box,
  Typography,
  TextField,
  Button,
  isLoading,
  CircularProgress,
  Alert,
  error,
} from "@mui/material";

const OpenAIComponent = ({ inventory }) => {
  //const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRecipe = async () => {
    setIsLoading(true);
    setError("");
    try {
      const ingredients = inventory
        .map((item) => `${item.id} (${item.quantity})`)
        .join(", ");
      const prompt = `Generate a recipe using some or all of these ingredients: ${ingredients}. Please provide the recipe name, ingredients used (with quantities), and brief instructions.`;

      const aiResponse = await getOpenAIResponse(prompt);
      setResponse(aiResponse);
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
    <Box justifyContent={"center"} alignItems = {"center"} display = {"flex"} flexDirection={"column"}>
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
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {response && (
        <Box mt={3}>
          <Typography variant="h6" color="#663399" gutterBottom>
            AI Suggested Recipe:
          </Typography>
          <Typography variant="body1" color="#000000" whiteSpace="pre-wrap">
            {response}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OpenAIComponent;
