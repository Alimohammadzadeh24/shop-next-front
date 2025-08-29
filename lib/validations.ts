import { z } from "zod";
import { Role, OrderStatus, ReturnStatus } from "@/types";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["ADMIN", "USER"] as const),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  brand: z.string(),
  images: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const inventorySchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  minThreshold: z.number(),
  lastUpdated: z.string(),
});

export const orderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number().optional(),
  product: productSchema.optional(),
});

export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ] as const),
  totalAmount: z.number(),
  shippingAddress: z.record(z.unknown()),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(orderItemSchema).optional(),
});

export const returnSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  userId: z.string(),
  reason: z.string(),
  status: z.enum(["REQUESTED", "APPROVED", "REJECTED", "COMPLETED"] as const),
  refundAmount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  order: orderSchema.optional(),
});

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const paginatedResponseSchema = <T>(itemSchema: z.ZodSchema<T>) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number(),
    skip: z.number(),
    take: z.number(),
  });

// Form validation schemas
export const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export const registerSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  role: z.enum(["ADMIN", "USER"] as const).default("USER"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
  newPassword: z.string().min(6, "رمز عبور جدید باید حداقل ۶ کاراکتر باشد"),
});

export const addressSchema = z.object({
  province: z.string().min(1, "استان الزامی است"),
  city: z.string().min(1, "شهر الزامی است"),
  street: z.string().min(1, "آدرس الزامی است"),
  postalCode: z.string().min(1, "کدپستی الزامی است"),
  phone: z.string().min(1, "تلفن الزامی است"),
});
