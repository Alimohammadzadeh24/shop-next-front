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
import { Login as LoginIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { useLogin } from '@/hooks/useApi';
import { loginSchema } from '@/lib/validations';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await loginMutation.mutateAsync(data);
      router.push(redirectUrl);
    } catch (error) {
      console.error('خطا در ورود:', error);
    }
  };

  return (
    <AppShell>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('auth.login')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                وارد حساب کاربری خود شوید
              </Typography>
            </Box>

            {loginMutation.isError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                ایمیل یا رمز عبور اشتباه است
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
                disabled={loginMutation.isPending}
                sx={{ mt: 3, mb: 2 }}
              >
                {loginMutation.isPending ? 'در حال ورود...' : t('auth.login')}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  حساب کاربری ندارید؟{' '}
                  <Link href="/auth/register" style={{ color: 'inherit', textDecoration: 'underline' }}>
                    {t('auth.register')}
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