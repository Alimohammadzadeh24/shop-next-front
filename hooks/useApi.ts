import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  productsApi,
  ordersApi,
  returnsApi,
  authApi,
  usersApi,
  inventoryApi,
} from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

// Products hooks
export function useProducts(params?: {
  search?: string;
  category?: string;
  brand?: string;
  skip?: number;
  take?: number;
}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });
}

// Orders hooks
export function useOrders(params?: {
  userId?: string;
  status?: string;
  skip?: number;
  take?: number;
}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getOrders(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('سفارش شما با موفقیت ثبت شد');
    },
    onError: (error) => {
      toast.error('خطا در ثبت سفارش');
    },
  });
}

// Returns hooks
export function useReturns(params?: {
  userId?: string;
  orderId?: string;
  status?: string;
  skip?: number;
  take?: number;
}) {
  return useQuery({
    queryKey: ['returns', params],
    queryFn: () => returnsApi.getReturns(params),
  });
}

export function useReturn(id: string) {
  return useQuery({
    queryKey: ['return', id],
    queryFn: () => returnsApi.getReturn(id),
    enabled: !!id,
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: returnsApi.createReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      toast.success('درخواست مرجوعی شما ثبت شد');
    },
    onError: (error) => {
      toast.error('خطا در ثبت درخواست مرجوعی');
    },
  });
}

// Auth hooks
export function useLogin() {
  const { setUser, setTokens } = useAuthStore();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      // Mock user data for demo
      setUser({
        id: 'user-1',
        email: 'user@example.com',
        firstName: 'کاربر',
        lastName: 'نمونه',
        role: 'USER',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      });
      toast.success('با موفقیت وارد شدید');
    },
    onError: (error) => {
      toast.error('ایمیل یا رمز عبور اشتباه است');
    },
  });
}

export function useRegister() {
  const { setUser, setTokens } = useAuthStore();
  
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data, variables) => {
      setTokens(data.accessToken, data.refreshToken);
      // Mock user data for demo
      setUser({
        id: 'user-1',
        email: variables.email,
        firstName: variables.firstName,
        lastName: variables.lastName,
        role: variables.role as any || 'USER',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('حساب کاربری شما ایجاد شد');
    },
    onError: (error) => {
      toast.error('خطا در ایجاد حساب کاربری');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('رمز عبور با موفقیت تغییر کرد');
    },
    onError: (error) => {
      toast.error('خطا در تغییر رمز عبور');
    },
  });
}