import http from './http.js';
import { mockApi } from './mockApi.js';

const USE_MOCK = true;

export const approvalService = {
  async getPending() {
    if (USE_MOCK) return mockApi.getContent({ onlyPending: true });
    const { data } = await http.get('/approvals/pending');
    return data;
  },
  async approve(id) {
    if (USE_MOCK) return mockApi.approveContent(id);
    const { data } = await http.patch(`/approvals/${id}/approve`);
    return data;
  },
  async reject(id, reason) {
    if (USE_MOCK) return mockApi.rejectContent(id, reason);
    const { data } = await http.patch(`/approvals/${id}/reject`, { reason });
    return data;
  },
};
