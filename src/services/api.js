export const API_ORIGIN = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

const BASE_URL = `${API_ORIGIN}/api`;
const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
};

export const API = {
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleRes(res);
    },
    register: async (userData) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleRes(res);
    },
  },
  users: {
    updateProfile: async (id, formData) => {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      return handleRes(res);
    }
  },
  drives: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/drives`);
      return handleRes(res);
    },
    apply: async (driveId, userId) => {
      const res = await fetch(`${BASE_URL}/applications`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveId, userId })
      });
      return handleRes(res);
    },
    create: async (driveData) => {
      const res = await fetch(`${BASE_URL}/drives`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driveData)
      });
      return handleRes(res);
    },
    update: async (driveId, driveData) => {
      const res = await fetch(`${BASE_URL}/drives/${driveId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driveData)
      });
      return handleRes(res);
    },
    delete: async (driveId) => {
      const res = await fetch(`${BASE_URL}/drives/${driveId}`, { method: 'DELETE' });
      return handleRes(res);
    },
  },
  applications: {
    getByDrive: async (driveId) => {
      const allAppls = await API.applications.getAll();
      return allAppls.filter((a) => a.driveId === driveId);
    },
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/applications`);
      return handleRes(res);
    },
  },
  students: {
    getAll: async () => { return []; },
    getById: async (id) => { return {}; },
    update: async (id, data) => { return {}; },
  },
  internships: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/internships`);
      return handleRes(res);
    },
    create: async (data) => {
      const res = await fetch(`${BASE_URL}/internships`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleRes(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${BASE_URL}/internships/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleRes(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/internships/${id}`, { method: 'DELETE' });
      return handleRes(res);
    },
    apply: async (internshipId, userId) => {
      const res = await fetch(`${BASE_URL}/internshipApplications`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipId, userId })
      });
      return handleRes(res);
    },
    getApplications: async () => {
      const res = await fetch(`${BASE_URL}/internshipApplications`);
      return handleRes(res);
    },
  },
};