import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { Box, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";

// Replace with the actual API URL if needed
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const FeaturedDishes = () => {
  const [restaurants, setRestaurants] = useState([]); // Local state to store restaurants
  const [status, setStatus] = useState('idle'); // Loading status
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch the restaurants data when the component mounts
  useEffect(() => {
    const fetchRestaurants = async () => {
      setStatus('loading'); // Set loading state
      try {
        const response = await axios.get(`${API_URL}/restaurants`); // Make the API call
        setRestaurants(response.data); // Set the fetched data
        setStatus('succeeded'); // Set status to succeeded
      } catch (err) {
        setStatus('failed'); // Set status to failed if there is an error
        setError(err.message || 'Error fetching restaurants'); // Store the error message
      }
    };

    fetchRestaurants(); // Call the function to fetch data
  }, []); // Empty dependency array means this will run only once when the component mounts

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  // Handle different states: loading, error, and empty data
  if (status === "loading") {
    return <Typography>Loading restaurants...</Typography>;
  }

  if (status === "failed") {
    return <Typography>Error: {error}</Typography>;
  }

  if (restaurants.length === 0) {
    return <Typography>No featured restaurants available.</Typography>;
  }

  return (
    <Box sx={{ width: "100%", py: 5, backgroundColor: "black", color: "white", textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" mb={4} color="whitesmoke">
        🍽️ Featured Restaurant 🍽️
      </Typography>

      {/* Cards Wrapper */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 3, px: 5, flexWrap: "wrap" }}>
        {restaurants.map((restaurant, index) => (
          <Card
            key={index}
            sx={{
              maxWidth: 300,
              minWidth: 250,
              backgroundColor: "#1a1a1a",
              border: "1px solid #A68E5D",
              borderRadius: 3,
              boxShadow: 3,
              transition: "0.3s",
              "&:hover": { boxShadow: 6 },
              textAlign: "center", // Ensure text is centered
              cursor: "pointer",
            }}
            onClick={() => handleRestaurantClick(restaurant._id)}
          >
            <CardMedia
              component="img"
              image={restaurant.image || "/assets/default.jpg"} // Default image if no restaurant image
              alt={restaurant.name}
              sx={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: "5px 5px 0 0",
              }}
            />
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="white">
                {restaurant.name}
              </Typography>
              
              <Typography variant="body2" color="#A68E5D" mb={1}>
                {restaurant.category}
              </Typography>
              <Typography variant="body2" color="gray" sx={{ height: "60px", overflow: "hidden" }}>
                {restaurant.description}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#A68E5D",
                  color: "white",
                  fontWeight: "bold",
                  mt: 2,
                  "&:hover": { backgroundColor: "#8c7845" },
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedDishes;
