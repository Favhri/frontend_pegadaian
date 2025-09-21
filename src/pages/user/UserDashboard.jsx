// src/pages/user/UserDashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { ArrowRight, BarChart3, BookText } from 'lucide-react';
import apiClient from '../../api/axios';

// Registrasi ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDashboard = () => {
  const [userName, setUserName] = useState('User');
  const [userNik, setUserNik] = useState('N/A');
  const [oslList, setOslList] = useState([]);
  const [kpiList, setKpiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.nama_lengkap || 'User');
        setUserNik(user.NIK || 'N/A');
      } catch (error) {
        console.error("Gagal mem-parsing data user dari localStorage", error);
      }
    }

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [oslResponse, kpiResponse] = await Promise.all([
                apiClient.get('/laporan'),
                apiClient.get('/kpi')
            ]);
            if (oslResponse.data.success) setOslList(oslResponse.data.data);
            if (kpiResponse.data.success) setKpiList(kpiResponse.data.data);
        } catch (error) {
            console.error("Gagal memuat data dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchDashboardData();
  }, []);

  // Proses data untuk grafik OSL
  const oslChartData = useMemo(() => {
    const dataByUnit = oslList.reduce((acc, curr) => {
        const totalPencairan = (parseFloat(curr.pencairan_gadai) || 0) + (parseFloat(curr.pencairan_non_gadai) || 0) + (parseFloat(curr.pencairan_emas) || 0);
        const deltaOSL = totalPencairan - (parseFloat(curr.total_pelunasan) || 0);
        if (!acc[curr.unit_kerja]) {
            acc[curr.unit_kerja] = { deltaOSL: 0 };
        }
        acc[curr.unit_kerja].deltaOSL += deltaOSL;
        return acc;
    }, {});

    const labels = Object.keys(dataByUnit);
    return {
        labels,
        datasets: [{
            label: 'Delta OSL (Rp)',
            data: labels.map(label => dataByUnit[label].deltaOSL),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 5,
        }]
    };
  }, [oslList]);

  // Proses data untuk grafik KPI
  const kpiChartData = useMemo(() => {
    const dataByUnit = kpiList.reduce((acc, curr) => {
        if (!acc[curr.unit_kerja]) {
            acc[curr.unit_kerja] = { nasabah_baru: 0 };
        }
        acc[curr.unit_kerja].nasabah_baru += parseInt(curr.nasabah_baru, 10) || 0;
        return acc;
    }, {});

    const labels = Object.keys(dataByUnit);
    return {
        labels,
        datasets: [{
            label: 'Total Nasabah Baru',
            data: labels.map(label => dataByUnit[label].nasabah_baru),
            backgroundColor: 'rgba(234, 179, 8, 0.7)',
            borderColor: 'rgba(234, 179, 8, 1)',
            borderWidth: 1,
            borderRadius: 5,
        }]
    };
  }, [kpiList]);


  return (
    <div className="space-y-6">
      {/* Header Sambutan */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold">Halo, {userName}!</h1>
        <p className="mt-1 text-green-100">Selamat datang kembali di dashboard Anda.</p>
        <p className="text-sm mt-2 font-mono">NIK: {userNik}</p>
      </div>

      {/* ===== PERUBAHAN UTAMA DI SINI ===== */}
      {/* Grid untuk menampung dua chart sejajar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
            <>
                <div className="bg-white p-6 rounded-xl shadow-md text-center col-span-1 lg:col-span-2">Memuat data grafik...</div>
            </>
        ) : (
            <>
                {/* Grafik OSL */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-full"><BookText className="text-blue-600"/></div>
                        <h2 className="text-xl font-bold text-gray-800">Ringkasan Monev OSL Kanwil</h2>
                    </div>
                    <div className="h-80">
                        <Bar data={oslChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (value) => new Intl.NumberFormat('id-ID').format(value) } } } }} />
                    </div>
                </div>

                {/* Grafik KPI */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-yellow-100 p-2 rounded-full"><BarChart3 className="text-yellow-600"/></div>
                        <h2 className="text-xl font-bold text-gray-800">Ringkasan Monev KPI (Nasabah Baru)</h2>
                    </div>
                    <div className="h-80">
                        <Bar data={kpiChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
                    </div>
                </div>
            </>
        )}
      </div>
      
      {/* Menu Lainnya di bawah grafik */}
      {/* <div>
        <div className="bg-white p-6 rounded-xl shadow-md">
           <h2 className="text-xl font-bold text-gray-800 mb-4">Menu Lainnya</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <NavLink to="/user/monev-osl" className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                   <span className="font-medium">Detail Monev OSL</span>
                   <ArrowRight className="text-gray-500" />
               </NavLink>
               <NavLink to="/user/monev-kpi" className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                   <span className="font-medium">Detail Monev KPI</span>
                   <ArrowRight className="text-gray-500" />
               </NavLink>
               <NavLink to="/user/arsip" className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                   <span className="font-medium">Lihat Arsip Dokumen</span>
                   <ArrowRight className="text-gray-500" />
               </NavLink>
           </div>
         </div>
      </div> */}

    </div>
  );
};

export default UserDashboard;