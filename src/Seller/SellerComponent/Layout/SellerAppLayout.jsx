import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSellerAuth } from '../../../context/SellerAuthContext';
import './SellerAppLayout.css';

// Deliberately minimal for now — just a top bar + logout. The real
// products/orders/analytics/reviews pages (scoped to /seller/* endpoints)
// are a separate, not-yet-built piece of work.
const SellerAppLayout = () => {
  const { seller, sellerLogout } = useSellerAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await sellerLogout();
    navigate('/seller/auth');
  };

  return (
    <div className="seller-layout-wrapper">
      <header className="seller-layout-topbar">
        <span className="seller-layout-brand">
          <span className="text-success">Green</span>Cards Seller
        </span>
        <div className="seller-layout-user">
          <span>{seller?.fullName || seller?.userName}</span>
          <button className="seller-layout-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="seller-layout-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerAppLayout;
