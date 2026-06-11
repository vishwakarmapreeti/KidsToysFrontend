import { lazy, type JSX, type LazyExoticComponent } from "react";

export const AdminRoutes: {
  key: string;
  path: string;
  element: LazyExoticComponent<() => JSX.Element>;
}[] = [
  {
    key: "admin",
    path: "/admin/dashboard",
    element: lazy(() => import("../../pages/admin/DashboardPage")),
  },
  {
    key: "admin-orders",
    path: "/admin/orders",
    element: lazy(() => import("../../pages/admin/orders/AdminOrdersPage")),
  },
  {
    key: "admin-products",
    path: "/admin/products",
    element: lazy(() => import("../../pages/admin/products/ProductsListPage")),
  },
  {
    key: "admin-products",
    path: "/admin/products/add",
    element: lazy(() => import("../../pages/admin/products/ProductFormPage")),
  },
  {
    key: "admin-products",
    path: "/admin/products/edit/:id",
    element: lazy(() => import("../../pages/admin/products/ProductFormPage")),
  },
  {
    key: "admin-categories",
    path: "/admin/categories",
    element: lazy(
      () => import("../../pages/admin/categories/CategoriesListPage"),
    ),
  },
  {
    key: "admin-categories",
    path: "/admin/categories/add",
    element: lazy(
      () => import("../../pages/admin/categories/CategoryFormPage"),
    ),
  },
  {
    key: "admin-categories",
    path: "/admin/categories/edit/:id",
    element: lazy(
      () => import("../../pages/admin/categories/CategoryFormPage"),
    ),
  },
  {
    key: "orders",
    path: "/admin/orders",
    element: lazy(() => import("../../pages/admin/orders/AdminOrdersPage")),
  },
  {
    key: "users",
    path: "/admin/orders/:id",
    element: lazy(() => import("../../pages/admin/orders/AdminOrderDetailPage")),
  },
];