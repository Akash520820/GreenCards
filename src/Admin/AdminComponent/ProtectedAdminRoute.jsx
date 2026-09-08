import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

// Gates the /admin/* panel to staff accounts (role "admin" or "superadmin").
// Real sellers (role "seller") are a completely separate panel — see
// Seller/SellerComponent/ProtectedSellerRoute.jsx.
const ProtectedAdminRoute = ({ children }) => {
  const { isAdminAuthenticated, admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading…
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/auth" replace />;
  }

  if (admin?.role !== "admin" && admin?.role !== "superadmin") {
    return <Navigate to="/admin/auth" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
