const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseURL = BACKEND_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // User endpoints
  async joinQueue(userData) {
    return this.request('/api/users/join-queue', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getQueueStatus(mobile) {
    return this.request(`/api/users/queue-status/${mobile}`);
  }

  async cancelQueue(mobile) {
    return this.request(`/api/users/cancel-queue/${mobile}`, {
      method: 'PUT',
    });
  }

  // Services endpoints
  async getServices() {
    return this.request('/api/services');
  }

  // Auth endpoints
  async adminLogin(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async validateToken() {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        return false;
      }
      
      // Try to make a request to a protected endpoint to validate token
      await this.request('/api/admin/stats');
      return true;
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('admin_token');
      return false;
    }
  }

  logout() {
    localStorage.removeItem('admin_token');
    window.location.href = '/';
  }

  // Admin endpoints
  async getQueue(status = 'all') {
    return this.request(`/api/admin/queue?status=${status}`);
  }

  async updateQueueStatus(id, status) {
    return this.request(`/api/admin/queue/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getStats() {
    return this.request('/api/admin/stats');
  }

  async getRecords(period = 'today', status = 'all', page = 1, limit = 10) {
    return this.request(`/api/admin/records?period=${period}&status=${status}&page=${page}&limit=${limit}`);
  }

  async deleteOldRecords(days = 30) {
    return this.request('/api/admin/records', {
      method: 'DELETE',
      body: JSON.stringify({ days }),
    });
  }

  async getHaircutStyles(trending = false) {
    return this.request(`/api/admin/haircut-styles?trending=${trending}`);
  }

  async createHaircutStyle(styleData) {
    return this.request('/api/admin/haircut-styles', {
      method: 'POST',
      body: JSON.stringify(styleData),
    });
  }

  async updateHaircutStyle(id, styleData) {
    return this.request(`/api/admin/haircut-styles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(styleData),
    });
  }

  async updateDailyLimit(maxCustomers) {
    return this.request('/api/admin/daily-limit', {
      method: 'PUT',
      body: JSON.stringify({ maxCustomers }),
    });
  }
}

export const api = new ApiClient();
