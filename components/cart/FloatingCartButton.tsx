'use client';

import { Fab, Badge, useTheme, useMediaQuery } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useCartStore } from '@/stores/cartStore';

export function FloatingCartButton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { totalItems, openCart } = useCartStore();

  // Only show on mobile and when there are items in cart
  if (!isMobile || totalItems === 0) {
    return null;
  }

  return (
    <Fab
      color="primary"
      onClick={openCart}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <Badge badgeContent={totalItems} color="error">
        <ShoppingCart />
      </Badge>
    </Fab>
  );
}