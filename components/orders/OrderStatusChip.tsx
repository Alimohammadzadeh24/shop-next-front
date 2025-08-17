'use client';

import { Chip } from '@mui/material';
import { OrderStatus } from '@/types';

interface OrderStatusChipProps {
  status: OrderStatus;
}

const statusConfig = {
  PENDING: { label: 'در انتظار تایید', color: 'warning' as const },
  CONFIRMED: { label: 'تایید شده', color: 'info' as const },
  SHIPPED: { label: 'ارسال شد', color: 'primary' as const },
  DELIVERED: { label: 'تحویل شد', color: 'success' as const },
  CANCELLED: { label: 'لغو شد', color: 'error' as const },
};

export function OrderStatusChip({ status }: OrderStatusChipProps) {
  const config = statusConfig[status];
  
  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="filled"
    />
  );
}