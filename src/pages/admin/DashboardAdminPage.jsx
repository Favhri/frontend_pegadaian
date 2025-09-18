// src/pages/admin/DashboardAdminPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Users, FileText, BarChart2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

const DashboardCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md flex items-center justify-between`}>
        <div>
            <p className="text-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
    </div>
);

const DashboardAdminPage = () => {
    const [stats, setStats] = useState({ totalAgen: 0, totalLaporanHariIni: 0 });
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const userName = JSON.parse(localStorage.getItem('user'))?.nama_lengkap || 'Admin';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/dashboard/admin');
                if (response.data.success) {
                    const { totalAgen, totalLaporanHariIni, osl7Days } = response.data.data;
                    setStats({ totalAgen, totalLaporanHariIni });

                    const labels = osl7Days.map(d => new Date(d.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }));
                    const data = osl7Days.map(d => d.total_osl);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Total OSL Harian',
                                data: data,
                                fill: true,
                                backgroundColor: 'rgba(22, 163, 74, 0.2)',
                                borderColor: 'rgb(22, 163, 74)',
                                tension: 0.3,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            }
        };
        fetchStats();
    }, []);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Grafik Total OSL dalam 7 Hari Terakhir' },
        },
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-xl shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-2">Halo, {userName}!</h1>
                <p className="text-lg">Selamat datang di Dashboard Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard title="Total Agen" value={stats.totalAgen} icon={<Users className="text-white" />} color="bg-blue-500" />
                <DashboardCard title="Laporan Masuk Hari Ini" value={stats.totalLaporanHariIni} icon={<FileText className="text-white" />} color="bg-green-500" />
                <DashboardCard title="Placeholder KPI" value="1,234" icon={<BarChart2 className="text-white" />} color="bg-yellow-500" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Analitik Kinerja</h2>
                <div className="w-full h-80">
                    <Line options={chartOptions} data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default DashboardAdminPage;