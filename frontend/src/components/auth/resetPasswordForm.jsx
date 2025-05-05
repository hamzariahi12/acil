// src/components/auth/ResetPasswordForm.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const ResetPasswordForm = ({ switchToLogin }) => {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    alert(`Reset link sent to ${email}`);
    switchToLogin();
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
      <Button
  variant="contained"
  onClick={handleReset}
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
  Send Reset Link
</Button>

      <Button onClick={switchToLogin}>Back to Login</Button>
    </Box>
  );
};

export default ResetPasswordForm;
