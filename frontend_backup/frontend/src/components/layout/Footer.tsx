import React from 'react';
import { Box, Container, Typography, IconButton, Link } from '@mui/material';
import { Instagram, LinkedIn, MailOutline } from '@mui/icons-material';
import logo from '@/assets/images/Final-Dark-BG.png';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Link href="#landing" sx={{ mb: 2, display: 'inline-block' }}>
          <img
            src={logo}
            alt="smartslate.io logo"
            style={{ height: 24 }}
            loading="lazy"
            decoding="async"
          />
        </Link>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          &copy; {new Date().getFullYear()} smartslate.io. All Rights Reserved.
          <br />
          Revolutionizing the way the world learns.
        </Typography>
        <Box>
          <IconButton
            href="https://www.instagram.com/smartslate.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            color="inherit"
          >
            <Instagram />
          </IconButton>
          <IconButton
            href="https://www.linkedin.com/company/smartslate-io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            color="inherit"
          >
            <LinkedIn />
          </IconButton>
          <IconButton
            href="mailto:jitin@smartslate.io"
            aria-label="Email us"
            color="inherit"
          >
            <MailOutline />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};