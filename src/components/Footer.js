import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => (
  <Box
    sx={{
      mt: 6,
      py: 2,
      textAlign: "center",
      background: "transparent",
      borderTop: "1px solid #e0e0e0",
      color: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#fff' : '#222',
    }}
  >
    <Typography variant="body2" color="text.secondary">
      &copy; {new Date().getFullYear()} Task Manager App &mdash; <Link href="/about" underline="hover">About</Link>
    </Typography>
  </Box>
);

export default Footer; 