// src/pages/user/UserDashboard.jsx

import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

const UserDashboard = () => {
  const [berat, setBerat] = useState('');
  const [kadar, setKadar] = useState('');
  const [hasilEstimasi, setHasilEstimasi] = useState('Masukkan data untuk melihat estimasi pinjaman');

  const hitungGadai = () => {
    const beratNum = parseFloat(berat);
    const kadarNum = parseFloat(kadar);
    // Harga emas per gram bisa dibuat lebih dinamis, misal diambil dari API
    const hargaEmasPerGram = 1050000; 

    if (beratNum > 0 && kadarNum > 0) {
      const nilaiEmas = beratNum * (kadarNum / 24) * hargaEmasPerGram;
      const estimasiPinjaman = nilaiEmas * 0.85; // Asumsi pinjaman 85% dari nilai taksir
      setHasilEstimasi(`Rp ${estimasiPinjaman.toLocaleString('id-ID')}`);
    } else {
      setHasilEstimasi('Mohon lengkapi semua data dengan benar');
    }
  };

  return (
    <>
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-700" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pinjaman Aktif</p>
              <p className="text-xl font-bold">Rp 5.000.000</p>
            </div>
          </div>
        </div>
        {/* Tambahkan kartu statistik lainnya di sini jika perlu */}
      </div>

      {/* Calculator Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Kalkulator Gadai Emas</h2>
        <div className="max-w-md">
          <input
            type="number"
            value={berat}
            onChange={(e) => setBerat(e.target.value)}
            placeholder="Berat Emas (gram)"
            className="w-full p-3 border rounded-lg text-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            value={kadar}
            onChange={(e) => setKadar(e.target.value)}
            placeholder="Kadar Emas (misal: 24)"
            className="w-full p-3 border rounded-lg text-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            onClick={hitungGadai}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition duration-300 mb-4"
          >
            Hitung Estimasi
          </button>
          <div className="bg-green-50 p-4 rounded-lg text-center font-semibold text-green-800">
            {hasilEstimasi}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Transaksi Terakhir</h2>
        <div className="overflow-x-auto">
          <p className="text-gray-500">Tabel riwayat transaksi akan ditampilkan di sini.</p>
          {/* Anda bisa menambahkan komponen tabel di sini */}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;