import React, { useState } from "react";
import { assets } from "../../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import CartBadge from "./CartBadge";
import AuthModal from "../LogInSignIn/AuthModal";
import UserAccountDropdown from "./UserAccountDropdown";
import { useClientAuth } from "../../../context/ClientAuthContext";
import "./Navbar.css";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(null);
  const { isAuthenticated } = useClientAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLoginClick = () => {
    setPendingRedirect(null);
    setShowAuthModal(true);
  };

  const handleMyOrdersClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setPendingRedirect('/my-orders');
      setShowAuthModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    // Clear pending redirect after modal closes if user didn't authenticate
    setTimeout(() => {
      if (!isAuthenticated) {
        setPendingRedirect(null);
      }
    }, 300);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm navbar-container">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src={assets.logo} alt="GreenCards logo" className="navbar-logo" />
            <span className="navbar-brand-text">GreenCards</span>
          </Link>

          {/* Search Bar - Always visible */}
          <SearchBar />

          {/* Hamburger Toggle - Only visible on desktop */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  className={`nav-link navbar-link ${isActive('/') ? 'active' : ''}`} 
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link navbar-link ${isActive('/AllProduct') ? 'active' : ''}`} 
                  to="/AllProduct"
                >
                  All Product
                </Link>
              </li>
              {/* MyOrders Link - Always visible, shows auth modal if not authenticated */}
              <li className="nav-item">
                <Link 
                  className={`nav-link navbar-link ${isActive('/my-orders') ? 'active' : ''}`} 
                  to="/my-orders"
                  onClick={handleMyOrdersClick}
                >
                  My Orders
                </Link>
              </li>
            </ul>

            {/* Desktop Actions */}
            <div className="navbar-actions ms-lg-4">
              <div className="navbar-desktop-cart-login">
                <CartBadge />
                {isAuthenticated ? (
                  <UserAccountDropdown />
                ) : (
                  <button 
                    type="button" 
                    className="btn btn-success navbar-login-btn px-4" 
                    style={{borderRadius:"20px"}}
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        show={showAuthModal} 
        onClose={handleCloseModal}
        redirectTo={pendingRedirect}
      />
    </>
  );
};

export default Navbar;