// src/pages/agen/LaporanHarianAgenPage.jsx
import React from 'react';
import { BookText } from 'lucide-react';

const LaporanHarianAgenPage = () => {
  return (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
                <BookText size={28} className="text-green-600" />
                <h1 className="text-2xl font-bold text-gray-800">Laporan Harian</h1>
            </div>
            <p className="text-gray-600">
                Gunakan halaman ini untuk menginput dan melihat rekapitulasi laporan harian Anda.
            </p>
        </div>
    </div>
  );
};

export default LaporanHarianAgenPage;