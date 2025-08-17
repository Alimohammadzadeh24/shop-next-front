'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Badge,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Person,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { debounce } from '@/lib/utils';

export function Header() {
  const t = useTranslations();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  const { totalItems, openCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleSearch = debounce((value: string) => {
    if (value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value)}`);
    }
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    handleSearch(value);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    router.push('/');
  };

  const navigationItems = [
    { label: t('navigation.home'), href: '/' },
    { label: t('navigation.products'), href: '/products' },
    { label: t('navigation.orders'), href: '/orders' },
    { label: t('navigation.returns'), href: '/returns' },
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'text.primary' }}>
      <Toolbar>
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleMobileMenuOpen}
            sx={{ ml: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            فروشگاه
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mx: 4 }}>
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <Button color="inherit">
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
        )}

        {/* Search */}
        {!isMobile && (
          <TextField
            size="small"
            placeholder={t('common.search')}
            value={searchValue}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300, mx: 2 }}
          />
        )}

        {/* Cart */}
        <IconButton color="inherit" onClick={openCart}>
          <Badge badgeContent={totalItems} color="primary">
            <ShoppingCart />
          </Badge>
        </IconButton>

        {/* User menu */}
        {isAuthenticated ? (
          <>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <Person />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem component={Link} href="/profile" onClick={handleProfileMenuClose}>
                {t('navigation.profile')}
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                {t('navigation.logout')}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={Link} href="/auth/login" variant="outlined" size="small">
              {t('navigation.login')}
            </Button>
            <Button component={Link} href="/auth/register" variant="contained" size="small">
              {t('navigation.register')}
            </Button>
          </Box>
        )}

        {/* Mobile menu */}
        <Menu
          anchorEl={mobileMenuAnchorEl}
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleMobileMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {navigationItems.map((item) => (
            <MenuItem
              key={item.href}
              component={Link}
              href={item.href}
              onClick={handleMobileMenuClose}
            >
              {item.label}
            </MenuItem>
          ))}
          {isMobile && (
            <MenuItem>
              <TextField
                size="small"
                placeholder={t('common.search')}
                value={searchValue}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}