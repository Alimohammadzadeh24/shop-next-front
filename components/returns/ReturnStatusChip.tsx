'use client';

import { Chip } from '@mui/material';
import { ReturnStatus } from '@/types';

interface ReturnStatusChipProps {
  status: ReturnStatus;
}

const statusConfig = {
  REQUESTED: { label: 'درخواست ثبت شد', color: 'warning' as const },
  APPROVED: { label: 'تایید شد', color: 'success' as const },
  REJECTED: { label: 'رد شد', color: 'error' as const },
  COMPLETED: { label: 'تکمیل شد', color: 'primary' as const },
};

export function ReturnStatusChip({ status }: ReturnStatusChipProps) {
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