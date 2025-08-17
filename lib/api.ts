import { z } from 'zod';
import {
  User,
  Product,
  Order,
  Return,
  Inventory,
  AuthTokens,
  PaginatedResponse,
} from '@/types';
import {
  userSchema,
  productSchema,
  orderSchema,
  returnSchema,
  inventorySchema,
  authTokensSchema,
  paginatedResponseSchema,
} from '@/lib/validations';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Ignore JSON parse error
      }
      throw new ApiError(response.status, errorMessage);
    }

    const data = await response.json();
    
    if (schema) {
      return schema.parse(data);
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'خطا در ارتباط با سرور');
  }
}

// Mock data generators for development
const generateMockProducts = (): Product[] => {
  const categories = ['laptop', 'mobile', 'headphone', 'watch', 'tablet', 'camera'];
  const brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Asus'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `محصول شماره ${i + 1}`,
    description: 'توضیحات کامل محصول که شامل ویژگی‌ها و مشخصات فنی می‌باشد.',
    price: Math.floor(Math.random() * 10000000) + 100000,
    category: categories[Math.floor(Math.random() * categories.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    isActive: Math.random() > 0.1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const mockProducts = generateMockProducts();

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) => {
    // Mock authentication
    return Promise.resolve({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    } as AuthTokens);
  },

  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => {
    // Mock registration
    return Promise.resolve({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    } as AuthTokens);
  },

  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    // Mock password change
    return Promise.resolve({ message: 'رمز عبور با موفقیت تغییر کرد' });
  },
};

// Products API
export const productsApi = {
  getProducts: (params?: {
    search?: string;
    category?: string;
    brand?: string;
    skip?: number;
    take?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const { search = '', category = '', brand = '', skip = 0, take = 10 } = params || {};
    
    let filteredProducts = mockProducts.filter(product => {
      const matchesSearch = !search || product.name.includes(search) || product.description.includes(search);
      const matchesCategory = !category || product.category === category;
      const matchesBrand = !brand || product.brand === brand;
      
      return matchesSearch && matchesCategory && matchesBrand;
    });
    
    const paginatedProducts = filteredProducts.slice(skip, skip + take);
    
    return Promise.resolve({
      data: paginatedProducts,
      total: filteredProducts.length,
      skip,
      take,
    });
  },

  getProduct: (id: string): Promise<Product> => {
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new ApiError(404, 'محصول یافت نشد');
    }
    return Promise.resolve(product);
  },

  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return Promise.resolve(newProduct);
  },

  updateProduct: (id: string, productData: Partial<Product>): Promise<Product> => {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new ApiError(404, 'محصول یافت نشد');
    }
    
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    
    return Promise.resolve(mockProducts[productIndex]);
  },

  deleteProduct: (id: string): Promise<{ message: string }> => {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new ApiError(404, 'محصول یافت نشد');
    }
    
    mockProducts.splice(productIndex, 1);
    return Promise.resolve({ message: 'محصول حذف شد' });
  },
};

