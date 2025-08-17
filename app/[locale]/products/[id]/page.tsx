'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Card,
  CardMedia,
} from '@mui/material';
import { ShoppingCart, Favorite, Share } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { Price } from '@/components/ui/Price';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useProduct } from '@/hooks/useApi';
import { useCartStore } from '@/stores/cartStore';

export default function ProductPage() {
  const t = useTranslations();
  const params = useParams();
  const productId = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, error } = useProduct(productId);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  if (isLoading) return <AppShell><LoadingState /></AppShell>;
  if (error || !product) return <AppShell><ErrorState /></AppShell>;

  const productImages = product.images.length > 0 ? product.images : [
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600'
  ];

  return (
    <AppShell>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr',
            },
            gap: 6,
          }}
        >
          {/* Product Images */}
          <Box>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Card sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  height={400}
                  image={productImages[selectedImageIndex]}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
              
              {productImages.length > 1 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 1,
                  }}
                >
                  {productImages.map((image, index) => (
                    <Card
                      key={index}
                      sx={{
                        cursor: 'pointer',
                        border: selectedImageIndex === index ? 2 : 0,
                        borderColor: 'primary.main',
                      }}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <CardMedia
                        component="img"
                        height={80}
                        image={image}
                        alt={`${product.name} ${index + 1}`}
                      />
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Product Details */}
          <Box>
            <Box sx={{ mb: 2 }}>
              <Chip label={product.category} color="primary" size="small" sx={{ mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                برند: {product.brand}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Price amount={product.price} variant="h5" sx={{ fontWeight: 'bold' }} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('products.description')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {product.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Add to Cart Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  تعداد:
                </Typography>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={10}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  sx={{ flex: 1 }}
                >
                  {t('products.addToCart')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  <Favorite />
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  <Share />
                </Button>
              </Box>

              <Box sx={{ display: 'flex', align: 'center', gap: 1 }}>
                <Chip
                  label={product.isActive ? t('products.inStock') : t('products.outOfStock')}
                  color={product.isActive ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Product Specifications */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('products.specifications')}
              </Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">دسته‌بندی:</Typography>
                  <Typography variant="body2">{product.category}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">برند:</Typography>
                  <Typography variant="body2">{product.brand}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">وضعیت:</Typography>
                  <Typography variant="body2">
                    {product.isActive ? 'موجود' : 'ناموجود'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </AppShell>
  );
}