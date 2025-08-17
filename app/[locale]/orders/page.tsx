'use client';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Receipt, Visibility } from '@mui/icons-material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Price } from '@/components/ui/Price';
import { OrderStatusChip } from '@/components/orders/OrderStatusChip';
import { useOrders } from '@/hooks/useApi';
import { useAuthStore } from '@/stores/authStore';
import { formatPersianDate } from '@/lib/utils';

export default function OrdersPage() {
  const t = useTranslations();
  const { user } = useAuthStore();
  
  const { data: ordersData, isLoading } = useOrders({
    userId: user?.id,
    take: 50,
  });

  if (isLoading) {
    return <AppShell><LoadingState /></AppShell>;
  }

  if (!ordersData?.data.length) {
    return (
      <AppShell>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <EmptyState
            icon={<Receipt sx={{ fontSize: 64 }} />}
            title="سفارشی یافت نشد"
            description="شما هنوز سفارشی ثبت نکرده‌اید."
            action={
              <Link href="/products" style={{ textDecoration: 'none' }}>
                <Typography variant="button" color="primary">
                  مشاهده محصولات
                </Typography>
              </Link>
            }
          />
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('orders.title')}
        </Typography>

        <Box sx={{ display: 'grid', gap: 3 }}>
          {ordersData.data.map((order) => (
            <Card key={order.id}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      سفارش #{order.id.slice(-8)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatPersianDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <OrderStatusChip status={order.status} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      مبلغ کل:
                    </Typography>
                    <Price amount={order.totalAmount} variant="h6" sx={{ fontWeight: 'bold' }} />
                  </Box>
                  
                  <Link href={`/orders/${order.id}`} style={{ textDecoration: 'none' }}>
                    <Chip
                      label="مشاهده جزئیات"
                      icon={<Visibility />}
                      clickable
                      color="primary"
                    />
                  </Link>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </AppShell>
  );
}