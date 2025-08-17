'use client';

import { Box, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { OrderItem } from '@/types';
import { Price } from '@/components/ui/Price';
import { toPersianDigits } from '@/lib/utils';

interface OrderItemCardProps {
  item: OrderItem;
}

export function OrderItemCard({ item }: OrderItemCardProps) {
  const productImage = item.product?.images?.[0] || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200';

  return (
    <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
        image={productImage}
        alt={item.product?.name || 'محصول'}
      />
      <CardContent sx={{ flex: 1, py: 0, px: 2 }}>
        <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
          {item.product?.name || 'محصول'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            تعداد: {toPersianDigits(item.quantity)}
          </Typography>
          <Price amount={item.totalPrice} variant="body1" sx={{ fontWeight: 'bold' }} />
        </Box>
      </CardContent>
    </Card>
  );
}