// Orders API
export const ordersApi = {
  getOrders: (params?: {
    userId?: string;
    status?: string;
    skip?: number;
    take?: number;
  }): Promise<PaginatedResponse<Order>> => {
    // Mock orders data
    const mockOrders: Order[] = [
      {
        id: 'order-1',
        userId: 'user-1',
        status: 'DELIVERED',
        totalAmount: 2500000,
        shippingAddress: {
          province: 'تهران',
          city: 'تهران',
          street: 'خیابان ولیعصر، پلاک ۱۲۳',
          postalCode: '۱۲۳۴۵۶۷۸۹۰',
          phone: '۰۹۱۲۳۴۵۶۷۸۹',
        },
        createdAt: '2023-12-01T10:00:00Z',
        updatedAt: '2023-12-01T10:00:00Z',
        items: [
          {
            id: 'item-1',
            orderId: 'order-1',
            productId: 'product-1',
            quantity: 1,
            unitPrice: 2500000,
            totalPrice: 2500000,
            product: mockProducts[0],
          },
        ],
      },
    ];
    
    return Promise.resolve({
      data: mockOrders,
      total: mockOrders.length,
      skip: params?.skip || 0,
      take: params?.take || 10,
    });
  },

  getOrder: (id: string): Promise<Order> => {
    const mockOrder: Order = {
      id,
      userId: 'user-1',
      status: 'DELIVERED',
      totalAmount: 2500000,
      shippingAddress: {
        province: 'تهران',
        city: 'تهران',
        street: 'خیابان ولیعصر، پلاک ۱۲۳',
        postalCode: '۱۲۳۴۵۶۷۸۹۰',
        phone: '۰۹۱۲۳۴۵۶۷۸۹',
      },
      createdAt: '2023-12-01T10:00:00Z',
      updatedAt: '2023-12-01T10:00:00Z',
      items: [
        {
          id: 'item-1',
          orderId: id,
          productId: 'product-1',
          quantity: 1,
          unitPrice: 2500000,
          totalPrice: 2500000,
          product: mockProducts[0],
        },
      ],
    };
    
    return Promise.resolve(mockOrder);
  },

  createOrder: (orderData: {
    userId: string;
    items: { productId: string; quantity: number; unitPrice: number }[];
    shippingAddress: Record<string, unknown>;
    totalAmount: number;
  }): Promise<Order> => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      ...orderData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return Promise.resolve(newOrder);
  },

  updateOrderStatus: (id: string, status: string): Promise<Order> => {
    // Mock implementation
    return Promise.resolve({} as Order);
  },
};

// Returns API
export const returnsApi = {
  getReturns: (params?: {
    userId?: string;
    orderId?: string;
    status?: string;
    skip?: number;
    take?: number;
  }): Promise<PaginatedResponse<Return>> => {
    // Mock returns data
    const mockReturns: Return[] = [];
    
    return Promise.resolve({
      data: mockReturns,
      total: mockReturns.length,
      skip: params?.skip || 0,
      take: params?.take || 10,
    });
  },

  getReturn: (id: string): Promise<Return> => {
    // Mock implementation
    return Promise.resolve({} as Return);
  },

  createReturn: (returnData: {
    orderId: string;
    userId: string;
    reason: string;
    refundAmount: number;
  }): Promise<Return> => {
    const newReturn: Return = {
      id: `return-${Date.now()}`,
      ...returnData,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return Promise.resolve(newReturn);
  },

  updateReturnStatus: (id: string, status: string): Promise<Return> => {
    // Mock implementation
    return Promise.resolve({} as Return);
  },
};

// Users API
export const usersApi = {
  getUser: (id: string): Promise<User> => {
    // Mock user data
    const mockUser: User = {
      id,
      email: 'user@example.com',
      firstName: 'کاربر',
      lastName: 'نمونه',
      role: 'USER',
      isActive: true,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };
    
    return Promise.resolve(mockUser);
  },

  updateUser: (id: string, userData: Partial<User>): Promise<User> => {
    // Mock implementation
    return Promise.resolve({} as User);
  },

  deleteUser: (id: string): Promise<{ message: string }> => {
    return Promise.resolve({ message: 'کاربر حذف شد' });
  },
};

// Inventory API
export const inventoryApi = {
  getInventory: (params?: { skip?: number; take?: number }): Promise<PaginatedResponse<Inventory>> => {
    // Mock implementation
    return Promise.resolve({
      data: [],
      total: 0,
      skip: params?.skip || 0,
      take: params?.take || 10,
    });
  },

  getProductInventory: (productId: string): Promise<Inventory> => {
    // Mock implementation
    return Promise.resolve({} as Inventory);
  },

  updateInventory: (productId: string, inventoryData: {
    quantity: number;
    minThreshold?: number;
  }): Promise<Inventory> => {
    // Mock implementation
    return Promise.resolve({} as Inventory);
  },
};