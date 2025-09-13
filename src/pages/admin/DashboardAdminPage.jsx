// src/pages/admin/DashboardAdminPage.jsx

import React, { useState, useEffect } from 'react';
import DashboardCard from '../../components/DashboardCard';
import apiClient from '../../api/axios'; // 1. Import apiClient

const DashboardAdminPage = () => {
  // 2. Buat state untuk menyimpan data dashboard
  const [dashboardStats, setDashboardStats] = useState({
    totalPegawai: '...', // Nilai awal saat loading
    laporanBulanIni: '28', // Data statis lainnya bisa tetap di sini
    pengajuanCuti: '12',
    totalDokumen: '1,247',
  });

  // 3. Gunakan useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Panggil API untuk mendapatkan data pegawai
        const pegawaiResponse = await apiClient.get('/pegawai');
        
        if (pegawaiResponse.data.success) {
          // Update state dengan jumlah pegawai yang sebenarnya
          setDashboardStats(prevStats => ({
            ...prevStats,
            totalPegawai: pegawaiResponse.data.data.length.toString(),
          }));
        }

        // Kamu juga bisa menambahkan API call lain di sini untuk data lainnya
        // const laporanResponse = await apiClient.get('/laporan/count');
        // setDashboardStats(prev => ({...prev, laporanBulanIni: laporanResponse.data.count}));

      } catch (error) {
        console.error("Gagal mengambil data untuk dashboard:", error);
        // Jika gagal, tampilkan nilai default
        setDashboardStats(prevStats => ({
            ...prevStats,
            totalPegawai: 'N/A',
        }));
      }
    };

    fetchDashboardData();
  }, []); // [] berarti useEffect hanya berjalan sekali saat komponen pertama kali render

  // 4. Gunakan data dari state untuk ditampilkan di kartu
  const dashboardData = [
    { icon: '👥', title: 'Total Pegawai', value: dashboardStats.totalPegawai, subtitle: 'Pegawai terdaftar' },
    { icon: '📊', title: 'Laporan', value: dashboardStats.laporanBulanIni, subtitle: 'Laporan masuk' },
    { icon: '📅', title: 'Jadwal Cuti', value: dashboardStats.pengajuanCuti, subtitle: 'Sedang Cuti' },
    { icon: '📁', title: 'Total Dokumen', value: dashboardStats.totalDokumen, subtitle: 'Dokumen tersimpan' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.map((data, index) => (
          <DashboardCard
            key={index}
            icon={data.icon}
            title={data.title}
            value={data.value}
            subtitle={data.subtitle}
          />
        ))}
      </div>
      {/* Kamu bisa menambahkan komponen dashboard lainnya di sini */}
    </div>
  );
};

export default DashboardAdminPage;