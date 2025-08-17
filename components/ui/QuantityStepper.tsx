'use client';

import { Box, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { toPersianDigits } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onChange, min = 1, max = 10 }: QuantityStepperProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        size="small"
        onClick={handleDecrease}
        disabled={value <= min}
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            backgroundColor: 'action.hover',
          }
        }}
      >
        <Remove />
      </IconButton>
      <Typography
        variant="body1"
        sx={{
          minWidth: 40,
          textAlign: 'center',
          fontWeight: 'medium',
        }}
      >
        {toPersianDigits(value)}
      </Typography>
      <IconButton
        size="small"
        onClick={handleIncrease}
        disabled={value >= max}
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            backgroundColor: 'action.hover',
          }
        }}
      >
        <Add />
      </IconButton>
    </Box>
  );
}