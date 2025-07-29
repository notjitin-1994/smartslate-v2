import React, { useState, MouseEvent } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Button } from '@/components/common/Button';
import LoginModal from '@/components/modals/LoginModal';
import logo from '@/assets/images/Final-Dark-BG.png';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';

const Header: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const navLinks = [
    {
      label: 'Solutions',
      items: [
        { path: '/solutions/ignite-series', label: 'Ignite Series' },
        { path: '/solutions/smart-skills-architecture', label: 'Smart Skills Architecture' },
        { path: '/solutions/solara', label: 'Solara' },
      ],
    },
    { path: '/smartslate-difference', label: 'Why Smartslate' },
    { path: '/collaborate', label: 'Partner With Us' },
    ...(user?.email === 'jitin@smartslate.io' ? [{ path: '/admin', label: 'Admin Dashboard' }] : []),
  ];

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleDrawer = (open: boolean) => () => setIsMenuOpen(open);

  const renderNavLinks = (isDrawer = false) => {
    const handleSolutionsClick = () => {
      setSolutionsOpen(!solutionsOpen);
    };

    return navLinks.map((item) => {
      if ('items' in item) {
        return (
          <Box key={item.label}>
            <ListItemButton onClick={handleSolutionsClick}>
              <ListItemText primary={item.label} />
              {solutionsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={solutionsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.items.map((subItem) => (
                  <ListItem key={subItem.path} component={NavLink} to={subItem.path} onClick={toggleDrawer(false)} sx={{ pl: 4 }}>
                    <ListItemButton>
                      <ListItemText primary={subItem.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        );
      }
      return (
        <Button
          key={item.path}
          color="inherit"
          component={NavLink}
          to={item.path}
          onClick={isDrawer ? toggleDrawer(false) : undefined}
        >
          {item.label}
        </Button>
      );
    });
  };

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {renderNavLinks(true)}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Link to="/">
            <img src={logo} alt="Smartslate" style={{ height: 30, marginRight: 16 }} />
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          {isMobile ? (
            <IconButton color="inherit" edge="end" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {renderNavLinks()}
              {loading ? (
                <Box sx={{ height: 40, width: 100, bgcolor: 'grey.700', borderRadius: 1 }} />
              ) : user ? (
                <>
                  <IconButton onClick={handleMenuOpen}>
                    <Avatar src={user.photoURL || undefined}>{getInitials(user.displayName)}</Avatar>
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>My Profile</MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>Settings</MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); setIsSignOutModalOpen(true); }}>Sign Out</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button variant="contained" onClick={() => setIsLoginModalOpen(true)}>Sign In</Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={isMenuOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <Dialog open={isSignOutModalOpen} onClose={() => setIsSignOutModalOpen(false)}>
        <DialogTitle>Are you sure you want to sign out?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will be returned to the homepage and will need to log in again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSignOutModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSignOut} color="primary">Sign Out</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
