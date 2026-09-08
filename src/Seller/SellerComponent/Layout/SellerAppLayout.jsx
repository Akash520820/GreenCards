import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSellerAuth } from '../../../context/SellerAuthContext';
import SellerSidebar from '../SellerSidebar';
import './SellerAppLayout.css';

const SellerAppLayout = () => {
  const { seller, sellerLogout } = useSellerAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await sellerLogout();
    navigate('/seller/auth');
  };

  return (
    <div className="seller-layout-shell">
      <SellerSidebar />
      <div className="seller-layout-main">
        <header className="seller-layout-topbar">
          <span className="seller-layout-topbar-user">{seller?.fullName || seller?.userName}</span>
          <button className="seller-layout-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <main className="seller-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerAppLayout;
