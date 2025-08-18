import { getCookie } from '../context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

function getAuthHeaders(): Record<string, string> {
  const token = getCookie('token');
  
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  } else {
    return {};
  }
}


export interface Category {
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  categoryImage?: string; // New field for image URL
  parentId?: number; // Optional, for nested categories
  parentName?: string; // Optional, for parent category name
  parentIsActive?: boolean; // Optional, for parent category active status
  isActive: boolean; // For visibility control
  position: number; // For display order
  displayOrder: number; // For display order
  displayTypes: string[]; // New field for display types
  createdAt: string;
  updatedAt: string;
  subCategories?: Category[];
}

export async function fetchCategoriesByDisplayType(displayType: string): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/public/categories/by-display-type?type=${displayType}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch categories for display type ${displayType}`);
  }
  return await res.json();
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

export async function fetchPublicCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/public/categories/hierarchy`);
  if (!res.ok) {
    throw new Error('Failed to fetch public categories');
  }
  return await res.json();
}

export async function fetchPublicBanners(): Promise<Banner[]> {
  const url = `${API_BASE_URL}/banners`;

  const res = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    credentials: 'omit',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch public banners');
  }

  return await res.json();
}


export async function createCategory(formData: FormData): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: 'POST',
    headers: { ...getAuthHeaders() }, // No Content-Type header for FormData
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create category');
  }
}

export async function updateCategory(id: number, payload: FormData): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders() }, // No Content-Type header for FormData
    body: payload,
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

export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

export interface Product {
  productId: number;
  productCode: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId?: number; // Added categoryId directly
  category?: Category;
  images: ProductImage[];
  stockQuantity: number;
  inStock: boolean;
  youtubeLink: string;
  color?: string; // Added color
  fabric?: string; // Added fabric
  deleted: boolean; // Added deleted field
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  contactNo: string;
  isRead: boolean;
  createdAt: string;
}

export async function fetchContactMessages(unread: boolean = false): Promise<ContactMessage[]> {
  const params = unread ? '?unread=true' : '';
  const res = await fetch(`${API_BASE_URL}/contact-messages${params}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch contact messages');
  }
  return await res.json();
}

export async function markMessageAsRead(id: number): Promise<ContactMessage> {
  const res = await fetch(`${API_BASE_URL}/contact-messages/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to mark message as read');
  }
  return await res.json();
}

const processProductData = (product: Product): Product => {
  const baseUrl = API_BASE_URL.replace('/api', '');
  if (product.images) {
    product.images = product.images.map(image => {
      // Handle cases where imageUrl might be null or undefined
      if (image && image.imageUrl) {
        const newImageUrl = image.imageUrl.startsWith('http')
          ? image.imageUrl
          : `${baseUrl}${image.imageUrl}`;
        return { ...image, imageUrl: newImageUrl };
      }
      return image; // Return the original image object if imageUrl is missing
    });
  }
  return product;
};

export async function fetchProducts(page: number = 0, size: number = 10, categoryId?: number, q?: string, sort?: string, includeDeleted: boolean = false): Promise<Page<Product>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (categoryId) {
    params.append('categoryId', categoryId.toString());
  }
  if (q) {
    params.append('q', q);
  }
  if (sort) {
    params.append('sort', sort);
  }
  params.append('includeDeleted', includeDeleted.toString());

  const url = `${API_BASE_URL}/admin/products?${params.toString()}`;
  console.log('fetchProducts: Requesting URL:', url);

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  
  console.log('fetchProducts: Raw response status:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText} - ${errorText}`);
  }
  const data: Page<Product> = await res.json();
  console.log('fetchProducts: Parsed JSON data:', data);
  
  const processedContent = data.content.map(processProductData);
  
  return { ...data, content: processedContent };
}

function processProductDetailData(data: any): Product {
    return {
        productId: data.productId,
        productCode: data.productCode,
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        images: data.imageUrls ? data.imageUrls.map((url: string, index: number) => ({
            id: index,
            imageUrl: url,
            isMain: index === 0
        })) : [],
        stockQuantity: data.stockQuantity,
        inStock: data.inStock,
        youtubeLink: data.youtubeLink || '',
        color: data.color,
        fabric: data.fabric,
        deleted: false,
        createdAt: data.createdAt || new Date().toISOString(),
        createdBy: data.createdBy || 'system',
        updatedAt: data.updatedAt || new Date().toISOString(),
        updatedBy: data.updatedBy || 'system'
    };
}

