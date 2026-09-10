import api, { unwrap } from "./client";

// admin only
export const getDashboardStats = () => unwrap(api.get("/admin/stats"));

// { page, limit } — returns { users, pagination }
export const getAllUsers = (params = {}) => unwrap(api.get("/admin/users", { params }));

export const updateUserRole = (userId, role) =>
  unwrap(api.patch(`/admin/users/${userId}/role`, { role }));

// ---- Seller application workflow (admin.controller.js) ----

// Returns pending SellerProfile docs, each populated with userId (userName, fullName, email, phone)
export const getPendingSellers = () => unwrap(api.get("/admin/sellers/pending"));

// status: "pending" | "approved" | "rejected" | "suspended" — omit to get all
export const getSellersByStatus = (status) =>
  unwrap(api.get("/admin/sellers", { params: status ? { status } : {} }));

// sellerId is the SellerProfile _id (not the User _id).
// Requires bankAccountDetails.verificationStatus === "verified" first, or the
// backend rejects with 400 — verify bank details before approving.
export const approveSeller = (sellerId) => unwrap(api.patch(`/admin/sellers/${sellerId}/approve`));

export const rejectSeller = (sellerId, reason) =>
  unwrap(api.patch(`/admin/sellers/${sellerId}/reject`, { reason }));

export const suspendSeller = (sellerId) => unwrap(api.patch(`/admin/sellers/${sellerId}/suspend`));

// verificationStatus: "verified" | "rejected"
export const verifyBankDetails = (sellerId, verificationStatus) =>
  unwrap(api.patch(`/admin/sellers/${sellerId}/verify-bank`, { verificationStatus }));

// ---- Review moderation (admin.controller.js) ----

export const getReportedReviews = () => unwrap(api.get("/admin/reviews/reported"));

export const getHiddenReviews = () => unwrap(api.get("/admin/reviews/hidden"));

export const hideReview = (reviewId, reason) =>
  unwrap(api.patch(`/admin/reviews/${reviewId}/hide`, { reason }));

export const unhideReview = (reviewId) => unwrap(api.patch(`/admin/reviews/${reviewId}/unhide`));

// superadmin only
export const getFullDashboard = () => unwrap(api.get("/superadmin/dashboard"));

export const getAllAdmins = () => unwrap(api.get("/superadmin/admins"));

export const updateAdminRole = (userId, role) =>
  unwrap(api.patch(`/superadmin/users/${userId}/role`, { role }));

export const toggleUserActive = (userId) =>
  unwrap(api.patch(`/superadmin/users/${userId}/toggle-active`));
