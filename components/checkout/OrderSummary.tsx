'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { CartItem } from '@/types';
import { Price } from '@/components/ui/Price';
import { toPersianDigits } from '@/lib/utils';

interface OrderSummaryProps {
  items: CartItem[];
  shippingAddress: Record<string, string>;
}

export function OrderSummary({ items, shippingAddress }: OrderSummaryProps) {
  const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '2fr 1fr',
        },
        gap: 4,
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            اقلام سفارش
          </Typography>
          <List>
            {items.map((item) => (
              <ListItem key={item.productId} divider>
                <ListItemText
                  primary={item.product.name}
                  secondary={`تعداد: ${toPersianDigits(item.quantity)}`}
                />
                <Price amount={item.unitPrice * item.quantity} variant="body1" sx={{ fontWeight: 'medium' }} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            آدرس ارسال
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>استان:</strong> {shippingAddress.province}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>شهر:</strong> {shippingAddress.city}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>آدرس:</strong> {shippingAddress.street}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>کدپستی:</strong> {shippingAddress.postalCode}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>تلفن:</strong> {shippingAddress.phone}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            خلاصه سفارش
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">تعداد کالا:</Typography>
            <Typography variant="body2">{toPersianDigits(totalItems)} عدد</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>مجموع:</Typography>
            <Price amount={totalAmount} variant="body1" sx={{ fontWeight: 'bold' }} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}