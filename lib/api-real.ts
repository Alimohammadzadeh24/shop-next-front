import { z } from "zod";
import {
  User,
  Product,
  Order,
  Return,
  Inventory,
  AuthTokens,
  PaginatedResponse,
} from "@/types";
import {
  userSchema,
  productSchema,
  orderSchema,
  returnSchema,
  inventorySchema,
  authTokensSchema,
  paginatedResponseSchema,
} from "@/lib/validations";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = "ApiError";
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
    "Content-Type": "application/json",
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
    throw new ApiError(0, "خطا در ارتباط با سرور");
  }
}

// Auth API
export const authApi = {
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthTokens> => {
    return apiRequest(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
      authTokensSchema
    );
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<AuthTokens> => {
    return apiRequest(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(userData),
      },
      authTokensSchema
    );
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    return apiRequest("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    });
  },
};

// Products API
export const productsApi = {
  getProducts: async (params?: {
    search?: string;
    category?: string;
    brand?: string;
    skip?: number;
    take?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.brand) queryParams.append("brand", params.brand);
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.take) queryParams.append("take", params.take.toString());

    const queryString = queryParams.toString();
    const url = `/products${queryString ? `?${queryString}` : ""}`;

    return apiRequest(
      url,
      { method: "GET" },
      paginatedResponseSchema(productSchema)
    );
  },

  getProduct: async (id: string): Promise<Product> => {
    return apiRequest(`/products/${id}`, { method: "GET" }, productSchema);
  },

  createProduct: async (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> => {
    return apiRequest(
      "/products",
      {
        method: "POST",
        body: JSON.stringify(productData),
      },
      productSchema
    );
  },

  updateProduct: async (
    id: string,
    productData: Partial<Product>
  ): Promise<Product> => {
    return apiRequest(
      `/products/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(productData),
      },
      productSchema
    );
  },

  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest(`/products/${id}`, { method: "DELETE" });
  },
};

// Orders API
export const ordersApi = {
  getOrders: async (params?: {
    userId?: string;
    status?: string;
    skip?: number;
    take?: number;
  }): Promise<PaginatedResponse<Order>> => {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append("userId", params.userId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.take) queryParams.append("take", params.take.toString());

    const queryString = queryParams.toString();
    const url = `/orders${queryString ? `?${queryString}` : ""}`;

    return apiRequest(
      url,
      { method: "GET" },
      paginatedResponseSchema(orderSchema)
    );
  },

  getOrder: async (id: string): Promise<Order> => {
    return apiRequest(`/orders/${id}`, { method: "GET" }, orderSchema);
  },

  createOrder: async (orderData: {
    userId: string;
    items: { productId: string; quantity: number; unitPrice: number }[];
    shippingAddress: Record<string, unknown>;
  }): Promise<Order> => {
    return apiRequest(
      "/orders",
      {
        method: "POST",
        body: JSON.stringify(orderData),
      },
      orderSchema
    );
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    return apiRequest(
      `/orders/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
      orderSchema
    );
  },
};

// Returns API
export const returnsApi = {
  getReturns: async (params?: {
    userId?: string;
    orderId?: string;
    status?: string;
    skip?: number;
    take?: number;
  }): Promise<PaginatedResponse<Return>> => {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append("userId", params.userId);
    if (params?.orderId) queryParams.append("orderId", params.orderId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.take) queryParams.append("take", params.take.toString());

    const queryString = queryParams.toString();
    const url = `/returns${queryString ? `?${queryString}` : ""}`;

    return apiRequest(
      url,
      { method: "GET" },
      paginatedResponseSchema(returnSchema)
    );
  },

  getReturn: async (id: string): Promise<Return> => {
    return apiRequest(`/returns/${id}`, { method: "GET" }, returnSchema);
  },

  createReturn: async (returnData: {
    orderId: string;
    userId: string;
    reason: string;
    refundAmount: number;
  }): Promise<Return> => {
    return apiRequest(
      "/returns",
      {
        method: "POST",
        body: JSON.stringify(returnData),
      },
      returnSchema
    );
  },

  updateReturnStatus: async (id: string, status: string): Promise<Return> => {
    return apiRequest(
      `/returns/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
      returnSchema
    );
  },
};

// Users API
export const usersApi = {
  getUser: async (id: string): Promise<User> => {
    return apiRequest(`/users/${id}`, { method: "GET" }, userSchema);
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    return apiRequest(
      `/users/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(userData),
      },
      userSchema
    );
  },

  deleteUser: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest(`/users/${id}`, { method: "DELETE" });
  },
};

// Inventory API
export const inventoryApi = {
  getInventory: async (params?: {
    lowStock?: boolean;
    skip?: number;
    take?: number;
  }): Promise<PaginatedResponse<Inventory>> => {
    const queryParams = new URLSearchParams();
    if (params?.lowStock)
      queryParams.append("lowStock", params.lowStock.toString());
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.take) queryParams.append("take", params.take.toString());

    const queryString = queryParams.toString();
    const url = `/inventory${queryString ? `?${queryString}` : ""}`;

    return apiRequest(
      url,
      { method: "GET" },
      paginatedResponseSchema(inventorySchema)
    );
  },

  getProductInventory: async (productId: string): Promise<Inventory> => {
    return apiRequest(
      `/inventory/${productId}`,
      { method: "GET" },
      inventorySchema
    );
  },

  updateInventory: async (
    productId: string,
    inventoryData: {
      quantity?: number;
      minThreshold?: number;
    }
  ): Promise<Inventory> => {
    return apiRequest(
      `/inventory/${productId}`,
      {
        method: "PATCH",
        body: JSON.stringify(inventoryData),
      },
      inventorySchema
    );
  },
};
