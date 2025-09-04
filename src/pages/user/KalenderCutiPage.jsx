// src/pages/user/KalenderCutiPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, List } from 'lucide-react';
import apiClient from '../../api/axios';

// Import library kalender yang baru
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // CSS bawaan
import './CalendarStyles.css'; // File CSS custom yang baru kita buat

const KalenderCutiPage = () => {
  const [cutiList, setCutiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDate, setActiveDate] = useState(new Date());

  // Objek untuk menyimpan detail cuti per tanggal
  const cutiDates = useMemo(() => {
    const dates = {};
    cutiList.forEach(cuti => {
      let currentDate = new Date(cuti.tanggalMulai);
      let endDate = new Date(cuti.tanggalSelesai);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (!dates[dateString]) {
          dates[dateString] = [];
        }
        dates[dateString].push(`${cuti.pegawai} (${cuti.jenis})`);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return dates;
  }, [cutiList]);

  useEffect(() => {
    const fetchCuti = async () => {
      try {
        setLoading(true);
        setError('');
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

  // Fungsi untuk menambahkan class dan tooltip pada tanggal yang ada cuti
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (cutiDates[dateString]) {
        // Gabungkan semua nama yang cuti pada hari itu
        const tooltipText = cutiDates[dateString].join('\n');
        return (
          <div className="tooltip">
            {tooltipText}
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (cutiDates[dateString]) {
        return 'cuti-day';
      }
    }
    return null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <CalendarIcon size={40} />
          <div>
            <h1 className="text-3xl font-bold">Kalender Cuti Karyawan</h1>
            <p className="text-green-100">Jadwal cuti dalam format kalender dan daftar.</p>
          </div>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Memuat data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <Calendar
              onChange={setActiveDate}
              value={activeDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              locale="id-ID" // Menggunakan format Indonesia
            />
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 sm:p-6 border-b flex items-center gap-3">
              <List size={24} className="text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Daftar Karyawan Cuti</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  {/* Tabel header */}
                  <tr>
                    <th className="px-6 py-3">Nama Pegawai</th>
                    <th className="px-6 py-3">Jenis Cuti</th>
                    <th className="px-6 py-3">Tanggal Mulai</th>
                    <th className="px-6 py-3">Tanggal Selesai</th>
                    <th className="px-6 py-3">Alasan</th>
                  </tr>
                </thead>
                <tbody>
                  {cutiList.length > 0 ? (
                    cutiList.map((cuti) => (
                      <tr key={cuti.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{cuti.pegawai}</td>
                        <td className="px-6 py-4 capitalize">{cuti.jenis}</td>
                        <td className="px-6 py-4">{formatDate(cuti.tanggalMulai)}</td>
                        <td className="px-6 py-4">{formatDate(cuti.tanggalSelesai)}</td>
                        <td className="px-6 py-4">{cuti.alasan}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        Tidak ada data cuti yang tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KalenderCutiPage;