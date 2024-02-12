
import React from 'react';
import { Box, Typography } from '@mui/material';

export const TotalDevelopments = ({ total }: { total: number }) => {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '30px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '5px 15px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
          zIndex: 1000, // Ensure it's above the map
        }}
      >
        <Typography variant="body1">
          Showing {total} Developments
        </Typography>
      </Box>
    );
  };
