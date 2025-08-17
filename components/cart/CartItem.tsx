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
        <Box sx={{ display: 'flex', gap: 3 }}>
          <CardMedia
            component="img"
            sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1 }}
            image={productImage}
            alt={item.product.name}
          />
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {item.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {item.product.description}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  تعداد:
                </Typography>
                <QuantityStepper
                  value={item.quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  max={10}
                />
              </Box>
              
              <IconButton
                onClick={handleRemove}
                color="error"
                sx={{ ml: 2 }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'left', minWidth: 120 }}>
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