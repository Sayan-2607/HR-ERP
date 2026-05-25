import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
});

// Attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ws_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && error.response?.data?.code === "TOKEN_EXPIRED" && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("ws_refresh_token");
        const { data } = await axios.post(`${API_BASE}/api/auth/refresh-token`, { refreshToken: refresh });
        localStorage.setItem("ws_token", data.accessToken);
        localStorage.setItem("ws_refresh_token", data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem("ws_token");
        localStorage.removeItem("ws_refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───
export const authAPI = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  register: (data: any) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout", { refreshToken: localStorage.getItem("ws_refresh_token") }),
};

// ─── Employees ───
export const employeeAPI = {
  getAll: (params?: any) => api.get("/employees", { params }),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (data: any) => api.post("/employees", data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
  getStats: () => api.get("/employees/stats"),
  getDepartments: () => api.get("/employees/departments"),
};

// ─── Attendance ───
export const attendanceAPI = {
  clockIn: (data?: any) => api.post("/attendance/clock-in", data),
  clockOut: () => api.post("/attendance/clock-out"),
  getMy: (params?: any) => api.get("/attendance/my", { params }),
  getTeam: () => api.get("/attendance/team"),
};

// ─── Leave ───
export const leaveAPI = {
  apply: (data: any) => api.post("/leaves/apply", data),
  getMy: () => api.get("/leaves/my"),
  getPending: () => api.get("/leaves/pending"),
  approve: (id: string, comments?: string) => api.put(`/leaves/${id}/approve`, { comments }),
  reject: (id: string, comments?: string) => api.put(`/leaves/${id}/reject`, { comments }),
  getStats: () => api.get("/leaves/stats"),
};

// ─── Payroll ───
export const payrollAPI = {
  getAll: (params?: any) => api.get("/payroll", { params }),
  getMy: () => api.get("/payroll/my"),
  generate: (month: number, year: number) => api.post("/payroll/generate", { month, year }),
  process: (month: number, year: number) => api.post("/payroll/process", { month, year }),
  getStats: () => api.get("/payroll/stats"),
};

// ─── Recruitment ───
export const recruitmentAPI = {
  getJobs: (params?: any) => api.get("/recruitment/jobs", { params }),
  createJob: (data: any) => api.post("/recruitment/jobs", data),
  updateJob: (id: string, data: any) => api.put(`/recruitment/jobs/${id}`, data),
  getApplications: (params?: any) => api.get("/recruitment/applications", { params }),
  createApplication: (data: any) => api.post("/recruitment/applications", data),
  updateStage: (id: string, stage: string) => api.put(`/recruitment/applications/${id}/stage`, { stage }),
  getStats: () => api.get("/recruitment/stats"),
};

// ─── Performance ───
export const performanceAPI = {
  getReviews: (params?: any) => api.get("/performance/reviews", { params }),
  getMyReviews: () => api.get("/performance/reviews/my"),
  submitSelf: (data: any) => api.post("/performance/reviews/self", data),
  submitManager: (id: string, data: any) => api.put(`/performance/reviews/${id}/manager`, data),
  getGoals: (params?: any) => api.get("/performance/goals", { params }),
  createGoal: (data: any) => api.post("/performance/goals", data),
  updateGoal: (id: string, data: any) => api.put(`/performance/goals/${id}`, data),
  submitFeedback: (data: any) => api.post("/performance/feedback", data),
  getFeedback: (params?: any) => api.get("/performance/feedback", { params }),
};

// ─── Learning ───
export const learningAPI = {
  getCourses: (params?: any) => api.get("/learning/courses", { params }),
  createCourse: (data: any) => api.post("/learning/courses", data),
  enroll: (courseId: string) => api.post(`/learning/courses/${courseId}/enroll`),
  updateProgress: (id: string, progress: number) => api.put(`/learning/enrollments/${id}/progress`, { progress }),
  getMyEnrollments: () => api.get("/learning/my-enrollments"),
  getStats: () => api.get("/learning/stats"),
};

// ─── Engagement ───
export const engagementAPI = {
  checkinMood: (mood: string, note?: string) => api.post("/engagement/mood", { mood, note }),
  getMoodHistory: () => api.get("/engagement/mood/history"),
  getTeamMood: () => api.get("/engagement/mood/team"),
  giveRecognition: (data: any) => api.post("/engagement/recognition", data),
  getRecognitions: () => api.get("/engagement/recognition"),
  likeRecognition: (id: string) => api.put(`/engagement/recognition/${id}/like`),
};

// ─── Helpdesk ───
export const helpdeskAPI = {
  create: (data: any) => api.post("/helpdesk", data),
  getAll: (params?: any) => api.get("/helpdesk", { params }),
  getMy: () => api.get("/helpdesk/my"),
  update: (id: string, data: any) => api.put(`/helpdesk/${id}`, data),
  addMessage: (id: string, message: string) => api.post(`/helpdesk/${id}/messages`, { message }),
  getMessages: (id: string) => api.get(`/helpdesk/${id}/messages`),
  getStats: () => api.get("/helpdesk/stats"),
};

// ─── Analytics ───
export const analyticsAPI = {
  getDashboard: () => api.get("/analytics/dashboard"),
  getHeadcount: () => api.get("/analytics/headcount"),
  getAttrition: () => api.get("/analytics/attrition"),
  getDiversity: () => api.get("/analytics/diversity"),
};

// ─── AI Assistant ───
export const aiAPI = {
  chat: (message: string) => api.post("/ai/chat", { message }),
  getSuggestions: () => api.get("/ai/suggestions"),
};

export default api;
