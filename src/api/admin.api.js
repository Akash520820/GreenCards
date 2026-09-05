import api, { unwrap } from "./client";

// admin only
export const getDashboardStats = () => unwrap(api.get("/admin/stats"));

// { page, limit } — returns { users, pagination }
export const getAllUsers = (params = {}) => unwrap(api.get("/admin/users", { params }));

export const updateUserRole = (userId, role) =>
  unwrap(api.patch(`/admin/users/${userId}/role`, { role }));

// superadmin only
export const getFullDashboard = () => unwrap(api.get("/superadmin/dashboard"));

export const getAllAdmins = () => unwrap(api.get("/superadmin/admins"));

export const updateAdminRole = (userId, role) =>
  unwrap(api.patch(`/superadmin/users/${userId}/role`, { role }));

export const toggleUserActive = (userId) =>
  unwrap(api.patch(`/superadmin/users/${userId}/toggle-active`));
