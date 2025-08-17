'use client';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Button,
} from '@mui/material';
import { ArrowBack, LocalShipping } from '@mui/icons-material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Price } from '@/components/ui/Price';
import { OrderStatusChip } from '@/components/orders/OrderStatusChip';
import { OrderItemCard } from '@/components/orders/OrderItemCard';
import { useOrder } from '@/hooks/useApi';
import { formatPersianDate } from '@/lib/utils';

export default function OrderDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const orderId = params.id as string;

  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) return <AppShell><LoadingState /></AppShell>;
  if (error || !order) return <AppShell><ErrorState /></AppShell>;

  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Button
            component={Link}
            href="/orders"
            startIcon={<ArrowBack />}
            variant="outlined"
          >
            {t('common.back')}
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            سفارش #{order.id.slice(-8)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2fr 1fr',
            },
            gap: 4,
          }}
        >
          {/* Order Summary */}
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    اطلاعات سفارش
                  </Typography>
                  <OrderStatusChip status={order.status} />
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      تاریخ ثبت:
                    </Typography>
                    <Typography variant="body1">
                      {formatPersianDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      مبلغ کل:
                    </Typography>
                    <Price amount={order.totalAmount} variant="body1" sx={{ fontWeight: 'bold' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {t('orders.items')}
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {order.items?.map((item) => (
                    <OrderItemCard key={item.id} item={item} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Shipping & Actions */}
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {t('orders.shippingAddress')}
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'grid', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>استان:</strong> {order.shippingAddress.province as string}
                  </Typography>
                  <Typography variant="body2">
                    <strong>شهر:</strong> {order.shippingAddress.city as string}
                  </Typography>
                  <Typography variant="body2">
                    <strong>آدرس:</strong> {order.shippingAddress.street as string}
                  </Typography>
                  <Typography variant="body2">
                    <strong>کدپستی:</strong> {order.shippingAddress.postalCode as string}
                  </Typography>
                  <Typography variant="body2">
                    <strong>تلفن:</strong> {order.shippingAddress.phone as string}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {order.status === 'DELIVERED' && (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    عملیات
                  </Typography>
                  <Button
                    component={Link}
                    href={`/returns?orderId=${order.id}`}
                    variant="outlined"
                    color="warning"
                    fullWidth
                  >
                    درخواست مرجوعی
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Container>
    </AppShell>
  );
}