export async function fetchProductById(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }
    const product = await res.json();
    return processProductDetailData(product);
}

export async function fetchProductsByCategoryId(categoryId: number): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/public/products/by-category/${categoryId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products for category ${categoryId}`);
  }
  const products = await res.json();
  return products.map(processProductData);
}

export async function searchProducts(query: string, categoryId?: number, page: number = 0, size: number = 20): Promise<Product[]> {
  const params = new URLSearchParams();
  params.append('q', query);
  if (categoryId) {
    params.append('categoryId', categoryId.toString());
  }
  params.append('page', page.toString());
  params.append('size', size.toString());

  const res = await fetch(`${API_BASE_URL}/products/search?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to search products: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  // Handle Page response from admin endpoint and convert to ProductListItem format
  const products = data.content ? data.content : data;
  
  // Convert admin ProductDto to Product format expected by frontend
  return products.map((product: any) => ({
    productId: product.productId,
    productCode: product.productCode,
    name: product.name,
    slug: product.name.toLowerCase().replace(/\s+/g, '-'),
    description: product.description || '',
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    categoryId: product.categoryId,
    images: product.images || [],
    stockQuantity: product.stockQuantity || 0,
    inStock: product.inStock || false,
    youtubeLink: product.youtubeLink || '',
    color: product.color,
    fabric: product.fabric,
    deleted: product.deleted || false,
    createdAt: product.createdAt || '',
    createdBy: product.createdBy || '',
    updatedAt: product.updatedAt || '',
    updatedBy: product.updatedBy || ''
  }));
}

export async function createProduct(productData: FormData): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
    body: productData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create product');
  }
}

export async function updateProduct(productId: number, productData: FormData): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders() },
    body: productData,
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

export async function restoreProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/products/${id}/restore`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to restore product');
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
  customerName: string;
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
    unitPrice: number;
    subTotal: number;
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

export interface Banner {
  id: number;
  name: string;
  image: string;
  linkTo: string;
  status: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
  isDefault: boolean; // Added isDefault property
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export async function fetchBanners(): Promise<Banner[]> {
  const res = await fetch(`${API_BASE_URL}/admin/banners`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch banners');
  }
  return await res.json();
}

export async function createBanner(banner: { name: string; image: string; linkTo: string; status?: 'ACTIVE' | 'INACTIVE'; isActive?: boolean; description?: string }): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/banners`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(banner),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create banner');
  }
}

export async function updateBanner(banner: Partial<Banner>): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/banners/${banner.id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(banner),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update banner');
  }
}

export async function deleteBanner(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/banners/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete banner');
  }
}

