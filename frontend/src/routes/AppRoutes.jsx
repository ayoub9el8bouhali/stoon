import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MainLayout } from "../layouts/MainLayout.jsx";
import { AuthLayout } from "../layouts/AuthLayout.jsx";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { AdminPanelPage } from "../pages/AdminPanelPage.jsx";
import { CreateListingPage } from "../pages/CreateListingPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import { ListingDetailPage } from "../pages/ListingDetailPage.jsx";
import { ListingsPage } from "../pages/ListingsPage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { MessagesPage } from "../pages/MessagesPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";
import { NotificationsPage } from "../pages/NotificationsPage.jsx";
import { ProfilePage } from "../pages/ProfilePage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { SettingsPage } from "../pages/SettingsPage.jsx";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "admin" ? children : <Navigate to="/dashboard" replace />;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/annonces" element={<ListingsPage />} />
        <Route path="/annonces/:module" element={<ListingsPage />} />
        <Route path="/annonces/:module/:id" element={<ListingDetailPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/creer-annonce" element={<CreateListingPage />} />
        <Route path="/messagerie" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/parametres" element={<SettingsPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanelPage />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
