import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/dashboard/Profile";
import Wishlist from "./pages/dashboard/Wishlist";
import Cart from "./pages/dashboard/Cart";
import AdminUsers from "./pages/dashboard/admin/Users";
import { AdminProducts } from "./pages/dashboard/admin/Products";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/Navbar";
import { NewProduct } from "./pages/dashboard/admin/newProduct";
import PaymentMethods from "./pages/checkout/PaymentMethod";
import PaymentFrame from "./pages/checkout/PaymentFrame";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen">
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🛡️ Protected Routes */}
            <Route
              element={<ProtectedRoute allowedRoles={["user", "admin"]} />}
            >
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/wishlist" element={<Wishlist />} />
              <Route path="/dashboard/cart" element={<Cart />} />
              <Route path="/checkout/payment" element={<PaymentMethods />} />
              <Route
                path="/payment-frame/:token/:iframeId"
                element={<PaymentFrame />}
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/dashboard/admin/users" element={<AdminUsers />} />
              <Route
                path="/dashboard/admin/products"
                element={<AdminProducts />}
              />
              <Route
                path="/dashboard/admin/add-product"
                element={<NewProduct />}
              />
            </Route>
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;