export async function fetchDashboardStats(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return await res.json();
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
  const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/order-status`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.error || errorData.message || 'Failed to update order status');
  }
}

// Cart API Functions
export interface CartItem {
  cartItemId: number;
  productId: number;
  productCode: string;
  name: string;
  mainImageUrl: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface CartView {
  cartId: string;
  lines: CartItem[];
  subtotal: number;
  grandTotal: number;
}

// Backend response types (for raw API responses)
interface BackendCartLine {
  cartItemId: number;
  productId: number;
  name: string;
  mainImageUrl: string;
  price: number | string; // Can be BigDecimal from backend
  quantity: number;
  lineTotal: number | string; // Can be BigDecimal from backend
}

interface BackendCartView {
  cartId: string;
  lines: BackendCartLine[];
  subtotal: number | string; // Can be BigDecimal from backend
  grandTotal: number | string; // Can be BigDecimal from backend
}

// Helper function to convert backend response to frontend types
function convertBackendCartView(backendCart: BackendCartView): CartView {
  return {
    cartId: backendCart.cartId,
    lines: backendCart.lines.map((line): CartItem => ({
      cartItemId: line.cartItemId,
      productId: line.productId,
      productCode: `PRD-${line.productId}`, // Generate productCode from productId
      name: line.name,
      mainImageUrl: line.mainImageUrl,
      price: typeof line.price === 'string' ? parseFloat(line.price) : line.price,
      quantity: line.quantity,
      lineTotal: typeof line.lineTotal === 'string' ? parseFloat(line.lineTotal) : line.lineTotal
    })),
    subtotal: typeof backendCart.subtotal === 'string' ? parseFloat(backendCart.subtotal) : backendCart.subtotal,
    grandTotal: typeof backendCart.grandTotal === 'string' ? parseFloat(backendCart.grandTotal) : backendCart.grandTotal
  };
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}

export interface CartUpdateRequest {
  quantity: number;
}

function getCartHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json'
  };
}

export async function addToCart(request: CartItemRequest): Promise<CartView> {
  const res = await fetch(`${API_BASE_URL}/cart/items`, {
    method: 'POST',
    headers: getCartHeaders(),
    credentials: 'include', // Include cookies
    body: JSON.stringify(request)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add item to cart');
  }
  const backendResponse: BackendCartView = await res.json();
  return convertBackendCartView(backendResponse);
}

export async function getCart(): Promise<CartView> {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: 'GET',
    headers: getCartHeaders(),
    credentials: 'include' // Include cookies
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch cart');
  }
  const backendResponse: BackendCartView = await res.json();
  return convertBackendCartView(backendResponse);
}

export async function updateCartItemByProductId(productId: number, quantity: number): Promise<CartView> {
  const res = await fetch(`${API_BASE_URL}/cart/items/by-product/${productId}`, {
    method: 'PUT',
    headers: getCartHeaders(),
    credentials: 'include', // Include cookies
    body: JSON.stringify({ quantity })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update cart item');
  }
  const backendResponse: BackendCartView = await res.json();
  return convertBackendCartView(backendResponse);
}

export async function removeCartItemByProductId(productId: number): Promise<CartView> {
  const res = await fetch(`${API_BASE_URL}/cart/items/by-product/${productId}`, {
    method: 'DELETE',
    headers: getCartHeaders(),
    credentials: 'include' // Include cookies
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to remove cart item');
  }
  const backendResponse: BackendCartView = await res.json();
  return convertBackendCartView(backendResponse);
}

export async function getCartItemByProductId(productId: number): Promise<CartItem | null> {
  const res = await fetch(`${API_BASE_URL}/cart/items/by-product/${productId}`, {
    method: 'GET',
    headers: getCartHeaders(),
    credentials: 'include' // Include cookies
  });
  if (!res.ok) {
    return null;
  }
  return await res.json();
}

export async function getCartItemCount(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/cart/count`, {
    method: 'GET',
    headers: getCartHeaders(),
    credentials: 'include' // Include cookies
  });
  if (!res.ok) {
    return 0;
  }
  const data = await res.json();
  return data.count || 0;
}

// Order creation and management API Functions
export interface OrderCreateRequest {
  guestId: number;
  items: OrderItemRequest[];
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingState: string;
  totalAmount: number;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
  price: number;
}

export interface PlaceOrderResponse {
  orderId: number;
  orderNumber: string;
  message: string;
}

export interface OrderSummaryDto {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export interface OrderTrackDto {
  orderId: number;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  shippingName: string;
  shippingAddress: string;
  totalAmount: number;
  orderItems: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export async function placeOrder(request: OrderCreateRequest): Promise<PlaceOrderResponse> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // Include cookies for session management
    body: JSON.stringify(request)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to place order');
  }
  return await res.json();
}

export async function getGuestOrders(guestId: number, page: number = 0, size: number = 10): Promise<Page<OrderSummaryDto>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());

  const res = await fetch(`${API_BASE_URL}/orders/guest/${guestId}?${params.toString()}`, {
    method: 'GET',
    headers: getCartHeaders(),
    credentials: 'include'
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch guest orders');
  }
  return await res.json();
}

export async function trackOrder(orderId: number): Promise<OrderTrackDto> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: getCartHeaders(),
    credentials: 'include'
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to track order');
  }
  return await res.json();
}