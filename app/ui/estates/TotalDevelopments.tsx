import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export const TotalDevelopments = ({ total, loading }: { total: number; loading: boolean }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if it's a mobile device

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
        zIndex: 5, // Ensure it's above the map
        display: 'flex',
        alignItems: 'center', // Align items vertically
      }}
    >
      {loading ? (
        <React.Fragment>&nbsp;&nbsp;
          <CircularProgress size={ isMobile ? 18 : 24} color="primary" sx={{ marginRight: '10px' }} />
          <Typography variant="body2" sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}>Searching&nbsp;&nbsp;&nbsp;&nbsp;</Typography> {/* Custom font size for smaller text on mobile */}
        </React.Fragment>
      ) : (
        <Typography variant="body2" sx={{ fontSize: isMobile  ? '0.75rem' : '1rem' }}>Showing { total} Developments</Typography> 
      )}
    </Box>
  );
};
