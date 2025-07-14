import { getCookie } from '../context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

function getAuthHeaders() {
  const token = getCookie('token');
  console.log(`getAuthHeaders: Token from cookie: ${token}`); // DEBUG
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}


export interface Category {
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  parentId?: number; // Optional, for nested categories
  isActive: boolean; // For visibility control
  position: number; // For display order
  createdAt: string;
  updatedAt: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/admin/categories`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return await res.json();
}

export async function createCategory(payload: { name: string; slug: string; description: string; parentId?: number; isActive?: boolean; position?: number }): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create category');
  }
}

export async function updateCategory(id: number, payload: { name: string; slug: string; description: string; parentId?: number; isActive?: boolean; position?: number }): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update category');
  }
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete category');
  }
}

export interface Product {
  productId: number;
  productCode: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category?: Category;
  images: any[];
  galleryImages: any[];
  stockQuantity: number;
  inStock: boolean;
  youtubeLink: string;
  mainImageUrl: string;
  color: string;
  fabric: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export async function fetchProducts(page: number = 0, size: number = 10): Promise<Page<Product>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());

  const res = await fetch(`${API_BASE_URL}/admin/products?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return await res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }
    return await res.json();
}

export async function createProduct(product: any): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create product');
  }
}

export async function updateProduct(product: Partial<Product>): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/products/${product.productId}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update product');
  }
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete product');
  }
}

export async function fetchLowStockProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}/admin/products/low-stock`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch low stock products');
    }
    return await res.json();
}

export interface OrderListItem {
  orderId: number;
  orderNumber: string;
  shippingName: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export interface OrderDetailDto {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  orderItems: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page number (0-indexed)
  size: number; // page size
  first: boolean;
  last: boolean;
  empty: boolean;
}

export async function fetchOrders(status?: string, page: number = 0, size: number = 10): Promise<Page<OrderListItem>> {
  const params = new URLSearchParams();
  if (status && status !== 'All') {
    params.append('status', status);
  }
  params.append('page', page.toString());
  params.append('size', size.toString());

  const res = await fetch(`${API_BASE_URL}/admin/orders?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }
  return await res.json();
}

export async function fetchOrderDetail(orderId: number): Promise<OrderDetailDto> {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch order details');
  }
  return await res.json();
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update order status');
  }
}