// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  InputBase,
  IconButton,
  Paper,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import {
  RestaurantMenu as MenuIcon,
  Info as InfoIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import AuthPopup from "../components/auth/authPopup";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [authOpen, setAuthOpen] = React.useState(false);
  const [authView, setAuthView] = React.useState('login');

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9))',
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.8)',
          mt: -1,
          mr: -1,
          ml: -1,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            <Link to="/" style={{ color: 'red', textDecoration: 'none' }}>
              {isAuthenticated && user?.role === 'responsable' && user?.restaurant
                ? user.restaurant.name
                : 'LuxDine'}
            </Link>
          </Typography>

          {isAuthenticated && (
            <Paper
              component="form"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 350,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '6px 12px',
                borderRadius: '25px',
                border: '1px solid rgba(255, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                mt: 3,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, color: 'white' }}
                placeholder="Search dishes, menu, reservations..."
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton type="submit" sx={{ color: 'red' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to="/cart"
                  sx={{
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: '0.3s',
                    '&:hover': { color: 'red', transform: 'scale(1.1)' },
                  }}
                >
                  <CartIcon /> Cart
                </Button>
                <IconButton onClick={handleMenu} sx={{ color: 'white' }}>
                  <Avatar sx={{ bgcolor: 'red' }}>
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                  {user?.role === 'admin' && (
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate('/Responsable');
                      }}
                    >
                      Manage Restaurants
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setAuthView('login');
                    setAuthOpen(true);
                  }}
                  sx={{
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: '0.3s',
                    '&:hover': { color: 'red', transform: 'scale(1.1)' },
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setAuthView('signup');
                    setAuthOpen(true);
                  }}
                  sx={{
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: '0.3s',
                    '&:hover': { color: 'red', transform: 'scale(1.1)' },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {isAuthenticated && (
        <Box
          sx={{
            background: 'linear-gradient(270deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9))',
            boxShadow: 'inset 0px -3px 5px rgba(255, 0, 0, 0.5)',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: -1,
            ml: -1,
          }}
        >
          <Box sx={{ display: 'flex', gap: '30px' }}>
            {[
              { text: 'restaurant', icon: <MenuIcon />, link: '/restaurant' },
              { text: 'Specials', icon: <InfoIcon />, link: '/specials' },
              { text: 'about', icon: <InfoIcon />, link: '/about' },
              { text: 'contact', icon: <ContactMailIcon />, link: '/contact' },
            ].map((item, index) => (
              <Button
                key={index}
                component={Link}
                to={item.link}
                sx={{
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: '0.3s',
                  '&:hover': { color: 'red', transform: 'scale(1.1)' },
                }}
              >
                {item.icon} {item.text}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      <AuthPopup
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialView={authView}
      />
    </>
  );
};

export default Navbar;
