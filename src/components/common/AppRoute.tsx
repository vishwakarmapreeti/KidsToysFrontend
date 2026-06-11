import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import UserRoutes from "../../config/routes/userRoute";
import { AdminRoutes } from "../../config/routes/adminRoute";
import AdminLayout from "../layout/AdminLayout";

// Fallback shown while lazy page is loading
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <span className="loader" />
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* ── User routes ──────────────────────────────── */}
      {UserRoutes.map(({ key, path, element: Element, isProtected }) => (
        <Route
          key={key}
          path={path}
          element={
            isProtected ? (
              <ProtectedRoute>
                <Element />
              </ProtectedRoute>
            ) : (
              <Element />
            )
          }
        />
      ))}

      {/* ── Admin routes ─────────────────────────────── */}
      {AdminRoutes.map(({ key, path, element: Element }) => (
        <Route
          key={key}
          path={path}
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Element />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />
      ))}

      {/* ── Admin root redirect ───────────────────────── */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      {/* ── Catch-all ────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
