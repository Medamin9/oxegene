const API_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error?.message || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0, error);
  }
}

export const api = {
  // Auth
  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
  
  getCurrentUser: () => fetchAPI('/auth/me'),

  // Menu
  getMenu: () => fetchAPI('/menu'),
  
  getProduct: (slug) => fetchAPI(`/menu/products/${slug}`),
  
  getCategory: (slug) => fetchAPI(`/menu/categories/${slug}`),

  // Content
  getContent: () => fetchAPI('/content'),
  
  getSiteContent: (key) => fetchAPI(`/content/${key}`),
  
  getSettings: () => fetchAPI('/content/settings/all'),
  
  getGallery: () => fetchAPI('/content/gallery/images'),
  
  getTestimonials: () => fetchAPI('/content/testimonials/visible'),

  // Orders
  createOrder: (orderData) => fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  getOrderStatus: (orderNumber) => fetchAPI(`/orders/${orderNumber}/status`),
  
  getOrder: (orderNumber) => fetchAPI(`/orders/${orderNumber}`),

  // Messages
  createMessage: (messageData) => fetchAPI('/messages', {
    method: 'POST',
    body: JSON.stringify(messageData),
  }),

  // Admin - Dashboard
  getAdminStats: () => fetchAPI('/admin/stats'),

  // Admin - Orders
  getAdminOrders: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/admin/orders?${query}`);
  },
  
  getAdminOrder: (id) => fetchAPI(`/admin/orders/${id}`),
  
  updateOrderStatus: (id, status) => fetchAPI(`/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),

  // Admin - Menu
  getAdminCategories: () => fetchAPI('/admin/categories'),
  
  createCategory: (data) => fetchAPI('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateCategory: (id, data) => fetchAPI(`/admin/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  deleteCategory: (id) => fetchAPI(`/admin/categories/${id}`, {
    method: 'DELETE',
  }),

  // Upload product image — sends FormData, returns { imageUrl }
  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const url = `${API_URL}/admin/upload/product-image`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      // No Content-Type header — browser sets it with the boundary automatically
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.error?.message || 'Upload failed', response.status, data);
    }
    return data; // { imageUrl }
  },

  getAdminProducts: () => fetchAPI('/admin/products'),
  
  createProduct: (data) => fetchAPI('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateProduct: (id, data) => fetchAPI(`/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  deleteProduct: (id) => fetchAPI(`/admin/products/${id}`, {
    method: 'DELETE',
  }),

  // Admin - Content
  getAdminContent: () => fetchAPI('/admin/content'),
  
  updateContent: (key, content) => fetchAPI(`/admin/content/${key}`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  }),

  // Admin - Gallery
  getAdminGallery: () => fetchAPI('/admin/gallery'),
  
  createGalleryImage: (data) => fetchAPI('/admin/gallery', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateGalleryImage: (id, data) => fetchAPI(`/admin/gallery/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  deleteGalleryImage: (id) => fetchAPI(`/admin/gallery/${id}`, {
    method: 'DELETE',
  }),

  // Admin - Testimonials
  getAdminTestimonials: () => fetchAPI('/admin/testimonials'),
  
  createTestimonial: (data) => fetchAPI('/admin/testimonials', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateTestimonial: (id, data) => fetchAPI(`/admin/testimonials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  deleteTestimonial: (id) => fetchAPI(`/admin/testimonials/${id}`, {
    method: 'DELETE',
  }),

  // Admin - Messages
  getAdminMessages: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/admin/messages?${query}`);
  },
  
  updateMessageStatus: (id, status) => fetchAPI(`/admin/messages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  deleteMessage: (id) => fetchAPI(`/admin/messages/${id}`, {
    method: 'DELETE',
  }),

  // Admin - Settings
  getAdminSettings: () => fetchAPI('/admin/settings'),
  
  updateSetting: (key, value, description) => fetchAPI(`/admin/settings/${key}`, {
    method: 'PATCH',
    body: JSON.stringify({ value, description }),
  }),
  
  changePassword: (currentPassword, newPassword) => fetchAPI('/admin/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  }),
};

export default api;
