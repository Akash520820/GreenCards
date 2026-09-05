import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authApi from '../api/auth.api';

const SellerAuthContext = createContext();

// NOTE ON THIS FILE:
// The real backend has no separate "seller" entity — only User.role of
// "user" | "admin" | "superadmin". The Seller section of this app (dashboard,
// inventory, orders, analytics) is really an admin panel, so logging in here
// just calls the normal /users/login endpoint and requires the account's
// role to be "admin" or "superadmin". New admin accounts can't be
// self-registered — a superadmin has to promote an existing user via
// /api/v1/superadmin/users/:userId/role — so sellerSignup is intentionally
// left disabled below, same as it was in the original hardcoded version.

export const SellerAuthProvider = ({ children }) => {
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.getCurrentUser();
        if (res.data.role === 'admin' || res.data.role === 'superadmin') {
          setSeller(res.data);
          setIsSellerAuthenticated(true);
        }
      } catch {
        // not logged in — fine, just stay logged out
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const sellerLogin = async (email, password) => {
    try {
      const isEmail = email.includes('@');
      const res = await authApi.loginUser({
        email: isEmail ? email : undefined,
        userName: isEmail ? undefined : email,
        password,
      });

      const loggedInUser = res.data.user;
      if (loggedInUser.role !== 'admin' && loggedInUser.role !== 'superadmin') {
        return {
          success: false,
          error: 'This account does not have admin access. Ask a super admin to grant it.',
        };
      }

      setSeller(loggedInUser);
      setIsSellerAuthenticated(true);
      return { success: true, seller: loggedInUser };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed. Please try again.' };
    }
  };

  // Admin accounts can only be granted by a super admin — see note above.
  const sellerSignup = async () => {
    return {
      success: false,
      error:
        'Self-service admin signup is not available. Create a regular account from the storefront, then have a super admin grant it admin access.',
    };
  };

  const sellerLogout = async () => {
    try {
      await authApi.logoutUser();
    } catch {
      // clear local state regardless
    }
    setSeller(null);
    setIsSellerAuthenticated(false);
  };

  const value = {
    isSellerAuthenticated,
    seller,
    loading,
    sellerLogin,
    sellerSignup,
    sellerLogout,
  };

  return (
    <SellerAuthContext.Provider value={value}>
      {!loading && children}
    </SellerAuthContext.Provider>
  );
};

export const useSellerAuth = () => {
  const context = useContext(SellerAuthContext);
  if (!context) {
    throw new Error('useSellerAuth must be used within SellerAuthProvider');
  }
  return context;
};

export default SellerAuthContext;
