import React from 'react';
import { Box, Typography } from '@mui/material';
import { Check } from '@mui/icons-material';

const Logo = ({ size = 'medium', showText = true }) => {
  const dimensions = {
    small: { box: 32, icon: 20, fontSize: 16 },
    medium: { box: 40, icon: 24, fontSize: 20 },
    large: { box: 48, icon: 32, fontSize: 24 }
  };

  const { box, icon, fontSize } = dimensions[size];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: box,
          height: box,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #6C5CE7 0%, #a393ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(108, 92, 231, 0.2)',
        }}
      >
        <Check sx={{ color: '#fff', fontSize: icon }} />
      </Box>
      {showText && (
        <Typography
          variant={size === 'small' ? 'h6' : size === 'medium' ? 'h5' : 'h4'}
          fontWeight={800}
          color="#6C5CE7"
          sx={{ letterSpacing: 1, fontSize }}
        >
          TaskFlow
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 