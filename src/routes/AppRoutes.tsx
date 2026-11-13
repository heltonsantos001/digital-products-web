import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { StoreLayout } from '../layouts/StoreLayout/StoreLayout';
import { AdminLayout } from '../layouts/AdminLayout/AdminLayout';

// Guards
import { AuthGuard } from './guards/AuthGuard';
import { PermissionGuard } from './guards/PermissionGuard';

// Storefront Pages
import { StorePage } from '../pages/storefront/StorePage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';
import { PaymentPage } from '../pages/payment/PaymentPage';
import { CustomerDownloadPage } from '../pages/download/CustomerDownloadPage';

// Admin Auth Pages
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { AdminForgotPasswordPage } from '../pages/auth/AdminForgotPasswordPage';
import { AdminResetPasswordPage } from '../pages/auth/AdminResetPasswordPage';

// Admin Protected Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminDeliveriesPage } from '../pages/admin/AdminDeliveriesPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminAuditPage } from '../pages/admin/AdminAuditPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<StorePage />} />
        <Route path="/produto/:slug" element={<StorePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pagamento/:uuid" element={<PaymentPage />} />
        <Route path="/download/:token" element={<CustomerDownloadPage />} />
      </Route>

      {/* Admin Public Auth Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
      <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

      {/* Admin Protected Routes with RBAC Guards */}
      <Route
        path="/admin"
        element={
          <AuthGuard>
            <AdminLayout />
          </AuthGuard>
        }
      >
        <Route
          index
          element={
            <PermissionGuard permission="reports.view">
              <AdminDashboardPage />
            </PermissionGuard>
          }
        />
        <Route
          path="produtos"
          element={
            <PermissionGuard permission="products.view">
              <AdminProductsPage />
            </PermissionGuard>
          }
        />
        <Route
          path="categorias"
          element={
            <PermissionGuard permission="products.view">
              <AdminCategoriesPage />
            </PermissionGuard>
          }
        />
        <Route
          path="pedidos"
          element={
            <PermissionGuard permission="orders.view">
              <AdminOrdersPage />
            </PermissionGuard>
          }
        />
        <Route
          path="clientes"
          element={
            <PermissionGuard permission="orders.view">
              <AdminCustomersPage />
            </PermissionGuard>
          }
        />
        <Route
          path="entregas"
          element={
            <PermissionGuard permission="deliveries.view">
              <AdminDeliveriesPage />
            </PermissionGuard>
          }
        />
        <Route
          path="usuarios"
          element={
            <PermissionGuard permission="admins.view">
              <AdminUsersPage />
            </PermissionGuard>
          }
        />
        <Route
          path="auditoria"
          element={
            <PermissionGuard permission="audit.view">
              <AdminAuditPage />
            </PermissionGuard>
          }
        />
        <Route
          path="configuracoes"
          element={
            <PermissionGuard permission="settings.manage">
              <AdminSettingsPage />
            </PermissionGuard>
          }
        />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
