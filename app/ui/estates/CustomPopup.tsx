import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

type PopupProps = {
  imageSrc: string;
  logoSrc?: string;
  title: string;
  price: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
};

const CustomPopup: React.FC<PopupProps> = ({
  imageSrc,
  logoSrc,
  title,
  price,
  address,
  bedrooms,
  bathrooms,
  parking,
}) => (
    <Grid container >
      {/* Image Section */}
      <Grid item xs={6}>
        <img src={imageSrc} alt="Property" style={{ width: '100%', height: 'auto' }} />
      </Grid>
      {/* Details Section */}
      <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
        <CardContent>
          {logoSrc && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              {<img src={logoSrc} alt="Agency Logo" style={{ width: 80, height: 'auto' }} />}
            </div>
          )}
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${bedrooms} bedrooms • ${bathrooms} bathrooms • ${parking} parking spaces`}
          </Typography>
        </CardContent>
      </Grid>
    </Grid>
);

export default CustomPopup;
