import './index.css'
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './components/Navbar.jsx';
import FeaturedDishes from './components/FeaturedDishes.jsx';
import LandingPage from './components/langingPage.jsx';
import ContactUs from './components/contact.jsx';
import ClientProfile from './components/profile.jsx';
import AboutUs from './components/aboutUs.jsx';
import ReservationCard from './components/card.jsx';
import Responsable from './components/responsable.jsx';
// import RestaurantManagement from './components/RestaurantManagement.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import { getCurrentUser, initializeAuth } from './store/slices/authSlice';
// import Home from './components/Home';  // Add Home component here
import RestaurantDetails from './components/RestaurantDetails.jsx';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('App component mounted, initializing auth...');
    
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
    
    // Check for current user if there's a token
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found in localStorage, fetching current user...');
      dispatch(getCurrentUser())
        .unwrap()
        .then((data) => {
          console.log('Current user fetched successfully:', data.user.email);
        })
        .catch((error) => {
          console.error('Error getting current user:', error);
          // If token is invalid, clear auth state
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        });
    } else {
      console.log('No token found in localStorage');
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/restaurant" element={<FeaturedDishes />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ClientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <ReservationCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/responsable"
          element={
            <ProtectedRoute requiredRole="admin">
              <Responsable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Responsable"
          element={
            <ProtectedRoute requiredRole="responsable">
              <Responsable />
            </ProtectedRoute>
          }
        />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
