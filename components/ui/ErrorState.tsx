'use client';

import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon, Refresh } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const t = useTranslations();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
        gap: 2,
      }}
    >
      <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {title || t('common.error')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
        {description || 'مشکلی پیش آمده است. لطفاً مجدداً تلاش کنید.'}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          تلاش مجدد
        </Button>
      )}
    </Box>
  );
}