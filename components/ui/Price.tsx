'use client';

import { Typography, TypographyProps } from '@mui/material';
import { formatPrice, toPersianDigits } from '@/lib/utils';

interface PriceProps extends Omit<TypographyProps, 'children'> {
  amount: number;
}

export function Price({ amount, ...props }: PriceProps) {
  return (
    <Typography {...props}>
      {toPersianDigits(formatPrice(amount))}
    </Typography>
  );
}