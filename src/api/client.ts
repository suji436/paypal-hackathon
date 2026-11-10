const DEFAULT_API_BASE_URL = 'http://localhost:4000';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit?: string;
  stock?: number;
  rating?: number;
  district?: string;
  image?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  brand?: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  district?: string;
  cart?: CartItem[];
}

export interface ApiOrder {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `Request failed (${response.status})`);
  }
  return payload as T;
}

export const api = {
  health: () => request<{ status: string; app: string; timestamp: string }>('/health'),
  products: (filters: { category?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (filters.category) query.set('category', filters.category);
    if (filters.search) query.set('search', filters.search);
    const suffix = query.size ? `?${query.toString()}` : '';
    return request<{ items: Product[]; total: number }>(`/products${suffix}`);
  },
  product: (id: string) => request<Product>(`/products/${encodeURIComponent(id)}`),
  login: (email: string, password: string) =>
    request<{ message: string; user: ApiUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (input: { name: string; email: string; password: string; district?: string; role?: string }) =>
    request<{ message: string; user: ApiUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  user: (id: string) => request<{ user: ApiUser }>(`/users/${encodeURIComponent(id)}`),
  cart: (userId: string) => request<{ cart: CartItem[] }>(`/cart/${encodeURIComponent(userId)}`),
  addToCart: (userId: string, productId: string, quantity = 1) =>
    request<{ message: string; cart: CartItem[] }>(`/cart/${encodeURIComponent(userId)}/add`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  updateCart: (userId: string, productId: string, quantity: number) =>
    request<{ message: string; cart: CartItem[] }>(`/cart/${encodeURIComponent(userId)}/update`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    }),
  removeFromCart: (userId: string, productId: string) =>
    request<{ message: string; cart: CartItem[] }>(`/cart/${encodeURIComponent(userId)}/remove/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    }),
  placeOrder: (input: { userId: string; items: CartItem[]; address?: Record<string, unknown>; paymentMethod?: string }) =>
    request<{ message: string; order: ApiOrder }>('/orders', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  orders: (userId: string) => request<{ orders: ApiOrder[] }>(`/orders/${encodeURIComponent(userId)}`),
  dashboard: (userId: string) => request<{
    user: ApiUser;
    summary: { totalOrders: number; totalSpent: number; cartCount: number; savedProducts: number };
    recentOrders: ApiOrder[];
  }>(`/dashboard/${encodeURIComponent(userId)}`),
};

export function getSavedUser(): ApiUser | null {
  try {
    const value = localStorage.getItem('vg_api_user');
    return value ? JSON.parse(value) as ApiUser : null;
  } catch {
    return null;
  }
}

export function saveUser(user: ApiUser | null): void {
  if (!user) {
    localStorage.removeItem('vg_api_user');
    return;
  }
  localStorage.setItem('vg_api_user', JSON.stringify(user));
}
