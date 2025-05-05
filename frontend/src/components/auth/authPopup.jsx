// src/components/auth/index.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  IconButton,
  DialogContent,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Login from "./Login";
import Register from "./Register";
import ResetPasswordForm from "./resetPasswordForm";

const AuthPopup = ({ open, onClose, initialView = "login" }) => {
  const [view, setView] = useState(initialView);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (open) setView(initialView);
  }, [initialView, open]);

  const handleSuccess = () => {
    onClose();
  };

  const getTitle = () => {
    switch (view) {
      case "login":
        return "Welcome Back";
      case "signup":
        return "Create Account";
      case "reset":
        return "Reset Your Password";
      default:
        return "";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: 4,
          minWidth: fullScreen ? "100%" : 800,
          maxWidth: fullScreen ? "100%" : "90%",
          boxShadow: 10,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ px: 0, py: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: fullScreen ? "column" : "row",
            height: fullScreen ? "auto" : "100%",
            width: "100%",
          }}
        >
          <Box
            sx={{
              flex: 1,
              backgroundColor: "#fff",
              px: 4,
              py: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "#1a1a1a",
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box
              sx={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#1a1a1a",
                mb: 3,
              }}
            >
              {getTitle()}
            </Box>

            {view === "login" && (
              <Login
                onSuccess={handleSuccess}
                switchToSignup={() => setView("signup")}
                switchToReset={() => setView("reset")}
              />
            )}
            {view === "signup" && (
              <Register
                onSuccess={handleSuccess}
                switchToLogin={() => setView("login")}
              />
            )}
            {view === "reset" && (
              <ResetPasswordForm switchToLogin={() => setView("login")} />
            )}
          </Box>

          {!fullScreen && (
            <Box
              sx={{
                flex: 1.5,
                backgroundImage: "url('back.avif')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: 400,
              }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPopup;
