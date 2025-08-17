'use client';

import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
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
      {icon && (
        <Box sx={{ color: 'text.disabled', mb: 2 }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      {action && (
        <Box sx={{ mt: 2 }}>
          {action}
        </Box>
      )}
    </Box>
  );
}