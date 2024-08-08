"use client";
import { useState, useEffect } from "react";
import { auth, provider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Container, IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isNarrow = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  //   const FeatureBox = ({ icon, title, description }) => (
  //     <Box
  //       width={isMobile ? "100%" : isTablet ? "45%" : "30%"}
  //       bgcolor="#ffffff"
  //       padding={2}
  //       borderRadius={2}
  //       boxShadow={3}
  //       display="flex"
  //       flexDirection="column"
  //       alignItems="center"
  //       textAlign="center"
  //       mb={2}
  //     >
  //       {icon}
  //       <Typography variant="h6" color="#663399">
  //         {title}
  //       </Typography>
  //       <Typography variant={isMobile ? "body2" : "body1"} color="#663399">
  //         {description}
  //       </Typography>
  //     </Box>
  //   );

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      overflow="auto"
      sx={{
        backgroundColor: "#9370db", // Background color
        color: "#ffffff", // Default text color
        padding: theme.spacing(2),
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={4}
        sx={{ flexGrow: 1 }}
      >
        <Typography variant={isMobile ? "h3" : "h1"} align="center">
          Inventory made simple.
        </Typography>

        <Box
          width={"100%"}
          maxWidth={isMobile ? "100%" : "1000px"}
          alignItems="center"
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
        >
          <Typography variant={isMobile ? "body1" : "h6"} align="center">
            Pantry Planner enables you to actively manage your kitchen pantry.
            Whether you require assistance to manage groceries or need to check
            if you have the missing ingredient for your recipes, Pantry Planner
            is there to help.
          </Typography>

          <Image
            src="/images/Pantry Planner Logo.png" // Update this path to match your image location
            alt="Pantry Planner Logo"
            width={isMobile ? 80 : 100}
            height={isMobile ? 80 : 100}
          />
        </Box>

        {/* Feature Boxes */}
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={isNarrow ? "column" : "row"}
          flexWrap={isNarrow ? "nowrap" : "wrap"}
          //width={isMobile ? "100%" : "100%"}
          width="100%"
          mt={5}
          mb={2}
          gap={2}
        >
          <Box
            width={isNarrow ? "100%" : "30%"}
            bgcolor="#ffffff"
            padding={2}
            borderRadius={2}
            boxShadow={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <ManageAccountsIcon
              fontSize="large"
              style={{ color: "#663399", marginBottom: "10px" }}
            />
            <Typography variant="h6" color="#663399">
              You Are The Manager
            </Typography>
            <Typography variant="h8" color="#663399">
              Effectively manage your inventory with precise quantities.
            </Typography>
          </Box>
          <Box
            width={isNarrow ? "100%" : "30%"}
            bgcolor="#ffffff"
            padding={2}
            borderRadius={2}
            boxShadow={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <PersonSearchIcon
              fontSize="large"
              style={{ color: "#663399", marginBottom: "10px" }}
            />
            <Typography variant="h6" color="#663399">
              Search Feature
            </Typography>
            <Typography variant="h8" color="#663399">
              The search feature is extremely useful in allowing you to search
              for your inventory items by keyword.
            </Typography>
          </Box>
          <Box
            width={isNarrow ? "100%" : "30%"}
            bgcolor="#ffffff"
            padding={2}
            borderRadius={2}
            boxShadow={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <PersonAddAlt1Icon
              fontSize="large"
              style={{ color: "#663399", marginBottom: "10px" }}
            />
            <Typography variant="h6" color="#663399">
              Add Items
            </Typography>
            <Typography variant="h8" color="#663399">
              Seamlessly add new items to your inventory list.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={handleGoogleLogin}
          fullWidth={isMobile}
          sx={{
            backgroundColor: "#ffffff", // White background
            color: "#9370db", // Purple text color
            "&:hover": {
              backgroundColor: "#f0f0f0", // Slightly different white on hover
              color: "#9370db", // Maintain purple text color on hover
            },
          }}
        >
          Login with Google
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        pt={2}
        //mb={1} // Margin at the bottom
        mt="auto" // margin at the top
        width="100%"
        x={{ backgroundColor: "#9370db" }}
      >
        <Box display="flex" justifyContent="center" gap={2}>
          <a
            href="https://www.linkedin.com/in/sanjay-sivapragasam/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton aria-label="LinkedIn" sx={{ color: "#ffffff" }}>
              <LinkedInIcon fontSize="large" />
            </IconButton>
          </a>
          <a
            href="mailto:sanjaysivapragasam12@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton aria-label="Email" sx={{ color: "#ffffff" }}>
              <EmailIcon fontSize="large" />
            </IconButton>
          </a>
          <a
            href="https://github.com/sanjaysivapragasam"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton aria-label="GitHub" sx={{ color: "#ffffff" }}>
              <GitHubIcon fontSize="large" />
            </IconButton>
          </a>
        </Box>
        <Typography variant="body2" sx={{ color: "#ffffff", mt: 1 }}>
          © {new Date().getFullYear()} Sanjay Sivapragasam
        </Typography>
      </Box>
    </Box>
  );
}
