// src/pages/agen/LaporanKunjunganPage.jsx
import React from 'react';
import { ClipboardCheck } from 'lucide-react';

const LaporanKunjunganPage = () => {
  return (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
                <ClipboardCheck size={28} className="text-green-600" />
                <h1 className="text-2xl font-bold text-gray-800">Laporan Kunjungan ke Agen</h1>
            </div>
            <p className="text-gray-600">
                Halaman ini digunakan untuk mencatat dan melaporkan hasil kunjungan ke agen-agen lain atau nasabah.
            </p>
        </div>
    </div>
  );
};

export default LaporanKunjunganPage;