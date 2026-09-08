import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authApi from '../api/auth.api';

const SellerAuthContext = createContext();

// Login for the "seller" role only. A user becomes a seller by applying
// through /become-seller and being approved by an admin (see
// admin.controller.js -> approveSeller) — there is no seller signup here.
// Staff accounts (admin/superadmin) have their own AdminAuthContext.

export const SellerAuthProvider = ({ children }) => {
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.getCurrentUser();
        if (res.data.role === 'seller') {
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
      if (loggedInUser.role !== 'seller') {
        return {
          success: false,
          error:
            loggedInUser.role === 'user'
              ? "This account isn't an approved seller yet. Apply from your account menu, or check your application status."
              : 'This account does not have seller access.',
        };
      }

      setSeller(loggedInUser);
      setIsSellerAuthenticated(true);
      return { success: true, seller: loggedInUser };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed. Please try again.' };
    }
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
