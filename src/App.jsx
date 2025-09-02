// src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout'; // <-- Import layout baru

// Security
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import LoginPage from './pages/LoginPage';
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import PenentuanCutiPage from './pages/admin/PenentuanCutiPage';
import InputLaporanPage from './pages/admin/InputLaporanPage';
import ArsipDokumenPage from './pages/admin/ArsipDokumenPage';
import ManajemenUserPage from './pages/admin/ManajemenUserPage';
import ManajemenAgenPage from './pages/admin/ManajemenAgenPage';
import StrukturOrganisasiPage from './pages/admin/StrukturOrganisasiPage';
import UserDashboard from './pages/user/UserDashboard';

import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Grup Rute Admin */}
      <Route path="/admin/dashboard" element={<AdminLayout><DashboardAdminPage /></AdminLayout>} />
      <Route path="/admin/penentuan-cuti" element={<AdminLayout><PenentuanCutiPage /></AdminLayout>} />
      <Route path="/admin/laporan" element={<AdminLayout><InputLaporanPage /></AdminLayout>} />
      <Route path="/admin/agen" element={<AdminLayout><ManajemenAgenPage /></AdminLayout>} />
      <Route path="/admin/arsip" element={<AdminLayout><ArsipDokumenPage /></AdminLayout>} />
      <Route path="/admin/struktur-organisasi" element={<AdminLayout><StrukturOrganisasiPage /></AdminLayout>} />
      
      {/* Proteksi khusus admin */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <ManajemenUserPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Grup Rute User dengan Layout Baru */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      {/* Tambahkan rute user lainnya di sini dengan UserLayout */}
      {/* Contoh:
      <Route
        path="/user/kalkulator"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserLayout>
              <KalkulatorPage /> 
            </UserLayout>
          </ProtectedRoute>
        }
      />
      */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
export default App;