import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
    baseURL: API,
    headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Attach the admin token automatically when present.
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ---- Public reads ----------------------------------------------------------
export const getServices = () => api.get("/services").then((r) => r.data);
export const getPricing = () => api.get("/pricing").then((r) => r.data);
export const getProjects = () => api.get("/projects").then((r) => r.data);
export const getSettings = () => api.get("/settings").then((r) => r.data);
export const submitContact = (payload) =>
    api.post("/contact", payload).then((r) => r.data);

// ---- Admin auth ------------------------------------------------------------
export const adminLogin = (password) =>
    api.post("/admin/login", { password }).then((r) => {
        setToken(r.data.token);
        return r.data;
    });

export const adminVerify = () => api.get("/admin/verify").then((r) => r.data);

// ---- Admin CRUD ------------------------------------------------------------
// resource is one of: "services" | "projects" | "pricing"
export const adminCreate = (resource, payload) =>
    api.post(`/admin/${resource}`, payload).then((r) => r.data);

export const adminUpdate = (resource, id, payload) =>
    api.put(`/admin/${resource}/${id}`, payload).then((r) => r.data);

export const adminDelete = (resource, id) =>
    api.delete(`/admin/${resource}/${id}`).then((r) => r.data);

export const adminUpdateSettings = (payload) =>
    api.put("/admin/settings", payload).then((r) => r.data);

// Upload an image file; returns the full public URL to the stored image.
export const adminUploadImage = (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api
        .post("/admin/upload", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => `${BACKEND_URL}${r.data.path}`);
};

// ---- Messages --------------------------------------------------------------
export const adminGetContacts = () =>
    api.get("/admin/contacts").then((r) => r.data);

export const adminDeleteContact = (id) =>
    api.delete(`/admin/contacts/${id}`).then((r) => r.data);
