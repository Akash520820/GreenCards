import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiUsers,
  FiShield,
  FiPackage,
  FiGrid,
  FiShoppingBag,
  FiRotateCcw,
  FiDollarSign,
  FiAlertTriangle,
  FiUserCheck,
  FiUserX,
  FiArrowUp,
  FiArrowDown,
  FiClock,
} from 'react-icons/fi';
import * as adminApi from '../../api/admin.api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './SuperAdminDashboard.css';

const PAGE_SIZE = 10;

const SuperAdminDashboard = () => {
  const { admin } = useAdminAuth();

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [usersLoading, setUsersLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');
  const [actioningId, setActioningId] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setDashboardLoading(true);
      const res = await adminApi.getFullDashboard();
      setDashboard(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load dashboard');
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async (page = 1) => {
    try {
      setUsersLoading(true);
      const res = await adminApi.getAllUsers({ page, limit: PAGE_SIZE });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    loadUsers(1);
  }, [loadDashboard, loadUsers]);

  const handlePromote = async (userId, userName) => {
    setActioningId(userId);
    try {
      await adminApi.updateAdminRole(userId, 'admin');
      toast.success(`${userName} promoted to Admin`);
      loadUsers(pagination.page);
      loadDashboard();
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    } finally {
      setActioningId(null);
    }
  };

  const handleDemote = async (userId, userName) => {
    setActioningId(userId);
    try {
      await adminApi.updateAdminRole(userId, 'user');
      toast.success(`${userName} demoted to regular user`);
      loadUsers(pagination.page);
      loadDashboard();
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    } finally {
      setActioningId(null);
    }
  };

  const handleToggleActive = async (userId, userName, isActive) => {
    setActioningId(userId);
    try {
      await adminApi.toggleUserActive(userId);
      toast.success(`${userName} ${isActive ? 'deactivated' : 'activated'}`);
      loadUsers(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to update account status');
    } finally {
      setActioningId(null);
    }
  };

  const filteredUsers = roleFilter === 'All'
    ? users
    : users.filter((u) => u.role === roleFilter);

  const statusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  if (dashboardLoading) {
    return (
      <div className="superadmin-loading">
        <div className="spinner"></div>
        <p>Loading platform overview...</p>
      </div>
    );
  }

  return (
    <div className="superadmin-page">
      <Toaster position="top-center" />

      <div className="superadmin-header">
        <div className="superadmin-header-icon"><FiShield /></div>
        <div>
          <h1 className="superadmin-title">Super Admin</h1>
          <p className="superadmin-subtitle">
            Full platform control — {admin?.fullName || admin?.userName}, you decide who gets admin power.
          </p>
        </div>
      </div>

      {/* Platform-wide stats */}
      <div className="superadmin-stats-grid">
        <div className="superadmin-stat-card">
          <div className="superadmin-stat-icon users"><FiUsers /></div>
          <div>
            <h3>{dashboard.totalUsers}</h3>
            <p>Customers</p>
          </div>
        </div>
        <div className="superadmin-stat-card">
          <div className="superadmin-stat-icon admins"><FiShield /></div>
          <div>
            <h3>{dashboard.totalAdmins}</h3>
            <p>Admins & Super Admins</p>
          </div>
        </div>
        <div className="superadmin-stat-card">
          <div className="superadmin-stat-icon products"><FiPackage /></div>
          <div>
            <h3>{dashboard.totalProducts}</h3>
            <p>Products</p>
          </div>
        </div>
        <div className="superadmin-stat-card">
          <div className="superadmin-stat-icon categories"><FiGrid /></div>
          <div>
            <h3>{dashboard.totalCategories}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div className="superadmin-stat-card">
          <div className="superadmin-stat-icon orders"><FiShoppingBag /></div>
          <div>
            <h3>{dashboard.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="superadmin-stat-card">
          <div className="superadmin-stat-icon returns"><FiRotateCcw /></div>
          <div>
            <h3>{dashboard.totalReturns}</h3>
            <p>Total Returns</p>
          </div>
        </div>
        <div className="superadmin-stat-card">
          <div className="superadmin-stat-icon revenue"><FiDollarSign /></div>
          <div>
            <h3>₹{dashboard.totalRevenue.toLocaleString()}</h3>
            <p>Revenue (paid orders)</p>
          </div>
        </div>
        <div className="superadmin-stat-card">
          <div className="superadmin-stat-icon pending"><FiClock /></div>
          <div>
            <h3>{dashboard.pendingReturnsCount}</h3>
            <p>Returns Awaiting Review</p>
          </div>
        </div>
      </div>

      {/* Orders / Returns breakdown */}
      <div className="superadmin-breakdown-row">
        <div className="superadmin-breakdown-card">
          <h3 className="superadmin-breakdown-title">Orders by Status</h3>
          <div className="superadmin-breakdown-list">
            {dashboard.ordersByStatus.length === 0 && <p className="superadmin-empty-note">No orders yet</p>}
            {dashboard.ordersByStatus.map((item) => (
              <div key={item._id} className="superadmin-breakdown-item">
                <span className={`superadmin-status-dot status-${item._id}`}></span>
                <span className="superadmin-breakdown-label">{statusLabel(item._id)}</span>
                <span className="superadmin-breakdown-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="superadmin-breakdown-card">
          <h3 className="superadmin-breakdown-title">Returns by Status</h3>
          <div className="superadmin-breakdown-list">
            {dashboard.returnsByStatus.length === 0 && <p className="superadmin-empty-note">No returns yet</p>}
            {dashboard.returnsByStatus.map((item) => (
              <div key={item._id} className="superadmin-breakdown-item">
                <span className={`superadmin-status-dot status-${item._id}`}></span>
                <span className="superadmin-breakdown-label">{statusLabel(item._id)}</span>
                <span className="superadmin-breakdown-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low stock alert */}
      {dashboard.lowStockProducts.length > 0 && (
        <div className="superadmin-lowstock-banner">
          <FiAlertTriangle />
          <span>
            {dashboard.lowStockProducts.length} product{dashboard.lowStockProducts.length > 1 ? 's' : ''} running low on stock:
            {' '}
            {dashboard.lowStockProducts.slice(0, 5).map((p) => p.name).join(', ')}
            {dashboard.lowStockProducts.length > 5 ? ', ...' : ''}
          </span>
        </div>
      )}

      {/* User & Admin management */}
      <div className="superadmin-users-section">
        <div className="superadmin-users-header">
          <h2 className="section-title">Manage Users &amp; Admin Access</h2>
          <div className="superadmin-role-filter">
            {['All', 'user', 'admin', 'superadmin'].map((r) => (
              <button
                key={r}
                className={`superadmin-filter-btn ${roleFilter === r ? 'active' : ''}`}
                onClick={() => setRoleFilter(r)}
              >
                {r === 'All' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {usersLoading ? (
          <div className="superadmin-loading" style={{ minHeight: '200px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="superadmin-users-table-wrapper">
              <table className="superadmin-users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>{u.fullName || u.userName}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`superadmin-role-badge role-${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        <span className={`superadmin-active-badge ${u.isActive ? 'active' : 'inactive'}`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td>
                        <div className="superadmin-row-actions">
                          {u.role === 'superadmin' ? (
                            <span className="superadmin-protected-note">Protected</span>
                          ) : (
                            <>
                              {u.role === 'user' ? (
                                <button
                                  className="superadmin-action-btn promote"
                                  disabled={actioningId === u._id}
                                  onClick={() => handlePromote(u._id, u.fullName || u.userName)}
                                >
                                  <FiArrowUp /> Make Admin
                                </button>
                              ) : (
                                <button
                                  className="superadmin-action-btn demote"
                                  disabled={actioningId === u._id}
                                  onClick={() => handleDemote(u._id, u.fullName || u.userName)}
                                >
                                  <FiArrowDown /> Remove Admin
                                </button>
                              )}
                              <button
                                className={`superadmin-action-btn ${u.isActive ? 'deactivate' : 'activate'}`}
                                disabled={actioningId === u._id}
                                onClick={() => handleToggleActive(u._id, u.fullName || u.userName, u.isActive)}
                              >
                                {u.isActive ? <FiUserX /> : <FiUserCheck />}
                                {u.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="superadmin-pagination">
              <button
                disabled={pagination.page <= 1}
                onClick={() => loadUsers(pagination.page - 1)}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} total users
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadUsers(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
