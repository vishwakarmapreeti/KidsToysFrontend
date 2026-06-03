import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }     from './context/AuthContext';
import { CartProvider }     from './context/CartContext';      // ✅ add
import { WishlistProvider } from './context/WishlistContext';  // ✅ add

import HomePage           from './pages/home/HomePage';
import LoginPage          from './pages/auth/LoginPage';
import RegisterPage       from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyEmailPage    from './pages/auth/VerifyEmailPage';
import ResetPasswordPage  from './pages/auth/ResetPasswordPage';
import ShopPage           from './pages/shop/ShopPage';
import CategoriesPage     from './pages/shop/CategoriesPage';
import ProductDetailPage  from './pages/shop/ProductDetailPage';
import WishlistPage       from './pages/shop/WishlistPage';
import CartPage           from './pages/shop/CartPage';

import AdminLayout        from './components/layout/AdminLayout';
import DashboardPage      from './pages/admin/DashboardPage';
import CategoriesListPage from './pages/admin/categories/CategoriesListPage';
import CategoryFormPage   from './pages/admin/categories/CategoryFormPage';
import ProductsListPage   from './pages/admin/products/ProductsListPage';
import ProductFormPage    from './pages/admin/products/ProductFormPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>        {/* ✅ add */}
          <WishlistProvider>  {/* ✅ add */}
            <Routes>
              {/* ── Public routes ──────────────────── */}
              <Route path="/"                      element={<HomePage />} />
              <Route path="/login"                 element={<LoginPage />} />
              <Route path="/register"              element={<RegisterPage />} />
              <Route path="/forgot-password"       element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/verify-email/*"        element={<VerifyEmailPage />} />
              <Route path="/shop"                  element={<ShopPage />} />
              <Route path="/categories"            element={<CategoriesPage />} />
              <Route path="/product/:id"           element={<ProductDetailPage />} />
              <Route path="/cart"                  element={<CartPage />} />
              <Route path="/wishlist"              element={<WishlistPage />} />

              {/* ── Admin routes ───────────────────── */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard"            element={<DashboardPage />} />
                <Route path="categories"           element={<CategoriesListPage />} />
                <Route path="categories/add"       element={<CategoryFormPage />} />
                <Route path="categories/edit/:id"  element={<CategoryFormPage />} />
                <Route path="products"             element={<ProductsListPage />} />
                <Route path="products/add"         element={<ProductFormPage />} />
                <Route path="products/edit/:id"    element={<ProductFormPage />} />
              </Route>

              {/* ── Catch all ──────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
