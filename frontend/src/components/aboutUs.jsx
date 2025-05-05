import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Avatar } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const AboutUs = () => {
  return (
    <Box sx={{ backgroundColor: "black", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: 4 }}>
      <Container maxWidth="md" sx={{ backgroundColor: "#1E1E1E", padding: 4, borderRadius: 2, boxShadow: 3, width: "80%" }}>
        <Typography variant="h4" color="white" align="center" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" color="gray" align="center" gutterBottom>
          We are a trusted online restaurant reservation platform, connecting food lovers with the best dining experiences.
        </Typography>
      </Container>
      
      <Container maxWidth="md" sx={{ backgroundColor: "#1E1E1E", padding: 4, borderRadius: 2, boxShadow: 3, width: "80%", mt: 4 }}>
        <Typography variant="h5" color="white" align="center" gutterBottom>
          What We Offer
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#333" }}>
              <CardContent>
                <Typography variant="h6" color="white" align="center">Easy Booking</Typography>
                <Typography variant="body2" color="gray" align="center">Reserve your favourite restaurants in just a few clicks.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#333" }}>
              <CardContent>
                <Typography variant="h6" color="white" align="center">Top Restaurants</Typography>
                <Typography variant="body2" color="gray" align="center">We partner with the best restaurants to offer you premium dining.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#333" }}>
              <CardContent>
                <Typography variant="h6" color="white" align="center">Customer Support</Typography>
                <Typography variant="body2" color="gray" align="center">We are here 24/7 to assist you with your reservations.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      <Container maxWidth="md" sx={{ backgroundColor: "#1E1E1E", padding: 4, borderRadius: 2, boxShadow: 3, width: "80%", mt: 4 }}>
        <Typography variant="h5" color="white" align="center" gutterBottom>
          Trusted by Customers
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map((index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ backgroundColor: "#333", padding: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#A68E5D", width: 56, height: 56 }}>U</Avatar>
                <Typography variant="body2" color="gray" align="center" mt={1}>
                  "Amazing service! Easy to book and great selection of restaurants."
                </Typography>
                <Box display="flex" mt={1}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: "#FFD700" }} />
                  ))}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;