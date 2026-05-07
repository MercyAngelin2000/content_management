import http from './http.js';
import { mockApi } from './mockApi.js';

const USE_MOCK = true;

export const authService = {
  async login(payload) {
    if (USE_MOCK) return mockApi.login(payload);
    const { data } = await http.post('/auth/login', payload);
    return data;
  },
};
