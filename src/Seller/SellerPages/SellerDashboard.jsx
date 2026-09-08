// SellerDashboard.jsx
// A real, correctly-scoped seller dashboard: it only ever calls /seller/me
// and /seller/analytics, both of which the backend scopes to the logged-in
// seller's own data (seller.controller.js). Product/order management,
// inventory, and review responses are a separate, not-yet-built piece —
// this page is intentionally just a status + numbers view for now.
import React, { useState, useEffect } from 'react';
import { useSellerAuth } from '../../context/SellerAuthContext';
import * as sellerApi from '../../api/seller.api';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { seller } = useSellerAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileRes, statsRes] = await Promise.all([
          sellerApi.getMySellerProfile(),
          sellerApi.getSellerAnalytics(),
        ]);
        setProfile(profileRes.data);
        setStats(statsRes.data);
      } catch (err) {
        setError(err.message || 'Failed to load your dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="seller-dashboard-loading">Loading your dashboard…</div>;
  }

  return (
    <div className="seller-dashboard">
      <h1>Welcome, {seller?.fullName || seller?.userName}</h1>
      {profile && <p className="seller-dashboard-subtitle">{profile.businessName}</p>}

      {error && <p className="seller-dashboard-error">{error}</p>}

      {stats && (
        <div className="seller-stat-grid">
          <div className="seller-stat-card">
            <span className="seller-stat-label">Total Products</span>
            <span className="seller-stat-value">{stats.totalProducts}</span>
          </div>
          <div className="seller-stat-card">
            <span className="seller-stat-label">Total Revenue</span>
            <span className="seller-stat-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="seller-stat-card">
            <span className="seller-stat-label">Units Sold</span>
            <span className="seller-stat-value">{stats.totalUnitsSold}</span>
          </div>
        </div>
      )}

      <div className="seller-dashboard-notice">
        Product listing, order management, and review tools are coming soon to this panel.
      </div>
    </div>
  );
};

export default SellerDashboard;
