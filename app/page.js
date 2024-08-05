// it's a client sided app for simplicity sake
'use client'
// state variables
import { useState, useEffect } from 'react'
import { firestore, auth, provider, app } from '@/firebase';
import { Box, Stack, Typography, Button, Modal, TextField, CircularProgress, IconButton } from '@mui/material'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Icon } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useRouter } from 'next/navigation'
import Image from "next/image";
import {
  collection, doc, getDocs, query, setDoc, deleteDoc, getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,

}

export default function Home() {

  // inventory management helper functions and state variables
  const [user, setUser] = useState(null); // user state to track authenticated user
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false) //for adding and removing
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('') // search query state
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)
  const router = useRouter()


  useEffect(() => {
    const checkFirebase = async () => {
      while (!firestore) {
        await new Promise(resolve => setTimeout(resolve, 100));
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
        router.push('/login')
      }
    });
    return () => unsubscribe();
  }, [isFirebaseReady, router]);





  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Logged in user:', result.user);
      // You can add more logic here, such as updating the app state
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };


  // query DB
  const updateInventory = async (userId) => {
    if (!isFirebaseReady || !firestore) {
      console.log('Firestore is not ready yet');
      return;
    }
    try {
      const inventoryRef = collection(firestore, 'users', userId, 'inventory');
      const snapshot = await getDocs(inventoryRef);
      const inventoryList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(inventoryList);
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  }

  // useEffect hook ensures this runs when the component mounts
  // we only need to update once page loads
  useEffect(
    () => {
      updateInventory()
    },

    [])

  const addItem = async (item) => {
    if (!user) return;
    const inventoryRef = doc(collection(firestore, 'users', user.uid, 'inventory'), item);
    const docSnap = await getDoc(inventoryRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(inventoryRef, { quantity: quantity + 1 });
    } else {
      await setDoc(inventoryRef, { quantity: 1 });
    }
    await updateInventory(user.uid);
  }

  const removeItem = async (item) => {
    if (!user) return;
    const inventoryRef = doc(collection(firestore, 'users', user.uid, 'inventory'), item);
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
  }


  const getRecipeSuggestions = async () => {
    try {
      const functions = getFunctions(app);
      const getRecipes = httpsCallable(functions, 'getRecipes');
      const result = await getRecipes({ ingredients });
      setRecipeSuggestions(result.data.suggestions);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Failed to get recipe suggestions. Please try again later.');
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );



  if (!isFirebaseReady) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
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

      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{
        backgroundColor: '#9370db', // Change to your desired background color
        color: '#ffffff', // Default text color
        position: 'relative', // Add this to allow absolute positioning of children
      }}
    >


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
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
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>



      {user && (
        <>

          <Box display="flex" alignItems="center" gap={2}>
            <Image
              src="/images/Pantry Planner Logo.png"  // Update this path to match your image location
              alt="Pantry Planner Logo"
              width={120}  // Adjust the size as needed
              height={120}  // Adjust the size as needed
            />
            <Typography variant="h1">Pantry Planner</Typography>
          </Box>

          {/* <Typography variant="h4">Inventory made simple.</Typography> */}
          {/* <Typography variant="h6">Welcome, {user.displayName}!</Typography> */}



          <Box
            display="flex"
            alignItems="center"
            gap={3} // Space between items
            mb={2} // Margin bottom
          >
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                backgroundColor: '#ffffff',
                color: '#9370db',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Add New Item
            </Button>

            <TextField
              variant="outlined"
              label="Search Inventory"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: '300px',
                margin: '0',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
              }}
              InputLabelProps={{
                style: { color: '#ffffff' },
              }}
            />

            <Button
              variant="contained"
              onClick={() => auth.signOut()}
              sx={{
                backgroundColor: '#ffffff',
                color: '#9370db',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Sign Out
            </Button>

          </Box>


          <Button type="button" onClick={getRecipeSuggestions}>Get Recipe Suggestions</Button>


          {user && (
            <Box border={'2px solid #ffffff'}>
              <Box
                width="800px"
                height="100px"
                bgcolor={'#663399'}

                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}

              >
                <Typography variant={'h2'} color={'#ffffff'} textAlign={'center'}>
                  Inventory Items
                </Typography>
              </Box>
              <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
                {filteredInventory.map(({ id, quantity }) => (
                  <Box
                    key={id}
                    width="100%"
                    minHeight="150px"
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    colour={"#9370db"}
                    bgcolor={'#ffffff'}
                    paddingX={5}
                  >

                    <Box width="40%" overflow="hidden" textOverflow="ellipsis">
                      <Typography variant={'h4'} color={'#663399'} noWrap>
                        {id.charAt(0).toUpperCase() + id.slice(1)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="flex-end" pr={2} width="60%">
                      <Button variant="contained" onClick={() => removeItem(id)}
                        sx={{
                          backgroundColor: '#9370db', // Tomato red
                          '&:hover': {
                            backgroundColor: '#663399', // Darker shade for hover
                          },
                        }}

                      >
                        -
                      </Button>
                      <Typography variant={'h4'} color={'#663399'} sx={{ margin: '0 20px', minWidth: '40px', textAlign: 'center' }}>
                        {quantity}
                      </Typography>
                      <Button variant="contained" onClick={() => addItem(id)}
                        sx={{
                          backgroundColor: '#9370db', // Tomato red
                          '&:hover': {
                            backgroundColor: '#663399', // Darker shade for hover
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
        </>
      )}



      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mb={2}
        left={0}
        right={0}
        bottom={0}
        position="absolute"

      >
        <Box display="flex" justifyContent="center" gap={2}>
          <a href="https://www.linkedin.com/in/sanjay-sivapragasam/" target="_blank" rel="noopener noreferrer">
            <IconButton aria-label="LinkedIn" sx={{ color: '#ffffff' }}>
              <LinkedInIcon fontSize="large" />
            </IconButton>
          </a>
          <a href="mailto:sanjaysivapragasam12@gmail.com" target="_blank" rel="noopener noreferrer">
            <IconButton aria-label="Email" sx={{ color: '#ffffff' }}>
              <EmailIcon fontSize="large" />
            </IconButton>
          </a>
          <a href="https://github.com/sanjaysivapragasam" target="_blank" rel="noopener noreferrer">
            <IconButton aria-label="GitHub" sx={{ color: '#ffffff' }}>
              <GitHubIcon fontSize="large" />
            </IconButton>
          </a>
        </Box>
        <Typography variant="body2" sx={{ color: '#ffffff', mt: 1 }}>
          © {new Date().getFullYear()} Sanjay Sivapragasam
        </Typography>
      </Box>


    </Box>
  )
}