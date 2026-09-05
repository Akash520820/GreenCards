// MyOrders.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useClientAuth } from '../../context/ClientAuthContext';
import { useOrders } from '../../context/OrderContext';
import './MyOrders.css';

// Backend orderStatus enum: processing | shipped | delivered | cancelled
const STATUS_FILTERS = ['All', 'processing', 'shipped', 'delivered', 'cancelled'];

const MyOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useClientAuth();
  const { orders, fetchUserOrders, loading: ordersLoading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  const loadOrders = useCallback(() => {
    fetchUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate, loadOrders]);

  const getStatusColor = (status) => {
    const colors = {
      processing: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[status] || '#757575';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleProductClick = (productId, e) => {
    if (e) e.stopPropagation();
    if (productId) navigate(`/product/${productId}`);
  };

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(order => order.orderStatus === filterStatus);

  if (!isAuthenticated) {
    return null;
  }

  if (ordersLoading) {
    return (
      <div className="my-orders-page">
        <div className="container">
          <div className="orders-loading">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <Toaster />
      <div className="container">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </p>
        </div>

        <div className="orders-filters">
          {STATUS_FILTERS.map(status => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="1.5">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <h2>No {filterStatus !== 'All' ? filterStatus : ''} Orders Found</h2>
            <p>You haven't placed any orders yet</p>
            <button className="start-shopping-btn" onClick={() => navigate('/AllProduct')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-header-left">
                    <h3 className="order-id">Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <span 
                      className="order-status"
                      style={{ backgroundColor: `${getStatusColor(order.orderStatus)}20`, color: getStatusColor(order.orderStatus) }}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="order-header-right">
                    <p className="order-date">
                      Placed on: {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div 
                        key={index} 
                        className="order-item-mini"
                        onClick={() => handleProductClick(item.product)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={item.image} alt={item.name} />
                        <div className="item-mini-details">
                          <p className="item-mini-name">{item.name}</p>
                          <p className="item-mini-qty">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>

                  <div className="order-info-grid">
                    <div className="order-info-item">
                      <span className="info-label">Total Amount</span>
                      <span className="info-value">₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="order-info-item">
                      <span className="info-label">Payment Method</span>
                      <span className="info-value">{order.paymentMethod?.toUpperCase()}</span>
                    </div>
                    <div className="order-info-item">
                      <span className="info-label">Payment Status</span>
                      <span className="info-value">{order.paymentStatus}</span>
                    </div>
                    <div className="order-info-item">
                      <span className="info-label">Items</span>
                      <span className="info-value">{order.items.length}</span>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details</h2>
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowDetailsModal(false)}
                  aria-label="Close order details"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="details-section">
                  <div className="section-title-row">
                    <h3>Order Information</h3>
                    <span 
                      className="order-status-badge"
                      style={{ backgroundColor: `${getStatusColor(selectedOrder.orderStatus)}20`, color: getStatusColor(selectedOrder.orderStatus) }}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Order ID:</span>
                      <span className="detail-value">{selectedOrder._id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Order Date:</span>
                      <span className="detail-value">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Method:</span>
                      <span className="detail-value">{selectedOrder.paymentMethod?.toUpperCase()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Status:</span>
                      <span className="detail-value">{selectedOrder.paymentStatus}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Delivery Address</h3>
                  <div className="address-box">
                    <p className="address-name">{selectedOrder.shippingAddress?.fullName}</p>
                    <p className="address-text">
                      {selectedOrder.shippingAddress?.addressLine1}
                      {selectedOrder.shippingAddress?.addressLine2 ? `, ${selectedOrder.shippingAddress.addressLine2}` : ''}
                      , {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                    </p>
                    <p className="address-phone">Phone: {selectedOrder.shippingAddress?.phone}</p>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Items ({selectedOrder.items.length})</h3>
                  <div className="order-items-list">
                    {selectedOrder.items.map((item, index) => (
                      <div 
                        key={index} 
                        className="order-detail-item"
                        onClick={(e) => handleProductClick(item.product, e)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          {item.variant && (item.variant.color || item.variant.size) && (
                            <p className="item-category">
                              {[item.variant.color, item.variant.size].filter(Boolean).join(' / ')}
                            </p>
                          )}
                          <p className="item-quantity">Quantity: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="details-section">
                  <h3>Payment Summary</h3>
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Items Total</span>
                      <span>₹{selectedOrder.itemsPrice?.toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                      <span>Shipping</span>
                      <span className={selectedOrder.shippingPrice ? '' : 'free-text'}>
                        {selectedOrder.shippingPrice ? `₹${selectedOrder.shippingPrice.toFixed(2)}` : 'FREE'}
                      </span>
                    </div>
                    <div className="price-divider"></div>
                    <div className="price-row total-row">
                      <span>Total Amount</span>
                      <span>₹{selectedOrder.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
