import axios from "axios";

const API = axios.create({ baseURL: "/api" });

// Attach token from localStorage on every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login    = (data) => API.post("/auth/login",    data);

// Complaints (user)
export const getComplaints   = ()     => API.get("/complaints");
export const submitComplaint = (data) => API.post("/complaints", data);
export const getComplaint    = (id)   => API.get(`/complaints/${id}`);

// Admin
export const adminGetComplaints   = ()        => API.get("/admin/complaints");
export const adminUpdateComplaint = (id, d)   => API.put(`/admin/complaints/${id}`, d);
export const adminDeleteComplaint = (id)      => API.delete(`/admin/complaints/${id}`);
export const adminGetStats        = ()        => API.get("/admin/stats");
export const adminGetUsers        = ()        => API.get("/admin/users");

// Chatbot
export const chatbotMessage = (message) => API.post("/chatbot", { message });