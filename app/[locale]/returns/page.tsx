'use client';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Assignment, Add } from '@mui/icons-material';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Price } from '@/components/ui/Price';
import { ReturnStatusChip } from '@/components/returns/ReturnStatusChip';
import { useReturns, useCreateReturn } from '@/hooks/useApi';
import { useAuthStore } from '@/stores/authStore';
import { formatPersianDate } from '@/lib/utils';

export default function ReturnsPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnAmount, setReturnAmount] = useState('');

  const prefilledOrderId = searchParams.get('orderId');

  const { data: returnsData, isLoading } = useReturns({
    userId: user?.id,
    take: 50,
  });

  const createReturnMutation = useCreateReturn();

  const handleCreateReturn = async () => {
    if (!user || !prefilledOrderId) return;

    try {
      await createReturnMutation.mutateAsync({
        orderId: prefilledOrderId,
        userId: user.id,
        reason: returnReason,
        refundAmount: parseFloat(returnAmount),
      });
      setDialogOpen(false);
      setReturnReason('');
      setReturnAmount('');
    } catch (error) {
      console.error('خطا در ثبت درخواست مرجوعی:', error);
    }
  };

  if (isLoading) {
    return <AppShell><LoadingState /></AppShell>;
  }

  if (!returnsData?.data.length) {
    return (
      <AppShell>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {t('returns.title')}
            </Typography>
            {prefilledOrderId && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setDialogOpen(true)}
              >
                درخواست مرجوعی
              </Button>
            )}
          </Box>
          
          <EmptyState
            icon={<Assignment sx={{ fontSize: 64 }} />}
            title="درخواست مرجوعی‌ای یافت نشد"
            description="شما هنوز درخواست مرجوعی‌ای ثبت نکرده‌اید."
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
            {t('returns.title')}
          </Typography>
          {prefilledOrderId && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
            >
              درخواست مرجوعی
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'grid', gap: 3 }}>
          {returnsData.data.map((returnItem) => (
            <Card key={returnItem.id}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      درخواست مرجوعی #{returnItem.id.slice(-8)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      سفارش: #{returnItem.orderId.slice(-8)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatPersianDate(returnItem.createdAt)}
                    </Typography>
                  </Box>
                  <ReturnStatusChip status={returnItem.status} />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  دلیل مرجوعی:
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {returnItem.reason}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      مبلغ بازپرداخت:
                    </Typography>
                    <Price amount={returnItem.refundAmount} variant="h6" sx={{ fontWeight: 'bold' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Create Return Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>درخواست مرجوعی</DialogTitle>
          <DialogContent>
            <TextField
              label="دلیل مرجوعی"
              multiline
              rows={4}
              fullWidth
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              label="مبلغ درخواستی (تومان)"
              type="number"
              fullWidth
              value={returnAmount}
              onChange={(e) => setReturnAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCreateReturn}
              variant="contained"
              disabled={!returnReason || !returnAmount || createReturnMutation.isPending}
            >
              {createReturnMutation.isPending ? 'در حال ثبت...' : 'ثبت درخواست'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppShell>
  );
}