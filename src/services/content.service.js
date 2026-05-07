import http from './http.js';
import { mockApi } from './mockApi.js';

const USE_MOCK = true;

export const contentService = {
  async getTeacherContent(teacherId) {
    if (USE_MOCK) return mockApi.getContent({ teacherId });
    const { data } = await http.get(`/content/teacher/${teacherId}`);
    return data;
  },
  async uploadContent(payload, teacherId) {
    if (USE_MOCK) return mockApi.createContent(payload, teacherId);
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
    const { data } = await http.post('/content', formData);
    return data;
  },
  async getAllContent(filters) {
    if (USE_MOCK) return mockApi.getContent(filters);
    const { data } = await http.get('/content', { params: filters });
    return data;
  },
  async getLiveContent(teacherId) {
    if (USE_MOCK) return mockApi.getLiveContent(teacherId);
    const { data } = await http.get(`/content/live/${teacherId}`);
    return data;
  },
};
