// src/pages/admin/DashboardAdminPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import DashboardCard from '../../components/DashboardCard';
import apiClient from '../../api/axios';

const DashboardAdminPage = () => {
  const navigate = useNavigate(); // 2. Inisialisasi hook navigasi
  
  const [dashboardStats, setDashboardStats] = useState({
    totalPegawai: '...',
    laporanBulanIni: '...',
    pengajuanCuti: '...',
    totalDokumen: '...',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [pegawaiRes, laporanRes, cutiRes, arsipRes] = await Promise.all([
          apiClient.get('/pegawai'),
          apiClient.get('/laporan'),
          apiClient.get('/cuti'),
          apiClient.get('/arsip')
        ]);

        const sekarang = new Date();
        sekarang.setHours(0, 0, 0, 0);

        const cutiHariIniCount = cutiRes.data.data.filter(cuti => {
          const tanggalMulai = new Date(cuti.tanggalMulai);
          const tanggalSelesai = new Date(cuti.tanggalSelesai);
          tanggalMulai.setHours(0, 0, 0, 0);
          tanggalSelesai.setHours(0, 0, 0, 0);
          return sekarang >= tanggalMulai && sekarang <= tanggalSelesai;
        }).length;
        
        const bulanIni = sekarang.getMonth();
        const tahunIni = sekarang.getFullYear();
        const laporanBulanIniCount = laporanRes.data.data.filter(laporan => {
          const tanggalLaporan = new Date(laporan.tanggal);
          return tanggalLaporan.getMonth() === bulanIni && tanggalLaporan.getFullYear() === tahunIni;
        }).length;

        setDashboardStats({
          totalPegawai: pegawaiRes.data.data.length.toString(),
          laporanBulanIni: laporanBulanIniCount.toString(),
          pengajuanCuti: cutiHariIniCount.toString(),
          totalDokumen: arsipRes.data.data.length.toString(),
        });

      } catch (error) {
        console.error("Gagal mengambil data untuk dashboard:", error);
        setDashboardStats({
            totalPegawai: 'N/A',
            laporanBulanIni: 'N/A',
            pengajuanCuti: 'N/A',
            totalDokumen: 'N/A',
        });
      }
    };

    fetchDashboardData();
  }, []);

  // 3. Tambahkan properti 'path' untuk setiap data kartu
  const dashboardData = [
    { icon: '👥', title: 'Total Pegawai', value: dashboardStats.totalPegawai, subtitle: 'Pegawai terdaftar', path: '/admin/pegawai' },
    { icon: '📊', title: 'Laporan Masuk', value: dashboardStats.laporanBulanIni, subtitle: 'Laporan masuk bulan ini', path: '/admin/laporan-harian' },
    { icon: '📅', title: 'Jadwal Cuti', value: dashboardStats.pengajuanCuti, subtitle: 'Pegawai yang sedang cuti', path: '/admin/penentuan-cuti' },
    { icon: '📁', title: 'Total Dokumen', value: dashboardStats.totalDokumen, subtitle: 'Dokumen tersimpan', path: '/admin/arsip' },
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
            // 4. Tambahkan fungsi onClick untuk navigasi
            onClick={() => navigate(data.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardAdminPage;