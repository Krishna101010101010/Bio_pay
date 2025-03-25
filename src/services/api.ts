import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const auth = {
  login: async (mobile: string, fingerprint: boolean) => {
    const response = await api.post('/api/auth/login', { mobile, fingerprint });
    return response.data;
  },
  register: async (data: { name: string; mobile: string; userType: string; fingerprint: boolean }) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
  verifyOtp: async (mobile: string, otp: string) => {
    const response = await api.post('/api/auth/verify-otp', { mobile, otp });
    return response.data;
  },
  resendOtp: async (mobile: string) => {
    const response = await api.post('/api/auth/resend-otp', { mobile });
    return response.data;
  },
};

// User endpoints
export const user = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  },
};

// Payment endpoints
export const payments = {
  createRequest: async (data: { amount: number; description: string }) => {
    const response = await api.post('/api/payments/request', data);
    return response.data;
  },
  processPayment: async (data: { requestId: string; fingerprint: boolean }) => {
    const response = await api.post('/api/payments/process', data);
    return response.data;
  },
  getTransactions: async () => {
    const response = await api.get('/api/payments/transactions');
    return response.data;
  },
};

// Merchant endpoints
export const merchant = {
  getProfile: async () => {
    const response = await api.get('/api/merchants/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/api/merchants/profile', data);
    return response.data;
  },
};

export default api; 