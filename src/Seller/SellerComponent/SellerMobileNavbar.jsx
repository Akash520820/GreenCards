import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { 
  MdDashboard, 
  MdInventory, 
  MdAddCircle, 
  MdShoppingCart, 
  MdAccountCircle,
  MdLogout,
  MdAdminPanelSettings
} from 'react-icons/md';
import './SellerMobileNavbar.css';

const SellerMobileNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderStats } = useOrders();
  const { products } = useProducts();
  const { seller, sellerLogout } = useSellerAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const isSuperAdmin = seller?.role === 'superadmin';
  const displayName = seller?.fullName || seller?.userName || 'Admin';
  
  const orderStats = getOrderStats();
  const pendingOrdersCount = orderStats.pendingOrders;

  const isActive = (path) => location.pathname === path;

  // 👇 Close account menu on window resize (fixes the bug)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991.98) {
        setShowAccountMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 👇 Close menu on route change
  useEffect(() => {
    setShowAccountMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setShowAccountMenu(false);
    sellerLogout();
    navigate('/seller/auth');
  };

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  return (
    <>
      {/* Account Dropdown Menu */}
      {showAccountMenu && (
        <>
          <div 
            className="seller-mobile-overlay" 
            onClick={() => setShowAccountMenu(false)}
          />
          <div className="seller-mobile-account-menu">
            <div className="seller-account-header">
              <div className="seller-account-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="seller-account-info">
                <div className="seller-account-name">{displayName}</div>
                <div className="seller-account-email">{seller?.email}</div>
              </div>
            </div>
            
            <div className="seller-account-divider"></div>
            
            {isSuperAdmin && (
              <Link
                to="/seller/superadmin"
                className="seller-account-menu-item"
                onClick={() => setShowAccountMenu(false)}
              >
                <MdAdminPanelSettings className="seller-account-menu-icon" />
                <span>Super Admin</span>
              </Link>
            )}

            <button 
              className="seller-account-menu-item"
              onClick={handleLogout}
            >
              <MdLogout className="seller-account-menu-icon" />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <nav className="seller-mobile-navbar">
        <Link 
          to="/seller/dashboard" 
          className={`seller-mobile-nav-item ${isActive('/seller/dashboard') ? 'active' : ''}`}
        >
          <div className="seller-mobile-nav-icon">
            <MdDashboard />
          </div>
          <span className="seller-mobile-nav-label">Dashboard</span>
        </Link>

        <Link 
          to="/seller/inventory" 
          className={`seller-mobile-nav-item ${isActive('/seller/inventory') ? 'active' : ''}`}
        >
          <div className="seller-mobile-nav-icon">
            <MdInventory />
            {products.length > 0 && (
              <span className="seller-mobile-nav-badge">{products.length}</span>
            )}
          </div>
          <span className="seller-mobile-nav-label">Products</span>
        </Link>

        <Link 
          to="/seller/add-product" 
          className={`seller-mobile-nav-item ${isActive('/seller/add-product') ? 'active' : ''}`}
        >
          <div className="seller-mobile-nav-icon">
            <MdAddCircle />
          </div>
          <span className="seller-mobile-nav-label">Add Product</span>
        </Link>

        <Link 
          to="/seller/orders" 
          className={`seller-mobile-nav-item ${isActive('/seller/orders') ? 'active' : ''}`}
        >
          <div className="seller-mobile-nav-icon">
            <MdShoppingCart />
            {pendingOrdersCount > 0 && (
              <span className="seller-mobile-nav-badge seller-mobile-nav-badge-warning">
                {pendingOrdersCount}
              </span>
            )}
          </div>
          <span className="seller-mobile-nav-label">Orders</span>
        </Link>

        <button 
          className="seller-mobile-nav-item"
          onClick={toggleAccountMenu}
        >
          <div className="seller-mobile-nav-icon">
            <MdAccountCircle />
          </div>
          <span className="seller-mobile-nav-label">Account</span>
        </button>
      </nav>
    </>
  );
};

export default SellerMobileNavbar;