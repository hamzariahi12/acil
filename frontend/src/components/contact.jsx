import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";

const ContactUs = () => {
  return (
    <Box
      sx={{
        backgroundColor: "black",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "#1E1E1E",
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          boxShadow: 5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: 'white',
            mb: 2,
            textAlign: 'center',
            position: 'relative',
            fontFamily: '"Roboto", sans-serif',
            letterSpacing: '0.5px',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '50%',
              height: '4px',
              background: 'linear-gradient(90deg, #A68E5D, #F0C23C)', // Gradient effect
              left: '25%',
              bottom: -6,
              borderRadius: '10px',
              transform: 'scaleX(0)', // Initial hidden state for animation
              transition: 'transform 0.3s ease-in-out', // Smooth animation
            },
            '&:hover::after': {
              transform: 'scaleX(1)', // Animation on hover
            },
          }}
        >
          Contact Us
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ color: "gray", mb: 3 }}
        >
          We'd love to hear from you! Fill out the form below.
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#A68E5D" },
                "&.Mui-focused fieldset": { borderColor: "#A68E5D" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#A68E5D" },
                "&.Mui-focused fieldset": { borderColor: "#A68E5D" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Message"
            variant="outlined"
            multiline
            rows={4}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#A68E5D" },
                "&.Mui-focused fieldset": { borderColor: "#A68E5D" },
              },
            }}
          />

           <Button
            variant="contained"
            
            sx={{
              backgroundColor: "#A68E5D",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              '&:hover': {
                backgroundColor: "#8c794b",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
                transform: "translateY(-2px)",
              },
              '&:active': {
                boxShadow: "none",
                transform: "scale(0.98)",
              },
            }}
          >
            Send Message
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default ContactUs;
