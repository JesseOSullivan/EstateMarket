import React from 'react';
import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export const TotalDevelopments = ({ total, loading }: { total: number; loading: boolean }) => {
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
        display: 'flex',
        alignItems: 'center', // Align items vertically
      }}
    >
      {loading ? (
        <React.Fragment>
          <CircularProgress size={24} color="primary" sx={{ marginRight: '10px' }} />
          <Typography variant="body1">Searching</Typography>
        </React.Fragment>
      ) : (
        <Typography variant="body1">Showing {total} Developments</Typography>
      )}
    </Box>
  );
};
