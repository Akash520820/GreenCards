// App.tsx - Fixed Sales Analytics Route
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';

// Authentication Contexts
import { ClientAuthProvider } from './context/ClientAuthContext';
import { SellerAuthProvider } from './context/SellerAuthContext';
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

// Seller Layout & Pages
import SellerAppLayout from './Seller/SellerComponent/Layout/SellerAppLayout';
import SellerDashboard from './Seller/SellerPages/SellerDashboard';
import OrderSection from './Seller/SellerPages/OrderSection';
import AddProduct from './Seller/SellerPages/AddProduct';
import ManageInventory from './Seller/SellerPages/ManageInventory';
import SalesAnalytics from './Seller/SellerPages/SalesAnalytics';
import SuperAdminDashboard from './Seller/SellerPages/SuperAdminDashboard';

// Seller Auth Page
import SellerAuthPage from './Seller/SellerPages/SellerAuthPage';

// Protected Route Components for Seller
import ProtectedSellerRoute from './Seller/SellerComponent/ProtectedSellerRoute';
import ProtectedSuperAdminRoute from './Seller/SellerComponent/ProtectedSuperAdminRoute';

// Get base URL for GitHub Pages
const basename = import.meta.env.BASE_URL;

const router = createBrowserRouter([
  // CLIENT ROUTES
  {
    path: "/",
    element: <ClientAppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/AllProduct",
        element: <AllProduct />,
      },
      {
        path: "/flash-sale",
        element: <FlashSale />,
      },
      {
        path: "/product/:productId",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/my-orders",
        element: <MyOrders />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/become-seller",
        element: <BecomeSeller />,
      },
    ],
  },

  // SELLER AUTH ROUTE (Public - Login/Signup)
  {
    path: "/seller/auth",
    element: <SellerAuthPage />,
  },

  // SELLER ROUTES (Protected)
  {
    path: "/seller",
    element: (
      <ProtectedSellerRoute>
        <SellerAppLayout />
      </ProtectedSellerRoute>
    ),
    children: [
      {
        path: "/seller",
        element: <Navigate to="/seller/dashboard" replace />,
      },
      {
        path: "/seller/dashboard",
        element: <SellerDashboard />,
      },
      {
        path: "/seller/orders",
        element: <OrderSection />,
      },
      {
        path: "/seller/add-product",
        element: <AddProduct />,
      },
      {
        path: "/seller/inventory",
        element: <ManageInventory />,
      },
      {
        path: "/seller/analytics",
        element: <SalesAnalytics />,
      },
      {
        path: "/seller/superadmin",
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
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </SellerAuthProvider>
    </ClientAuthProvider>
  );
}

export default App;