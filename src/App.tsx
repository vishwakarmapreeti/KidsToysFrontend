import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectIsAuthenticated } from './store/slices/authSlice';
import { fetchCart, resetCart } from './store/slices/cartSlice';
import { fetchWishlist, resetWishlist } from './store/slices/wishlistSlice';

import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ShopPage from './pages/shop/ShopPage';
import CategoriesPage from './pages/shop/CategoriesPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import WishlistPage from './pages/shop/WishlistPage';
import CartPage from './pages/shop/CartPage';

import AdminLayout from './components/layout/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import CategoriesListPage from './pages/admin/categories/CategoriesListPage';
import CategoryFormPage from './pages/admin/categories/CategoryFormPage';
import ProductsListPage from './pages/admin/products/ProductsListPage';
import ProductFormPage from './pages/admin/products/ProductFormPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderSuccessPage from './pages/shop/OrderSuccessPage';
import MyOrdersPage from './pages/user/MyOrdersPage';
import OrderDetailPage from './pages/user/OrderDetailPage';
import AdminOrdersPage from './pages/admin/orders/AdminOrdersPage';

function SessionDataLoader() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      return;
    }

    dispatch(resetCart());
    dispatch(resetWishlist());
  }, [dispatch, isAuthenticated]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <SessionDataLoader />
            <Routes>
              {/* ── Public routes ──────────────────── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/verify-email/*" element={<VerifyEmailPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:id" element={<OrderSuccessPage />} />
              <Route path="/orders" element={<MyOrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />

              {/* ── Admin routes ───────────────────── */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="categories" element={<CategoriesListPage />} />
                <Route path="categories/add" element={<CategoryFormPage />} />
                <Route path="categories/edit/:id" element={<CategoryFormPage />} />
                <Route path="products" element={<ProductsListPage />} />
                <Route path="products/add" element={<ProductFormPage />} />
                <Route path="products/edit/:id" element={<ProductFormPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
              </Route>

              {/* ── Catch all ──────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
    </BrowserRouter>
  );
}

export default App;
