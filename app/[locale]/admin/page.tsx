'use client';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Dashboard, Inventory, Receipt, Assignment } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { useAuthStore } from '@/stores/authStore';

const adminCards = [
  {
    title: 'مدیریت محصولات',
    description: 'افزودن، ویرایش و حذف محصولات',
    icon: <Inventory sx={{ fontSize: 40 }} />,
    color: 'primary.main',
    count: '۱۲۳',
  },
  {
    title: 'مدیریت سفارش‌ها',
    description: 'بررسی و پردازش سفارش‌ها',
    icon: <Receipt sx={{ fontSize: 40 }} />,
    color: 'success.main',
    count: '۴۵',
  },
  {
    title: 'مدیریت مرجوعی‌ها',
    description: 'بررسی درخواست‌های مرجوعی',
    icon: <Assignment sx={{ fontSize: 40 }} />,
    color: 'warning.main',
    count: '۷',
  },
  {
    title: 'گزارش‌ها',
    description: 'آمار فروش و تحلیل‌ها',
    icon: <Dashboard sx={{ fontSize: 40 }} />,
    color: 'secondary.main',
    count: '---',
  },
];

export default function AdminPage() {
  const t = useTranslations();
  const { user } = useAuthStore();

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <AppShell>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Card>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h5" color="error" gutterBottom>
                دسترسی غیرمجاز
              </Typography>
              <Typography variant="body1" color="text.secondary">
                شما به این بخش دسترسی ندارید.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              پنل مدیریت
            </Typography>
            <Chip label="مدیر" color="primary" size="small" />
          </Box>
          <Typography variant="body1" color="text.secondary">
            خوش آمدید {user.firstName} {user.lastName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 4,
          }}
        >
          {adminCards.map((card, index) => (
            <Card
              key={index}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    color: card.color,
                    mb: 2,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
                <Chip
                  label={card.count}
                  sx={{
                    backgroundColor: card.color,
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Placeholder for future admin features */}
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              پنل مدیریت در حال توسعه
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ویژگی‌های مدیریتی به زودی اضافه خواهد شد.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </AppShell>
  );
}