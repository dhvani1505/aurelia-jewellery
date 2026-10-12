
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Account from "./pages/Account";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";

// =========================================
// PUBLIC LAYOUT
// =========================================

function PublicLayout() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </>
  );
}

// =========================================
// APP CONTENT
// =========================================

function AppContent() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return isAdminRoute ? (
    <Routes>
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="products"
          element={<AdminProducts />}
        />

        <Route
          path="products/new"
          element={<AddProduct />}
        />

        <Route
          path="products/:id/edit"
          element={<EditProduct />}
        />

        <Route
          path="categories"
          element={<AdminCategories />}
        />

        <Route
          path="orders"
          element={<AdminOrders />}
        />

        <Route
          path="customers"
          element={<AdminCustomers />}
        />
      </Route>
    </Routes>
  ) : (
    <PublicLayout />
  );
}

// =========================================
// MAIN APP
// =========================================

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
