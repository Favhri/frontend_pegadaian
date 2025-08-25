// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';


// Pages
import LoginPage from './pages/LoginPage';
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import PenentuanCutiPage from './pages/admin/PenentuanCutiPage';
import InputLaporanPage from './pages/admin/InputLaporanPage'; // <-- Import halaman baru
import ArsipDokumenPage from './pages/admin/ArsipDokumenPage';
import ManajemenUserPage from './pages/admin/ManajemenUserPage';
import ManajemenAgenPage from './pages/admin/ManajemenAgenPage';
import StrukturOrganisasiPage from './pages/admin/StrukturOrganisasiPage';

import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute utama dan /login akan menampilkan halaman login */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Grup Rute Admin */}
        <Route path="/admin/dashboard" element={<AdminLayout><DashboardAdminPage /></AdminLayout>} />
        <Route path="/admin/penentuan-cuti" element={<AdminLayout><PenentuanCutiPage /></AdminLayout>} />
        <Route path="/admin/laporan" element={<AdminLayout><InputLaporanPage /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><ManajemenUserPage /></AdminLayout>} />
        <Route path="/admin/agen" element={<AdminLayout><ManajemenAgenPage /></AdminLayout>} />
        {/* Rute baru untuk Arsip Dokumen */}
        <Route path="/admin/arsip" element={<AdminLayout><ArsipDokumenPage /></AdminLayout>} />
        {/* Grup Rute User */}
        {/* <Route path="/user/dashboard" element={<UserLayout><DashboardUserPage /></UserLayout>} /> */}

        {/* Rute untuk halaman Struktur Organisasi */}
        <Route path="/admin/struktur-organisasi" element={<AdminLayout><StrukturOrganisasiPage /></AdminLayout>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
