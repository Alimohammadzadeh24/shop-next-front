'use client';

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { ShoppingCart, Favorite } from '@mui/icons-material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Product } from '@/types';
import { Price } from '@/components/ui/Price';
import { useCartStore } from '@/stores/cartStore';
import { truncateText } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const productImage = product.images[0] || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height={200}
          image={productImage}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box sx={{ mb: 1 }}>
            <Chip label={product.category} size="small" color="primary" />
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', minHeight: 48 }}>
            {truncateText(product.name, 50)}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
            {truncateText(product.description, 80)}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Price amount={product.price} variant="h6" sx={{ fontWeight: 'bold' }} />
            <Typography variant="body2" color="text.secondary">
              {product.brand}
            </Typography>
          </Box>
        </CardContent>
      </Link>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={!product.isActive}
            sx={{ flex: 1 }}
          >
            {product.isActive ? t('products.addToCart') : t('products.outOfStock')}
          </Button>
          <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Favorite />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}