'use client';

import { Box, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { addressSchema } from '@/lib/validations';

interface AddressFormProps {
  address: {
    province: string;
    city: string;
    street: string;
    postalCode: string;
    phone: string;
  };
  onChange: (address: any) => void;
}

export function AddressForm({ address, onChange }: AddressFormProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: address,
  });

  const watchedValues = watch();

  useEffect(() => {
    onChange(watchedValues);
  }, [watchedValues, onChange]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
        },
        gap: 3,
      }}
    >
      <TextField
        label="استان"
        fullWidth
        {...register('province')}
        error={!!errors.province}
        helperText={errors.province?.message}
      />
      <TextField
        label="شهر"
        fullWidth
        {...register('city')}
        error={!!errors.city}
        helperText={errors.city?.message}
      />
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
        <TextField
          label="آدرس کامل"
          multiline
          rows={3}
          fullWidth
          {...register('street')}
          error={!!errors.street}
          helperText={errors.street?.message}
        />
      </Box>
      <TextField
        label="کدپستی"
        fullWidth
        {...register('postalCode')}
        error={!!errors.postalCode}
        helperText={errors.postalCode?.message}
      />
      <TextField
        label="شماره تماس"
        fullWidth
        {...register('phone')}
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />
    </Box>
  );
}