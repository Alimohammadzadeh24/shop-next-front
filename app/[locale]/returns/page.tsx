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
import { useState, useEffect } from 'react';
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

  // Auto open dialog if orderId is provided
  useEffect(() => {
    if (prefilledOrderId) {
      setDialogOpen(true);
    }
  }, [prefilledOrderId]);

  const { data: returnsData, isLoading } = useReturns({
    take: 50,
  });

  const createReturnMutation = useCreateReturn();

  const handleCreateReturn = async () => {
    if (!prefilledOrderId || !returnReason || !returnAmount) {
      console.error('Missing required fields for return request');
      return;
    }

    const refundAmountNumber = parseFloat(returnAmount);
    if (refundAmountNumber <= 0) {
      console.error('Refund amount must be greater than 0');
      return;
    }

    try {
      await createReturnMutation.mutateAsync({
        orderId: prefilledOrderId,
        reason: returnReason.trim(),
        refundAmount: refundAmountNumber,
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
          <DialogTitle>
            درخواست مرجوعی
            {prefilledOrderId && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                سفارش #{prefilledOrderId.slice(-8)}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="دلیل مرجوعی"
              multiline
              rows={4}
              fullWidth
              required
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              sx={{ mb: 2, mt: 1 }}
              helperText="لطفاً دلیل مرجوعی کالا را شرح دهید"
              error={returnReason.trim() === '' && returnReason !== ''}
            />
            <TextField
              label="مبلغ درخواستی (تومان)"
              type="number"
              fullWidth
              required
              value={returnAmount}
              onChange={(e) => setReturnAmount(e.target.value)}
              inputProps={{ min: 0, step: 1000 }}
              helperText="مبلغ قابل بازپرداخت باید بیشتر از صفر باشد"
              error={parseFloat(returnAmount) <= 0 && returnAmount !== ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCreateReturn}
              variant="contained"
              disabled={
                !returnReason.trim() ||
                !returnAmount ||
                parseFloat(returnAmount) <= 0 ||
                createReturnMutation.isPending
              }
            >
              {createReturnMutation.isPending ? 'در حال ثبت...' : 'ثبت درخواست'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppShell>
  );
}