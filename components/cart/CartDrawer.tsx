'use client';

import {
  Drawer,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
} from '@mui/material';
import { Close, ShoppingCart } from '@mui/icons-material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Price } from '@/components/ui/Price';
import { CartItem } from './CartItem';
import { useCartStore } from '@/stores/cartStore';

export function CartDrawer() {
  const t = useTranslations();
  const { items, isOpen, closeCart, totalAmount, totalItems } = useCartStore();

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeCart}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCart />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('cart.title')} ({totalItems})
          </Typography>
        </Box>
        <IconButton onClick={closeCart}>
          <Close />
        </IconButton>
      </Box>

      <Divider />

      {items.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            {t('cart.empty')}
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <List>
              {items.map((item) => (
                <ListItem key={item.productId} sx={{ px: 2 }}>
                  <CartItem item={item} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {t('cart.totalPrice')}:
              </Typography>
              <Price amount={totalAmount} variant="h6" sx={{ fontWeight: 'bold' }} />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                href="/cart"
                variant="outlined"
                fullWidth
                onClick={closeCart}
              >
                مشاهده سبد
              </Button>
              <Button
                component={Link}
                href="/checkout"
                variant="contained"
                fullWidth
                onClick={closeCart}
              >
                {t('cart.checkout')}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Drawer>
  );
}