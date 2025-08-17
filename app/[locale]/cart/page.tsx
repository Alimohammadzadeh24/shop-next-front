'use client';

import {
  Container,
  Typography,
  Box,
  Button,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { ShoppingCart, Delete } from '@mui/icons-material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { CartItem } from '@/components/cart/CartItem';
import { Price } from '@/components/ui/Price';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCartStore } from '@/stores/cartStore';

export default function CartPage() {
  const t = useTranslations();
  const { items, totalAmount, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <AppShell>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <EmptyState
            icon={<ShoppingCart sx={{ fontSize: 64 }} />}
            title={t('cart.empty')}
            description="محصولی در سبد خرید شما وجود ندارد."
            action={
              <Button component={Link} href="/products" variant="contained" size="large">
                مشاهده محصولات
              </Button>
            }
          />
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t('cart.title')}
          </Typography>
          <Button
            startIcon={<Delete />}
            onClick={clearCart}
            color="error"
            variant="outlined"
          >
            پاک کردن سبد
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
          {/* Cart Items */}
          <Box>
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </Box>

          {/* Order Summary */}
          <Card sx={{ height: 'fit-content', position: 'sticky', top: 100 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                خلاصه سفارش
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  تعداد کالا:
                </Typography>
                <Typography variant="body2">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} عدد
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {t('cart.totalPrice')}:
                </Typography>
                <Price amount={totalAmount} variant="body1" sx={{ fontWeight: 'bold' }} />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                component={Link}
                href="/checkout"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                {t('cart.checkout')}
              </Button>
              
              <Button
                component={Link}
                href="/products"
                variant="outlined"
                size="large"
                fullWidth
                sx={{ mt: 1 }}
              >
                ادامه خرید
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </AppShell>
  );
}