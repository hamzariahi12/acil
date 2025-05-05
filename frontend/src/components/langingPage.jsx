import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthPopup from "../components/auth/authPopup";

const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
  }, []);

  const handleAction = (path = "/booking", requireAuth = true) => {
    if (isAuthenticated || !requireAuth) {
      navigate(path);
    } else {
      setAuthPopupOpen(true);
      setIsSignup(true);
    }
  };

  return (
    <Box sx={{ backgroundColor: "black", color: "white", minHeight: "100vh" , }}>
      {/* Hero Section avec background image */}
      <Box
        sx={{
          height: "95vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 3,
          overflow: "hidden",
          backgroundImage: "url('back.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay sombre */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          }}
        />

        {/* Contenu Hero */}
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h1"
            fontWeight="bold"
            color="whitesmoke"
            mb={2}
            sx={{ fontFamily: "serif", letterSpacing: 2 }}
          >
            Welcome to LuxDine
          </Typography>
          <Typography
            variant="h5"
            color="#A68E5D"
            maxWidth={700}
            mb={4}
            sx={{ fontStyle: "italic", fontSize: "1.4rem" }}
          >
            Where Elegance Meets Exquisite Taste –<br /> A Luxury Dining Experience Tailored for You.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#A68E5D",
              fontWeight: "bold",
              fontSize: "1.2rem",
              px: 4,
              py: 1.5,
              borderRadius: "50px",
              textTransform: "uppercase",
              "&:hover": { backgroundColor: "#8c7845" },
            }}
            onClick={() => handleAction()}
          >
            Book Your Experience
          </Button>
        </Box>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ textAlign: "center", py: 5, px: 3, backgroundColor: "black" }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="#A68E5D"
          mb={3}
          sx={{ fontFamily: "serif", textTransform: "uppercase", letterSpacing: 1 }}
        >
          Why Dine With Us? 🍷✨
        </Typography>
        <Typography
          variant="h6"
          color="gray"
          maxWidth={800}
          mx="auto"
          mb={3}
          sx={{ lineHeight: 1.8 }}
        >
          At LuxDine, we offer more than just food – we deliver an unforgettable experience.
          <br />
          From world-class chefs to a breathtaking ambiance, every moment spent here is designed to be exceptional.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#A68E5D",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: "50px",
            textTransform: "uppercase",
            "&:hover": { backgroundColor: "#8c7845" },
          }}
          onClick={() => handleAction("/menu")}
        >
          Discover Our Menu
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center", py: 3, borderTop: "2px solid #A68E5D", backgroundColor: "black" }}>
        <Typography variant="body2" color="#A68E5D">
          &copy; 2025 LuxDine.<br /> All rights reserved.
        </Typography>
      </Box>

      {/* Authentication Popup */}
      <AuthPopup
        open={authPopupOpen}
        onClose={() => setAuthPopupOpen(false)}
        isSignup={isSignup}
      />
    </Box>
  );
};

export default LandingPage;