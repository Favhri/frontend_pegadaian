// src/pages/user/KalenderCutiPage.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import apiClient from '../../api/axios';

const KalenderCutiPage = () => {
  const [cutiList, setCutiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCuti = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/cuti');
        if (response.data.success) {
          setCutiList(response.data.data);
        }
      } catch (err) {
        setError('Gagal memuat data cuti. Coba lagi nanti.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCuti();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 mb-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <Calendar size={40} />
          <div>
            <h1 className="text-3xl font-bold">Kalender Cuti Karyawan</h1>
            <p className="text-green-100">Lihat jadwal cuti yang sudah disetujui.</p>
          </div>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Memuat data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-4">
          {cutiList.length > 0 ? (
            cutiList.map((cuti) => (
              <div key={cuti.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-gray-800">{cuti.pegawai}</p>
                    <p className="text-sm text-gray-500 capitalize">Jenis Cuti: {cuti.jenis}</p>
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                       <Clock size={16} />
                       <span>{formatDate(cuti.tanggalMulai)} - {formatDate(cuti.tanggalSelesai)}</span>
                     </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700"><strong>Alasan:</strong> {cuti.alasan}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Tidak ada data cuti yang disetujui saat ini.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default KalenderCutiPage;