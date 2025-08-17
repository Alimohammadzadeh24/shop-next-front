'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
} from '@mui/material';
import { CreditCard, AccountBalance } from '@mui/icons-material';
import { Price } from '@/components/ui/Price';

interface PaymentSectionProps {
  totalAmount: number;
}

export function PaymentSection({ totalAmount }: PaymentSectionProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        روش پرداخت
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        این یک پنل نمایشی است. پرداخت واقعی انجام نمی‌شود.
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup defaultValue="online" name="payment-method">
              <FormControlLabel
                value="online"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard />
                    <Typography>پرداخت آنلاین</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="cash"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalance />
                    <Typography>پرداخت در محل</Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              مبلغ قابل پرداخت:
            </Typography>
            <Price amount={totalAmount} variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}