import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Paper,
} from "@mui/material";
import { Edit as EditIcon, Event as EventIcon } from "@mui/icons-material";

const ClientProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [reservations] = useState([
    { date: "2025-03-20", time: "19:00", guests: 2 },
    { date: "2025-03-15", time: "20:30", guests: 4 },
    { date: "2025-03-10", time: "18:45", guests: 3 },
  ]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:4000/api/auth/me",
        {
          name: profile.name,
          email: profile.email,
          // password: optional if added later
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setProfile(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "black",
        minHeight: "100vh",
        py: 8,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      {/* Profile Card */}
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backgroundColor: "#1E1E1E",
          }}
        >
          <Typography
            variant="h4"
            color="#F4C95D"
            align="center"
            gutterBottom
            fontWeight={600}
          >
            My Profile
          </Typography>

          <Box display="flex" justifyContent="center" mb={3}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#A68E5D",
                fontSize: 32,
                fontWeight: 600,
              }}
            >
              {profile.name[0]}
            </Avatar>
          </Box>

          <Stack spacing={3} mb={3}>
            <TextField
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#A68E5D" },
                  "&.Mui-focused fieldset": { borderColor: "#A68E5D" },
                },
              }}
            />
            <TextField
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              fullWidth
              type="email"
              variant="outlined"
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#A68E5D" },
                  "&.Mui-focused fieldset": { borderColor: "#A68E5D" },
                },
              }}
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              fullWidth
              type="tel"
              variant="outlined"
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#A68E5D" },
                  "&.Mui-focused fieldset": { borderColor: "#A68E5D" },
                },
              }}
            />
          </Stack>

          <Button
            fullWidth
            startIcon={<EditIcon />}
            variant="contained"
            onClick={handleUpdate}
            sx={{
              backgroundColor: "#A68E5D",
              color: "black",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#8C7A4D" },
            }}
          >
            Update Profile
          </Button>
        </Paper>
      </Container>

      {/* Reservation History */}
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backgroundColor: "#1E1E1E",
          }}
        >
          <Typography
            variant="h5"
            color="#F4C95D"
            align="center"
            gutterBottom
            fontWeight={600}
          >
            <EventIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Reservation History
          </Typography>

          {reservations.length > 0 ? (
            <List>
              {reservations.map((res, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`Date: ${res.date} | Time: ${res.time}`}
                      secondary={`Guests: ${res.guests}`}
                      primaryTypographyProps={{ sx: { color: "white" } }}
                      secondaryTypographyProps={{ sx: { color: "#aaa" } }}
                    />
                  </ListItem>
                  {index < reservations.length - 1 && (
                    <Divider sx={{ backgroundColor: "#555" }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography color="gray" align="center">
              No reservations found.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ClientProfile;
