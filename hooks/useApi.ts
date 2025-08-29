import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productsApi,
  ordersApi,
  returnsApi,
  authApi,
  usersApi,
  inventoryApi,
  setAccessToken,
} from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { getDefaultUserId } from "@/lib/utils";
import { toast } from "sonner";

// Products hooks
export function useProducts(params?: {
  search?: string;
  category?: string;
  brand?: string;
  skip?: number;
  take?: number;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });
}

// Orders hooks
export function useOrders(params?: {
  status?: string;
  skip?: number;
  take?: number;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.getOrders(params),
    enabled: isAuthenticated, // Only run query if user is authenticated
    retry: 2, // Limit retries to prevent excessive API calls
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("سفارش شما با موفقیت ثبت شد");
    },
    onError: (error) => {
      toast.error("خطا در ثبت سفارش");
    },
  });
}

// Returns hooks
export function useReturns(params?: {
  orderId?: string;
  status?: string;
  skip?: number;
  take?: number;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["returns", params],
    queryFn: () => returnsApi.getReturns(params),
    enabled: isAuthenticated,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function useReturn(id: string) {
  return useQuery({
    queryKey: ["return", id],
    queryFn: () => returnsApi.getReturn(id),
    enabled: !!id,
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnsApi.createReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      toast.success("درخواست مرجوعی شما ثبت شد");
    },
    onError: (error) => {
      toast.error("خطا در ثبت درخواست مرجوعی");
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
      setAccessToken(data.accessToken);

      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Check if backend provides user data
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
      } else {
        // Fallback user data if backend doesn't provide user info
        const fallbackUser = {
          id: getDefaultUserId(),
          email: "",
          firstName: "کاربر",
          lastName: "فعلی",
          role: "USER" as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(fallbackUser);
        localStorage.setItem("userData", JSON.stringify(fallbackUser));
      }
      toast.success("با موفقیت وارد شدید");
    },
    onError: (error: any) => {
      const message = error?.message || "ایمیل یا رمز عبور اشتباه است";
      toast.error(message);
    },
  });
}

export function useRegister() {
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data, variables) => {
      setTokens(data.accessToken, data.refreshToken);
      setAccessToken(data.accessToken);

      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Check if backend provides user data
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
      } else {
        // Create user data from registration info
        const newUser = {
          id: getDefaultUserId(),
          email: variables.email,
          firstName: variables.firstName,
          lastName: variables.lastName,
          role: (variables.role as any) || "USER",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem("userData", JSON.stringify(newUser));
      }
      toast.success("حساب کاربری شما ایجاد شد");
    },
    onError: (error: any) => {
      const message = error?.message || "خطا در ایجاد حساب کاربری";
      toast.error(message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("رمز عبور با موفقیت تغییر کرد");
    },
    onError: (error) => {
      toast.error("خطا در تغییر رمز عبور");
    },
  });
}
