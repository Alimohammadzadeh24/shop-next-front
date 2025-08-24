'use client';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { CartItem as CartItemType } from '@/types';
import { Price } from '@/components/ui/Price';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCartStore } from '@/stores/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.productId);
  };

  const productImage = item.product.images[0] || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200';

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 } }}>
          <CardMedia
            component="img"
            sx={{ width: { xs: '100%', sm: 120 }, height: { xs: 160, sm: 120 }, objectFit: 'cover', borderRadius: 1 }}
            image={productImage}
            alt={item.product.name}
          />

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 0 }}>
                {item.product.name}
              </Typography>
              <IconButton onClick={handleRemove} color="error" size="small" sx={{ ml: 1 }}>
                <Delete />
              </IconButton>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: { xs: 2, sm: 3 }, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {item.product.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  تعداد:
                </Typography>
                <QuantityStepper value={item.quantity} onChange={handleQuantityChange} min={1} max={10} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ textAlign: { xs: 'inherit', sm: 'left' }, minWidth: { xs: 'auto', sm: 140 }, mt: { xs: 1, sm: 0 } }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              قیمت واحد:
            </Typography>
            <Price amount={item.unitPrice} variant="body1" />

            <Divider sx={{ my: 1 }} />

            <Typography variant="body2" color="text.secondary" gutterBottom>
              جمع کل:
            </Typography>
            <Price amount={item.unitPrice * item.quantity} variant="h6" sx={{ fontWeight: 'bold' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}