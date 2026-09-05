import { Navigate } from "react-router-dom";
import { useSellerAuth } from "../../context/SellerAuthContext";

// Use this INSIDE the already admin-gated /seller routes (ProtectedSellerRoute
// already confirmed the user is at least an admin) to further restrict a
// page to superadmin only — e.g. the Super Admin dashboard.
const ProtectedSuperAdminRoute = ({ children }) => {
  const { seller, loading } = useSellerAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading…
      </div>
    );
  }

  if (seller?.role !== "superadmin") {
    return <Navigate to="/seller/dashboard" replace />;
  }

  return children;
};

export default ProtectedSuperAdminRoute;
