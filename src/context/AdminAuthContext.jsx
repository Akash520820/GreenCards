import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authApi from '../api/auth.api';

const AdminAuthContext = createContext();

// This is the login for STAFF accounts — role "admin" or "superadmin".
// It has nothing to do with the "seller" role; sellers have their own
// SellerAuthContext. Admin accounts can't be self-registered — a
// superadmin has to promote an existing user via
// PATCH /api/v1/superadmin/users/:userId/role — so signup is intentionally
// left disabled below.

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.getCurrentUser();
        if (res.data.role === 'admin' || res.data.role === 'superadmin') {
          setAdmin(res.data);
          setIsAdminAuthenticated(true);
        }
      } catch {
        // not logged in — fine, just stay logged out
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const adminLogin = async (email, password) => {
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

      setAdmin(loggedInUser);
      setIsAdminAuthenticated(true);
      return { success: true, admin: loggedInUser };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed. Please try again.' };
    }
  };

  // Admin accounts can only be granted by a super admin — see note above.
  const adminSignup = async () => {
    return {
      success: false,
      error:
        'Self-service admin signup is not available. Create a regular account from the storefront, then have a super admin grant it admin access.',
    };
  };

  const adminLogout = async () => {
    try {
      await authApi.logoutUser();
    } catch {
      // clear local state regardless
    }
    setAdmin(null);
    setIsAdminAuthenticated(false);
  };

  const value = {
    isAdminAuthenticated,
    admin,
    loading,
    adminLogin,
    adminSignup,
    adminLogout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {!loading && children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
