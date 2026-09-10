import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useClientAuth } from '../../context/ClientAuthContext';
import { useOrders } from '../../context/OrderContext';
import { downloadOrderInvoice } from '../../api/orders.api';
import * as returnsApi from '../../api/returns.api';
import './MyOrders.css';

const STATUS_FILTERS = ['All', 'processing', 'shipped', 'delivered', 'cancelled'];

const MyOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useClientAuth();
  const { orders, fetchUserOrders, loading: ordersLoading } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  // Return Request Modal State
  const [returnOrder, setReturnOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('Defective/Damaged item');
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const loadOrders = useCallback(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

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
      cancelled: '#F44336',
    };
    return colors[status] || '#757575';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnOrder) return;
    setSubmittingReturn(true);
    try {
      await returnsApi.createReturn({
        orderId: returnOrder._id,
        reason: returnReason,
        items: returnOrder.items.map((i) => ({ product: i.product || i._id, quantity: i.quantity })),
      });
      toast.success('Return request submitted successfully!');
      setReturnOrder(null);
    } catch (err) {
      toast.error(err.message || 'Failed to submit return request');
    } finally {
      setSubmittingReturn(false);
    }
  };

  const filteredOrders =
    filterStatus === 'All'
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);

  if (!isAuthenticated) return null;

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
      <Toaster position="top-center" />
      <div className="container">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </p>
        </div>

        <div className="orders-filters">
          {STATUS_FILTERS.map((status) => (
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
                      style={{
                        backgroundColor: `${getStatusColor(order.orderStatus)}20`,
                        color: getStatusColor(order.orderStatus),
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="order-header-right">
                    <p className="order-date">Placed on: {formatDate(order.createdAt)}</p>
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
                      <div className="more-items">+{order.items.length - 3} more</div>
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
                      <span className="info-label">Items</span>
                      <span className="info-value">{order.items.length}</span>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button className="view-details-btn" onClick={() => handleViewDetails(order)}>
                    View Details
                  </button>
                  <button
                    className="view-details-btn"
                    style={{ backgroundColor: '#10b981', color: '#fff', border: 'none' }}
                    onClick={() => downloadOrderInvoice(order._id)}
                  >
                    📄 Invoice PDF
                  </button>
                  {order.orderStatus === 'delivered' && (
                    <button
                      className="view-details-btn"
                      style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none' }}
                      onClick={() => setReturnOrder(order)}
                    >
                      🔄 Request Return
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Return Request Modal */}
        {returnOrder && (
          <div className="modal-overlay" onClick={() => setReturnOrder(null)}>
            <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Request Product Return</h2>
                <button className="modal-close-btn" onClick={() => setReturnOrder(null)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleReturnSubmit} className="modal-body p-4">
                <p>
                  Requesting return for Order <strong>#{returnOrder._id.slice(-8).toUpperCase()}</strong>
                </p>

                <div className="mb-3">
                  <label className="form-label fw-bold">Select Return Reason:</label>
                  <select
                    className="form-select"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                  >
                    <option value="Defective/Damaged item">Defective/Damaged item</option>
                    <option value="Wrong item delivered">Wrong item delivered</option>
                    <option value="Quality not as expected">Quality not as expected</option>
                    <option value="Item no longer needed">Item no longer needed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-warning text-white w-100 rounded-pill py-2"
                  disabled={submittingReturn}
                >
                  {submittingReturn ? 'Submitting Request...' : 'Submit Return Request'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
