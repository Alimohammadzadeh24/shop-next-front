'use client';

import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { useProducts } from '@/hooks/useApi';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  };

  const { data: productsData, isLoading } = useProducts(filters);

  const totalPages = Math.ceil((productsData?.total || 0) / ITEMS_PER_PAGE);

  return (
    <AppShell>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('products.title')}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '300px 1fr',
            },
            gap: 4,
          }}
        >
          {/* Filters Sidebar */}
          <Box>
            <ProductFilters />
          </Box>

          {/* Products Grid */}
          <Box>
            {isLoading ? (
              <LoadingState />
            ) : productsData?.data.length === 0 ? (
              <EmptyState
                title="موردی یافت نشد"
                description="محصولی با این مشخصات پیدا نشد. فیلترها را تغییر دهید."
              />
            ) : (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {productsData?.total} محصول یافت شد
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                  }}
                >
                  {productsData?.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Box>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, newPage) => setPage(newPage)}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </AppShell>
  );
}