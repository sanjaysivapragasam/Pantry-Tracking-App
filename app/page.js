// it's a client sided app for simplicity sake
"use client";
// state variables
import React, { useState, useEffect } from "react";
import { firestore, auth, provider, app } from "@/firebase";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useRouter } from "next/navigation";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from "next/image";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
// importing OpenAI
import OpenAIComponent from "./components/OpenAIComponent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  // inventory management helper functions and state variables
  const [user, setUser] = useState(null); // user state to track authenticated user
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false); //for adding and removing
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // search query state
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const checkFirebase = async () => {
      while (!firestore) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      setIsFirebaseReady(true);
    };
    checkFirebase();
  }, []);

  useEffect(() => {
    if (!isFirebaseReady) return;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        updateInventory(user.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [isFirebaseReady, router]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Logged in user:", result.user);
      // You can add more logic here, such as updating the app state
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  // query DB
  const updateInventory = async (userId) => {
    if (!isFirebaseReady || !firestore) {
      console.log("Firestore is not ready yet");
      return;
    }
    try {
      const inventoryRef = collection(firestore, "users", userId, "inventory");
      const snapshot = await getDocs(inventoryRef);
      const inventoryList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  // useEffect hook ensures this runs when the component mounts
  // we only need to update once page loads
  useEffect(() => {
    updateInventory();
  }, [updateInventory]);

  const addItem = async (item) => {
    if (!user) return;
    const inventoryRef = doc(
      collection(firestore, "users", user.uid, "inventory"),
      item
    );
    const docSnap = await getDoc(inventoryRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(inventoryRef, { quantity: quantity + 1 });
    } else {
      await setDoc(inventoryRef, { quantity: 1 });
    }
    await updateInventory(user.uid);
  };

  const removeItem = async (item) => {
    if (!user) return;
    const inventoryRef = doc(
      collection(firestore, "users", user.uid, "inventory"),
      item
    );
    const docSnap = await getDoc(inventoryRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(inventoryRef);
      } else {
        await setDoc(inventoryRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory(user.uid);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filter inventory based on search query
  const filteredInventory = inventory.filter((item) =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isFirebaseReady) {
    return (
      <Box
        width="100vw" // size of display's width
        height="100vh" // size of display's height
        display="flex"
        //flexDirection = "column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#9370db"
      >
        <CircularProgress color="secondary" />
        <Typography variant="h6" color="white" ml={2}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      height="100vh"
      display={"flex"}
      // justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      overflow = {"auto"}
      sx={{
        backgroundColor: "#9370db", // Change to your desired background color
        color: "#ffffff", // Default text color
        position: "relative", // Add this to allow absolute positioning of children
        padding: theme.spacing(2),
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        
        <Box sx={style} width = {isMobile ? "70%": "45%"}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {user && (
        <>
          {/* if its a mobile device, list elements going downward (column), otherwise we list elements in a row */}
          <Box
            display="flex"
            alignItems="center"
            flexDirection={isMobile ? "column" : "row"}
            gap={2}
          >
            <Image
              src="/images/Pantry Planner Logo.png" // Update this path to match your image location
              alt="Pantry Planner Logo"
              width={isMobile ? 50 : 120}
              height={isMobile ? 50 : 120}
            />

            <Typography variant={isMobile ? "h4" : "h1"}>
              {" "}
              Pantry Planner{" "}
            </Typography>
          </Box>

          {/* <Typography variant="h4">Inventory made simple.</Typography> */}
          {/* <Typography variant="h6">Welcome, {user.displayName}!</Typography> */}

          <Box
            display="flex"
            alignItems="center"
            justifyContent={"center"}
            flexDirection={isMobile ? "column" : "row"}
            gap={2} // Space between items
            mb={2} // Margin bottom
            width="100%"
          >
            <Button
              variant="contained"
              onClick={handleOpen}
              fullWidth={isMobile}
              sx={{
                backgroundColor: "#ffffff",
                color: "#9370db",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Add New Item
            </Button>

            <TextField
              variant="outlined"
              label="Search Inventory"
              value={searchQuery}
              justifyContent = "center"
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth={isMobile}
              sx={{
                width: isMobile ? "100%" : "300px",
                margin: isMobile ? "10px 0" : "0",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
              InputLabelProps={{
                style: { color: "#ffffff" },
              }}
            />

            <Button
              variant="contained"
              onClick={() => auth.signOut()}
              fullWidth={isMobile}
              sx={{
                backgroundColor: "#ffffff",
                color: "#9370db",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Sign Out
            </Button>
          </Box>

          {user && (
            <Box
              border={"2px solid #ffffff"}
              mb={1}
              width="100%"
              maxWidth="800px"
            >
              <Box
                width="100%"
                height="100px"
                bgcolor={"#663399"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography
                  variant={isMobile ? "h5" : "h3"}
                  color={"#ffffff"}
                  textAlign={"center"}
                >
                  Inventory Items
                </Typography>
              </Box>

              <Stack width="100%" height="300px" spacing={2} overflow={"auto"}>
                {filteredInventory.map(({ id, quantity }) => (
                  <Box
                    key={id}
                    width="100%"
                    minHeight="150px"
                    display={"flex"}
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    colour={"#9370db"}
                    bgcolor={"#ffffff"}
                    paddingX={2}
                  >
                    <Box
                      width={isMobile ? "100%" : "40%"}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      mb={isMobile ? 2 : 0}
                    >
                      <Typography variant={isMobile ? "h5" : "h4"} color={"#663399"} noWrap>
                        {id.charAt(0).toUpperCase() + id.slice(1)}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={isMobile ? "space-between" : "flex-end"}
                      width={isMobile ? "100%" : "60%"}
                      //pr={2}
                    >
                      <Button
                        variant="contained"
                        onClick={() => removeItem(id)}
                        sx={{
                          backgroundColor: "#9370db", // Tomato red
                          "&:hover": {
                            backgroundColor: "#663399", // Darker shade for hover
                          },
                        }}
                      >
                        -
                      </Button>
                      <Typography
                        variant={"h5"}
                        color={"#663399"}
                        sx={{
                          margin: "0 20px",
                          minWidth: "40px",
                          textAlign: "center",
                        }}
                      >
                        {quantity}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => addItem(id)}
                        sx={{
                          backgroundColor: "#9370db", // Tomato red
                          "&:hover": {
                            backgroundColor: "#663399", // Darker shade for hover
                          },
                        }}
                      >
                        +
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          <Box
            width="100%"
            maxWidth="800px"
            border={"2px solid #ffffff"}
            bgcolor={"#ffffff"}
            p={3}
            borderRadius={2}
            mb={0}
            mt = {0}
          >
            <OpenAIComponent inventory={inventory} />
          </Box>
        </>
      )}

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={1}
        mb={1}
       // overflow = {"auto"}
        width="100%"
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
