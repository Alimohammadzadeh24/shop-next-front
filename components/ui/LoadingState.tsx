'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  const t = useTranslations();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="body1" color="text.secondary">
        {message || t('common.loading')}
      </Typography>
    </Box>
  );
}