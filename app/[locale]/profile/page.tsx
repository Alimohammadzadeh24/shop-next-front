'use client';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { useAuthStore } from '@/stores/authStore';
import { useChangePassword } from '@/hooks/useApi';
import { changePasswordSchema } from '@/lib/validations';

export default function ProfilePage() {
  const t = useTranslations();
  const { user } = useAuthStore();
  const changePasswordMutation = useChangePassword();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      reset();
      setShowPasswordForm(false);
    } catch (error) {
      console.error('خطا در تغییر رمز عبور:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppShell>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('profile.title')}
        </Typography>

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
          {/* Personal Information */}
          <Box>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Person sx={{ mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t('profile.personalInfo')}
                  </Typography>
                </Box>

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
                    label={t('auth.firstName')}
                    value={user.firstName}
                    fullWidth
                    disabled
                  />
                  <TextField
                    label={t('auth.lastName')}
                    value={user.lastName}
                    fullWidth
                    disabled
                  />
                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <TextField
                      label={t('auth.email')}
                      value={user.email}
                      fullWidth
                      disabled
                    />
                  </Box>
                  <TextField
                    label="نقش"
                    value={user.role === 'ADMIN' ? 'مدیر' : 'کاربر'}
                    fullWidth
                    disabled
                  />
                  <TextField
                    label="وضعیت حساب"
                    value={user.isActive ? 'فعال' : 'غیرفعال'}
                    fullWidth
                    disabled
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Security Section */}
          <Box>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Lock sx={{ mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t('profile.security')}
                  </Typography>
                </Box>

                {!showPasswordForm ? (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setShowPasswordForm(true)}
                  >
                    {t('auth.changePassword')}
                  </Button>
                ) : (
                  <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                      label={t('auth.currentPassword')}
                      type="password"
                      fullWidth
                      margin="normal"
                      {...register('currentPassword')}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword?.message}
                    />
                    <TextField
                      label={t('auth.newPassword')}
                      type="password"
                      fullWidth
                      margin="normal"
                      {...register('newPassword')}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword?.message}
                    />

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={changePasswordMutation.isPending}
                        fullWidth
                      >
                        {changePasswordMutation.isPending ? 'در حال تغییر...' : t('common.save')}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowPasswordForm(false);
                          reset();
                        }}
                        fullWidth
                      >
                        {t('common.cancel')}
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </AppShell>
  );
}