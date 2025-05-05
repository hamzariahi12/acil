import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';

const Login = ({ onSuccess, switchToSignup, switchToReset }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Check if user is already authenticated on component mount
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated) {
      onSuccess?.();
      navigate('/');
    }
  }, [isAuthenticated, navigate, onSuccess]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(clearError());
      return;
    }
    try {
      await dispatch(login(formData)).unwrap();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // If user is already authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Sign In'
        )}
      </Button>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Don't have an account?{' '}
          <Button
            color="primary"
            onClick={switchToSignup}
            sx={{ textTransform: 'none' }}
          >
            Sign up
          </Button>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Forgot your password?{' '}
          <Button
            color="primary"
            onClick={switchToReset}
            sx={{ textTransform: 'none' }}
          >
            Reset it
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login; 