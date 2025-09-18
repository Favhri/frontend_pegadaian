// src/pages/user/UserDashboard.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Bell, Briefcase, BarChart, LineChart } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Registrasi semua komponen ChartJS yang akan digunakan
ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const UserDashboard = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const userName = user.nama_lengkap || 'Pegawai';

    // Contoh data statis untuk elemen samping
    const announcements = [
        { id: 1, text: "Rapat bulanan akan diadakan pada tanggal 25 September 2025." },
        { id: 2, text: "Update kebijakan cuti tahunan, mohon diperiksa kembali." },
    ];

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true);
                // Panggil endpoint baru untuk data chart
                const response = await apiClient.get('/dashboard/user-charts');
                if (response.data.success) {
                    setChartData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch user chart data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChartData();
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-2">Halo, {userName}!</h1>
                <p className="text-lg">Selamat datang kembali di dashboard Anda. Berikut adalah ringkasan kinerja area Anda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Kolom Kiri (Lebar) untuk menampung chart */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Kartu Chart Monev KPI Area */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart className="text-gray-500"/>
                            <h3 className="font-bold text-lg text-gray-800">Monev KPI Area</h3>
                        </div>
                        <div className="h-80"> {/* Memberi tinggi tetap untuk canvas chart */}
                            {loading && <p className="text-center pt-16">Memuat data chart...</p>}
                            {chartData && (
                                <Bar options={chartOptions} data={chartData.monevKpiAreaData} />
                            )}
                        </div>
                    </div>

                    {/* Kartu Chart Monev OSL Kanwil */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <LineChart className="text-gray-500"/>
                            <h3 className="font-bold text-lg text-gray-800">Monev OSL Kanwil (6 Bulan Terakhir)</h3>
                        </div>
                        <div className="h-80"> {/* Memberi tinggi tetap untuk canvas chart */}
                             {loading && <p className="text-center pt-16">Memuat data chart...</p>}
                            {chartData && (
                                <Line options={chartOptions} data={chartData.monevOslKanwilData} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan (Sempit) untuk info tambahan */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="text-gray-500"/>
                            <h3 className="font-bold text-lg text-gray-800">Pengumuman</h3>
                        </div>
                        <ul className="space-y-3">
                            {announcements.map(item => (
                                <li key={item.id} className="text-sm text-gray-600 border-l-4 border-green-500 pl-3">
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <div className="flex items-center gap-3 mb-4">
                            <Briefcase className="text-gray-500"/>
                            <h3 className="font-bold text-lg text-gray-800">Info Anda</h3>
                        </div>
                        <div className="text-sm space-y-2">
                            <p><span className="font-semibold text-gray-600">Nama:</span> {userName}</p>
                            <p><span className="font-semibold text-gray-600">Role:</span> <span className="capitalize">{user.role}</span></p>
                            <p><span className="font-semibold text-gray-600">Sisa Cuti:</span> <span className="font-bold text-green-600">12 Hari</span> (contoh)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;