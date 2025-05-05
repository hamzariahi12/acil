// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import useAuthStore from "../../store/authStore";

const LoginForm = ({ onSuccess, switchToSignup, switchToReset }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    login(email, password);
    onSuccess();
    window.location.reload();
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>

<Typography
  variant="h5"
  sx={{
    fontWeight: 'bold',
    color: '#1a1a1a',
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
  Login
</Typography>


      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
      <Button
  variant="contained"
  onClick={handleLogin}
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
  Login
</Button>

      <Button onClick={switchToSignup}>Don't have an account? Sign up</Button>
      <Button onClick={switchToReset}>Forgot password?</Button>
    </Box>
  );
};

export default LoginForm;
