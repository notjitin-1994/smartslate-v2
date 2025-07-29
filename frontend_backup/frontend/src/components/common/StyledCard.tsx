import React from 'react';
import { Card, styled, Typography } from '@mui/material';
import type { CardProps } from '@mui/material/Card';

// The styled utility creates a new component. We'll call it `StyledCardComponent` internally.
const StyledCardComponent = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  borderRadius: (theme.shape.borderRadius as number) * 2,
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

/**
 * A styled Card component that consumes values from the MUI theme.
 * It accepts all props of the MUI Card component.
 * For demonstration purposes, it includes a Typography component.
 */
const StyledCard: React.FC<CardProps> = ({ children, ...props }) => {
  return (
    <StyledCardComponent {...props}>
      <Typography variant="h5">I am a Styled Card</Typography>
      {children}
    </StyledCardComponent>
  );
};

export default StyledCard;