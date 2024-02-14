// EstateCard.tsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Skeleton } from '@mui/material';
import { SearchResult } from '../../lib/definitions';

interface EstateCardProps {
    estate: SearchResult; // Assuming SearchResult interface is imported
    loading: boolean; // Loading state
  }
    
  const EstateCard: React.FC<EstateCardProps> = ({ estate, loading }) => {
    return (
    <Card style={{ height: '100%' }}> {/* Set a fixed height for the Card */}
        {loading ? ( // Show skeleton if loading
        <Skeleton animation="wave" variant="rectangular" height={200}  />
        ) : (
          <CardMedia
            component="img"
            image='https://via.placeholder.com/150'
            alt={String(estate.citycouncil)}
          />
        )}
        <CardContent>
          {loading ? ( // Show skeleton if loading
            <>
              <Skeleton animation="wave" height="100%"  />
              <Skeleton animation="wave" height="100%" width="100%" />
            </>
          ) : (
            <>
              <Typography gutterBottom variant="h5" component="div">
                {estate.estatename}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    );
  };
  
  export default EstateCard;
  