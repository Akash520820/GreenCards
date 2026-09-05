import api, { unwrap } from "./client";

// creates a Razorpay order for either a single { productId, quantity, variant }
// or (if productId is omitted) the whole current cart
export const createRazorpayOrder = (payload = {}) =>
  unwrap(api.post("/orders/razorpay", payload));

// paymentMethod: "razorpay" | "cod"
// razorpay orders additionally need razorpayOrderId, razorpayPaymentId, razorpaySignature
export const placeOrder = (payload) => unwrap(api.post("/orders", payload));

export const getMyOrders = () => unwrap(api.get("/orders"));

export const getOrderById = (orderId) => unwrap(api.get(`/orders/${orderId}`));

// admin only — returns { orders, pagination }, not a bare array
export const getAllOrders = (params = {}) => unwrap(api.get("/orders/admin/all", { params }));

export const updateOrderStatus = (orderId, orderStatus) =>
  unwrap(api.patch(`/orders/admin/${orderId}/status`, { orderStatus }));
