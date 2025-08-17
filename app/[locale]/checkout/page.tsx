'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { AddressForm } from '@/components/checkout/AddressForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentSection } from '@/components/checkout/PaymentSection';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useCreateOrder } from '@/hooks/useApi';

const steps = ['آدرس ارسال', 'بررسی سفارش', 'پرداخت'];

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    province: '',
    city: '',
    street: '',
    postalCode: '',
    phone: '',
  });

  const { items, totalAmount, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const createOrderMutation = useCreateOrder();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/auth/login?redirect=/checkout');
    return null;
  }

  // Redirect to cart if empty
  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (!user) return;

    const orderData = {
      userId: user.id,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      shippingAddress,
      totalAmount,
    };

    try {
      await createOrderMutation.mutateAsync(orderData);
      clearCart();
      router.push('/orders');
    } catch (error) {
      console.error('خطا در ثبت سفارش:', error);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <AddressForm
            address={shippingAddress}
            onChange={setShippingAddress}
          />
        );
      case 1:
        return <OrderSummary items={items} shippingAddress={shippingAddress} />;
      case 2:
        return <PaymentSection totalAmount={totalAmount} />;
      default:
        return null;
    }
  };

  return (
    <AppShell>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('cart.checkout')}
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ minHeight: 300 }}>
              {getStepContent(activeStep)}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                {t('common.back')}
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handlePlaceOrder}
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? 'در حال ثبت...' : 'ثبت نهایی سفارش'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  {t('common.next')}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </AppShell>
  );
}