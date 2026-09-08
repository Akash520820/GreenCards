// App.tsx
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';

// Authentication Contexts
import { ClientAuthProvider } from './context/ClientAuthContext';
import { SellerAuthProvider } from './context/SellerAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';

// Client Layout & Pages
import ClientAppLayout from './Client/ClientsComponent/Layout/ClientAppLayout';
import Home from './Client/ClientPages/Home';
import AllProduct from './Client/ClientPages/AllProducts';
import FlashSale from './Client/ClientPages/FlashSale';
import ProductDetails from './Client/ClientPages/ProductDetails';
import MyOrders from './Client/ClientPages/MyOrders';
import Cart from './Client/ClientPages/Cart';
import Contact from './Client/ClientPages/Contact';
import BecomeSeller from './Client/ClientPages/BecomeSeller';

// Seller Layout & Pages (role === "seller" only)
import SellerAppLayout from './Seller/SellerComponent/Layout/SellerAppLayout';
import SellerDashboard from './Seller/SellerPages/SellerDashboard';
import SellerProducts from './Seller/SellerPages/SellerProducts';
import SellerProductForm from './Seller/SellerPages/SellerProductForm';
import SellerOrders from './Seller/SellerPages/SellerOrders';
import SellerReviews from './Seller/SellerPages/SellerReviews';
import SellerAuthPage from './Seller/SellerPages/SellerAuthPage';
import ProtectedSellerRoute from './Seller/SellerComponent/ProtectedSellerRoute';

// Admin Layout & Pages (role === "admin" or "superadmin" only)
import AdminAppLayout from './Admin/AdminComponent/Layout/AdminAppLayout';
import AdminDashboard from './Admin/AdminPages/AdminDashboard';
import OrderSection from './Admin/AdminPages/OrderSection';
import AddProduct from './Admin/AdminPages/AddProduct';
import ManageInventory from './Admin/AdminPages/ManageInventory';
import SalesAnalytics from './Admin/AdminPages/SalesAnalytics';
import SuperAdminDashboard from './Admin/AdminPages/SuperAdminDashboard';
import AdminAuthPage from './Admin/AdminPages/AdminAuthPage';
import ProtectedAdminRoute from './Admin/AdminComponent/ProtectedAdminRoute';
import ProtectedSuperAdminRoute from './Admin/AdminComponent/ProtectedSuperAdminRoute';

// Get base URL for GitHub Pages
const basename = import.meta.env.BASE_URL;

const router = createBrowserRouter([
  // CLIENT ROUTES
  {
    path: "/",
    element: <ClientAppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/AllProduct", element: <AllProduct /> },
      { path: "/flash-sale", element: <FlashSale /> },
      { path: "/product/:productId", element: <ProductDetails /> },
      { path: "/cart", element: <Cart /> },
      { path: "/my-orders", element: <MyOrders /> },
      { path: "/contact", element: <Contact /> },
      { path: "/become-seller", element: <BecomeSeller /> },
    ],
  },

  // SELLER AUTH ROUTE (Public - Login only; role "seller" is granted by an
  // admin approving a /seller/apply application, never by self-signup)
  {
    path: "/seller/auth",
    element: <SellerAuthPage />,
  },

  // SELLER ROUTES (Protected — role "seller" only)
  {
    path: "/seller",
    element: (
      <ProtectedSellerRoute>
        <SellerAppLayout />
      </ProtectedSellerRoute>
    ),
    children: [
      { path: "/seller", element: <Navigate to="/seller/dashboard" replace /> },
      { path: "/seller/dashboard", element: <SellerDashboard /> },
      { path: "/seller/products", element: <SellerProducts /> },
      { path: "/seller/products/new", element: <SellerProductForm /> },
      { path: "/seller/products/:productId/edit", element: <SellerProductForm /> },
      { path: "/seller/orders", element: <SellerOrders /> },
      { path: "/seller/reviews", element: <SellerReviews /> },
    ],
  },

  // ADMIN AUTH ROUTE (Public - Login only; admin access is granted by a
  // superadmin, never by self-signup)
  {
    path: "/admin/auth",
    element: <AdminAuthPage />,
  },

  // ADMIN ROUTES (Protected — role "admin" or "superadmin")
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <AdminAppLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      { path: "/admin", element: <Navigate to="/admin/dashboard" replace /> },
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/orders", element: <OrderSection /> },
      { path: "/admin/add-product", element: <AddProduct /> },
      { path: "/admin/inventory", element: <ManageInventory /> },
      { path: "/admin/analytics", element: <SalesAnalytics /> },
      {
        path: "/admin/superadmin",
        element: (
          <ProtectedSuperAdminRoute>
            <SuperAdminDashboard />
          </ProtectedSuperAdminRoute>
        ),
      },
    ],
  },
], {
  basename: basename,
});

function App() {
  return (
    <ClientAuthProvider>
      <SellerAuthProvider>
        <AdminAuthProvider>
          <ProductProvider>
            <OrderProvider>
              <CartProvider>
                <RouterProvider router={router} />
              </CartProvider>
            </OrderProvider>
          </ProductProvider>
        </AdminAuthProvider>
      </SellerAuthProvider>
    </ClientAuthProvider>
  );
}

export default App;
