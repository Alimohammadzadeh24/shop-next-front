'use client';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import { Receipt, Visibility, AssignmentReturn } from '@mui/icons-material';
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
  const { isAuthenticated } = useAuthStore();
  
  const { data: ordersData, isLoading, error } = useOrders({
    take: 50,
  });

  // Debug logs
  console.log('Orders Page Debug:', { 
    isAuthenticated, 
    isLoading, 
    error: error?.message, 
    errorObject: error,
    ordersData,
    hasData: !!ordersData?.data,
    dataLength: ordersData?.data?.length,
    rawData: ordersData 
  });

  // Show loading if auth is still loading or orders are loading
  if (!isAuthenticated || isLoading) {
    return <AppShell><LoadingState /></AppShell>;
  }

  // Show error state if there's an API error
  if (error) {
    console.error('Orders API Error:', error);
    return (
      <AppShell>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <EmptyState
            icon={<Receipt sx={{ fontSize: 64 }} />}
            title="خطا در بارگذاری سفارشات"
            description={`خطا: ${error?.message || 'نامشخص'} - لطفاً مجدداً تلاش کنید.`}
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
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {order.status === 'DELIVERED' && (
                      <Link href={`/returns?orderId=${order.id}`} style={{ textDecoration: 'none' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AssignmentReturn />}
                          sx={{ mr: 1 }}
                        >
                          ثبت مرجوعی
                        </Button>
                      </Link>
                    )}
                    
                    <Link href={`/orders/${order.id}`} style={{ textDecoration: 'none' }}>
                      <Chip
                        label="مشاهده جزئیات"
                        icon={<Visibility />}
                        clickable
                        color="primary"
                      />
                    </Link>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </AppShell>
  );
}