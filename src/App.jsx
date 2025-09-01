// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';

//security
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import LoginPage from './pages/LoginPage';
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import PenentuanCutiPage from './pages/admin/PenentuanCutiPage';
import InputLaporanPage from './pages/admin/InputLaporanPage'; // <-- Import halaman baru
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
        {/* Proteksi khusus admin */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManajemenUserPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/agen" element={<AdminLayout><ManajemenAgenPage /></AdminLayout>} />
        {/* Rute baru untuk Arsip Dokumen */}
        <Route path="/admin/arsip" element={<AdminLayout><ArsipDokumenPage /></AdminLayout>} />
        {/* Grup Rute User */}
        {/* <Route path="/user/dashboard" element={<UserLayout><DashboardUserPage /></UserLayout>} /> */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Rute untuk halaman Struktur Organisasi */}
        <Route path="/admin/struktur-organisasi" element={<AdminLayout><StrukturOrganisasiPage /></AdminLayout>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    
  );
}
export default App;
