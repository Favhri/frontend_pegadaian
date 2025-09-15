// src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout'; 
import AgenLayout from './layouts/AgenLayout';

// Security
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages admin
import LoginPage from './pages/LoginPage';
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import PenentuanCutiPage from './pages/admin/PenentuanCutiPage';
import InputLaporanPage from './pages/admin/InputLaporanPage';
import ArsipDokumenPage from './pages/admin/ArsipDokumenPage';
import ManajemenUserPage from './pages/admin/ManajemenUserPage';
import ManajemenAgenPage from './pages/admin/ManajemenAgenPage';
import StrukturOrganisasiPage from './pages/admin/StrukturOrganisasiPage';
import ManajemenPegawaiPage from './pages/admin/ManajemenPegawaiPage';
import LaporanHarianPage from './pages/admin/LaporanHarianPage';
import MonevKpiPage from './pages/admin/MonevKpiPage'; 

// Pages user
import UserDashboard from './pages/user/UserDashboard';
import KalenderCutiPage from './pages/user/KalenderCutiPage';
import ArsipDokumenUserPage from './pages/user/ArsipDokumenUserPage';
import UserMonevOslPage from './pages/user/UserMonevOslPage'; 
import UserMonevKpiPage from './pages/user/UserMonevKpiPage';

// Pages agen 
import AgenDashboardPage from './pages/agen/AgenDashboardPage';
import DaftarAgenPage from './pages/agen/DaftarAgenPage';
import LaporanHarianAgenPage from './pages/agen/LaporanHarianAgenPage';
import LaporanKunjunganPage from './pages/agen/LaporanKunjunganPage';

// error 404
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
      <Route path="/admin/pegawai" element={<AdminLayout><ManajemenPegawaiPage /></AdminLayout>} />
      <Route path="/admin/laporan-harian" element={<AdminLayout><LaporanHarianPage /></AdminLayout>} />
      <Route path="/admin/monev-kpi" element={<AdminLayout><MonevKpiPage /></AdminLayout>} />
      
      
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
      <Route
        path="/user/monev-osl"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <UserLayout>
              <UserMonevOslPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
       <Route
        path="/user/monev-kpi"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <UserLayout>
              <UserMonevKpiPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/kalender-cuti"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}> {/* User dan Admin bisa akses */}
            <UserLayout>
              <KalenderCutiPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/arsip"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <UserLayout>
              <ArsipDokumenUserPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      {/* --- GRUP RUTE UNTUK AGEN --- */}
      <Route
        path="/agen/dashboard"
        element={<ProtectedRoute allowedRoles={["agen"]}><AgenLayout><AgenDashboardPage /></AgenLayout></ProtectedRoute>}
      />
      <Route
        path="/agen/daftar-agen"
        element={<ProtectedRoute allowedRoles={["agen"]}><AgenLayout><DaftarAgenPage /></AgenLayout></ProtectedRoute>}
      />
      <Route
        path="/agen/laporan-harian"
        element={<ProtectedRoute allowedRoles={["agen"]}><AgenLayout><LaporanHarianAgenPage /></AgenLayout></ProtectedRoute>}
      />
      <Route
        path="/agen/laporan-kunjungan"
        element={<ProtectedRoute allowedRoles={["agen"]}><AgenLayout><LaporanKunjunganPage /></AgenLayout></ProtectedRoute>}
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