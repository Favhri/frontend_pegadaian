// src/pages/agen/AgenDashboardPage.jsx
import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const AgenDashboardPage = () => {
  const userName = JSON.parse(localStorage.getItem('user'))?.nama_lengkap || 'Agen';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Halo, {userName}!</h1>
        <p className="text-lg">Selamat datang di Dashboard Agen Pegadaian.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <LayoutDashboard size={24} className="text-green-600" />
          <h2 className="text-xl font-semibold">Ringkasan Kinerja Anda</h2>
        </div>
        <p className="mt-4 text-gray-600">
          Halaman ini akan menampilkan ringkasan performa Anda, seperti jumlah transaksi,
          pencapaian target, dan informasi penting lainnya.
        </p>
      </div>
    </div>
  );
};

export default AgenDashboardPage;