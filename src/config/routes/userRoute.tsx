import { lazy, type JSX, type LazyExoticComponent } from "react";

const UserRoutes: {
  key: string;
  path: string;
  element: LazyExoticComponent<() => JSX.Element>;
  isProtected?: boolean;
}[] = [
  {
    key: "home",
    path: "/",
    element: lazy(() => import("../../pages/home/HomePage")),
    isProtected: false,
  },
  {
    key: "shop",
    path: "/shop",
    element: lazy(() => import("../../pages/shop/ShopPage")),
    isProtected: false,
  },
  {
    key: "categories",
    path: "/categories",
    element: lazy(() => import("../../pages/shop/CategoriesPage")),
    isProtected: false,
  },
  {
    key: "product",
    path: "/product/:id",
    element: lazy(() => import("../../pages/shop/ProductDetailPage")),
    isProtected: false,
  },
  {
    key: "cart",
    path: "/cart",
    element: lazy(() => import("../../pages/shop/CartPage")),
    isProtected: false,
  },
  {
    key: "wishlist",
    path: "/wishlist",
    element: lazy(() => import("../../pages/shop/WishlistPage")),
    isProtected: false,
  },
  {
    key: "checkout",
    path: "/checkout",
    element: lazy(() => import("../../pages/shop/CheckoutPage")),
    isProtected: true,
  },
  {
    key: "order-success",
    path: "/order-success/:id",
    element: lazy(() => import("../../pages/shop/OrderSuccessPage")),
    isProtected: true,
  },
  {
    key: "orders",
    path: "/orders",
    element: lazy(() => import("../../pages/user/MyOrdersPage")),
    isProtected: true,
  },
  {
    key: "order-detail",
    path: "/orders/:id",
    element: lazy(() => import("../../pages/user/OrderDetailPage")),
    isProtected: true,
  },

  {
    key: "admin-login",
    path: "/admin/login",
    element: lazy(() => import("../../pages/admin/AdminLoginPage")),
  },
  {
    key: "login",
    path: "/login",
    element: lazy(() => import("../../pages/auth/LoginPage")),
  },
  {
    key: "register",
    path: "/register",
    element: lazy(() => import("../../pages/auth/RegisterPage")),
  },
  {
    key: "forgot-password",
    path: "/forgot-password",
    element: lazy(() => import("../../pages/auth/ForgotPasswordPage")),
  },
  {
    key: "reset-password",
    path: "/reset-password/:token",
    element: lazy(() => import("../../pages/auth/ResetPasswordPage")),
  },
  {
    key: "verify-email",
    path: "/verify-email/*",
    element: lazy(() => import("../../pages/auth/VerifyEmailPage")),
  },
];

export default UserRoutes;
