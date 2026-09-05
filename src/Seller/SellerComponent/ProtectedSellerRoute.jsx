import { Navigate } from "react-router-dom";
import { useSellerAuth } from "../../context/SellerAuthContext";

const ProtectedSellerRoute = ({ children }) => {
  const { isSellerAuthenticated, seller, loading } = useSellerAuth();

  // Show loading state while checking authentication
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

  // Check if seller is authenticated
  if (!isSellerAuthenticated) {
    console.log("Seller not authenticated, redirecting to seller auth");
    return <Navigate to="/seller/auth" replace />;
  }

  // Check if user has admin-level access (the real backend has no separate
  // "seller" role — the seller panel is really an admin/superadmin panel)
  if (seller?.role !== "admin" && seller?.role !== "superadmin") {
    console.log("User does not have admin access, redirecting to seller auth");
    return <Navigate to="/seller/auth" replace />;
  }

  // Seller is authenticated
  return children;
};

export default ProtectedSellerRoute;