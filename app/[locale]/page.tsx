'use client';

import { Container, Typography, Box, Card, CardContent, CardMedia, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ProductCard } from '@/components/products/ProductCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { useProducts } from '@/hooks/useApi';

const featuredCategories = [
  { name: 'لپ‌تاپ', image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=300', href: '/products?category=laptop' },
  { name: 'موبایل', image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300', href: '/products?category=mobile' },
  { name: 'هدفون', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300', href: '/products?category=headphone' },
  { name: 'ساعت', image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=300', href: '/products?category=watch' },
];

export default function HomePage() {
  const t = useTranslations();
  const { data: productsData, isLoading } = useProducts({ take: 8 });

  return (
    <AppShell>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #14B8A6 100%)',
            borderRadius: 3,
            color: 'white',
            p: { xs: 4, md: 6 },
            mb: 6,
            textAlign: 'center',
          }}
        >
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            خرید آنلاین با بهترین قیمت
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            محصولات با کیفیت و اصل را از فروشگاه ما خریداری کنید
          </Typography>
        </Box>

        {/* Categories */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            دسته‌بندی‌ها
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {featuredCategories.map((category) => (
              <Link href={category.href} style={{ textDecoration: 'none' }} key={category.name}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height={160}
                    image={category.image}
                    alt={category.name}
                  />
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Box>
        </Box>

        {/* Featured Products */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              محصولات محبوب
            </Typography>
            <Link href="/products" style={{ textDecoration: 'none' }}>
              <Chip label="مشاهده همه" color="primary" clickable />
            </Link>
          </Box>
          
          {isLoading ? (
            <LoadingState />
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              {productsData?.data.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </AppShell>
  );
}