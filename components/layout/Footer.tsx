'use client';

import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import { Telegram, Instagram, WhatsApp, Phone, Email } from '@mui/icons-material';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: '2fr 1fr 1.5fr 1.5fr',
            },
            gap: 4,
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              فروشگاه
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              بهترین محصولات با کیفیت ترین قیمت‌ها را از ما بخرید.
              تضمین کیفیت و ارسال سریع.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Telegram />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Instagram />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <WhatsApp />
              </IconButton>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              دسترسی سریع
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                صفحه اصلی
              </Link>
              <Link href="/products" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                محصولات
              </Link>
              <Link href="/orders" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                سفارش‌ها
              </Link>
              <Link href="/profile" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                پروفایل
              </Link>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              خدمات مشتریان
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                راهنمای خرید
              </Link>
              <Link href="#" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                قوانین و مقررات
              </Link>
              <Link href="#" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                حریم خصوصی
              </Link>
              <Link href="/returns" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                مرجوعی کالا
              </Link>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              تماس با ما
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8 }}>
                <Phone sx={{ fontSize: 16 }} />
                <Typography variant="body2">۰۲۱-۱۲۳۴۵۶۷۸</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8 }}>
                <Email sx={{ fontSize: 16 }} />
                <Typography variant="body2">info@shop.com</Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                آدرس: تهران، خیابان ولیعصر، پلاک ۱۲۳
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'grey.700' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © ۱۴۰۳ فروشگاه. تمامی حقوق محفوظ است.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            ساخته شده با ❤️ برای شما
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}