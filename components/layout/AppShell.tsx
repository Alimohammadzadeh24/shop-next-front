'use client';

import { Box } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { FloatingCartButton } from '../cart/FloatingCartButton';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        direction: 'rtl',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: 2,
          pb: 4,
        }}
      >
        {children}
      </Box>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </Box>
  );
}