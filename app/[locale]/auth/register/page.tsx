'use client';

import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { useRegister } from '@/hooks/useApi';
import { registerSchema } from '@/lib/validations';

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await registerMutation.mutateAsync(data);
      router.push('/');
    } catch (error) {
      console.error('خطا در ثبت‌نام:', error);
    }
  };

  return (
    <AppShell>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('auth.register')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                حساب کاربری جدید ایجاد کنید
              </Typography>
            </Box>

            {registerMutation.isError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                خطا در ایجاد حساب کاربری. لطفاً مجدداً تلاش کنید.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label={t('auth.firstName')}
                fullWidth
                margin="normal"
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
              <TextField
                label={t('auth.lastName')}
                fullWidth
                margin="normal"
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
              <TextField
                label={t('auth.email')}
                type="email"
                fullWidth
                margin="normal"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label={t('auth.password')}
                type="password"
                fullWidth
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={registerMutation.isPending}
                sx={{ mt: 3, mb: 2 }}
              >
                {registerMutation.isPending ? 'در حال ایجاد حساب...' : t('auth.register')}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  حساب کاربری دارید؟{' '}
                  <Link href="/auth/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
                    {t('auth.login')}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </AppShell>
  );
}