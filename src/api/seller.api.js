import api, { unwrap } from "./client";

// ---- Any logged-in user (role stays "user" until an admin approves) ----

// formData is a FormData: businessName, gstNumber, storeDescription,
// accountHolderName, accountNumber, ifscCode, bankName, bankBranch,
// accountType ("savings" | "current" | "business"), upiId, storeLogo (file)
export const applyForSeller = (formData) =>
  unwrap(
    api.post("/seller/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );

// Returns the caller's own SellerProfile (status: pending | approved | rejected | suspended).
// Throws a 404-backed error if the user has never applied.
export const getMySellerProfile = () => unwrap(api.get("/seller/me"));

// ---- Approved sellers only (role === "seller") ----

// { totalProducts, totalRevenue, totalUnitsSold } — scoped to this seller's own products/orders
export const getSellerAnalytics = () => unwrap(api.get("/seller/analytics"));

