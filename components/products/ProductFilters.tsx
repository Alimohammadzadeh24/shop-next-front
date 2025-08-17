'use client';

import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider,
  Button,
  Slider,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { debounce } from '@/lib/utils';

const categories = [
  'laptop',
  'mobile',
  'headphone',
  'watch',
  'tablet',
  'camera',
];

const brands = [
  'Apple',
  'Samsung',
  'Sony',
  'Dell',
  'HP',
  'Asus',
];

export function ProductFilters() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);

  const updateFilters = debounce((filters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`/products?${params.toString()}`);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateFilters({ search: value, category, brand });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    updateFilters({ search, category: value, brand });
  };

  const handleBrandChange = (value: string) => {
    setBrand(value);
    updateFilters({ search, category, brand: value });
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setBrand('');
    setPriceRange([0, 10000000]);
    router.push('/products');
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            فیلترها
          </Typography>
          <Button
            startIcon={<Clear />}
            onClick={clearFilters}
            size="small"
            color="error"
          >
            پاک کردن
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ mb: 3 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Category Filter */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>{t('products.category')}</InputLabel>
          <Select
            value={category}
            label={t('products.category')}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <MenuItem value="">همه</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Brand Filter */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>{t('products.brand')}</InputLabel>
          <Select
            value={brand}
            label={t('products.brand')}
            onChange={(e) => handleBrandChange(e.target.value)}
          >
            <MenuItem value="">همه</MenuItem>
            {brands.map((brandName) => (
              <MenuItem key={brandName} value={brandName}>
                {brandName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Price Range */}
        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
          محدوده قیمت (تومان)
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={10000000}
          step={100000}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {priceRange[0].toLocaleString('fa-IR')} تومان
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {priceRange[1].toLocaleString('fa-IR')} تومان
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}