const wait = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

const users = [
  { id: 't1', email: 'teacher@school.com', password: '123456', role: 'teacher', name: 'Teacher One' },
  { id: 'p1', email: 'principal@school.com', password: '123456', role: 'principal', name: 'Principal One' },
];

const subjects = ['Math', 'Science', 'English', 'History', 'Geography'];
let counter = 1;
const teacherContent = Array.from({ length: 650 }).map((_, idx) => {
  const status = idx % 3 === 0 ? 'approved' : idx % 3 === 1 ? 'pending' : 'rejected';
  const now = Date.now();
  return {
    id: `c${counter++}`,
    teacherId: 't1',
    title: `Class Slide ${idx + 1}`,
    subject: subjects[idx % subjects.length],
    description: 'Educational content for classroom broadcast.',
    fileUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    startTime: new Date(now - 3600000).toISOString(),
    endTime: new Date(now + 3600000).toISOString(),
    rotationDuration: 30,
    status,
    rejectionReason: status === 'rejected' ? 'Low visual clarity.' : '',
    createdAt: new Date(now - idx * 7200000).toISOString(),
  };
});

export const mockApi = {
  async login(payload) {
    await wait(500);
    const user = users.find((u) => u.email === payload.email && u.password === payload.password);
    if (!user) throw new Error('Invalid email or password');
    return {
      token: `token-${user.id}`,
      user: { id: user.id, role: user.role, name: user.name, email: user.email },
    };
  },

  async getContent({ teacherId, status, search, onlyPending } = {}) {
    await wait();
    let list = [...teacherContent];
    if (teacherId) list = list.filter((item) => item.teacherId === teacherId);
    if (status && status !== 'all') list = list.filter((item) => item.status === status);
    if (onlyPending) list = list.filter((item) => item.status === 'pending');
    if (search) {
      const key = search.toLowerCase();
      list = list.filter((item) => item.title.toLowerCase().includes(key) || item.subject.toLowerCase().includes(key));
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createContent(payload, teacherId) {
    await wait(900);
    const content = {
      id: `c${counter++}`,
      teacherId,
      ...payload,
      status: 'pending',
      rejectionReason: '',
      createdAt: new Date().toISOString(),
    };
    teacherContent.unshift(content);
    return content;
  },

  async approveContent(id) {
    await wait(500);
    const item = teacherContent.find((c) => c.id === id);
    if (!item) throw new Error('Content not found');
    item.status = 'approved';
    item.rejectionReason = '';
    return item;
  },

  async rejectContent(id, reason) {
    await wait(500);
    const item = teacherContent.find((c) => c.id === id);
    if (!item) throw new Error('Content not found');
    item.status = 'rejected';
    item.rejectionReason = reason;
    return item;
  },

  async getLiveContent(teacherId) {
    await wait(450);
    const now = Date.now();
    return teacherContent.filter((item) => {
      if (item.teacherId !== teacherId || item.status !== 'approved') return false;
      const start = new Date(item.startTime).getTime();
      const end = new Date(item.endTime).getTime();
      return now >= start && now <= end;
    });
  },
};
