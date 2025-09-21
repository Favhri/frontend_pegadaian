// src/pages/admin/DashboardAdminPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { Briefcase, UserX, Users, FolderKanban } from 'lucide-react';

// Komponen StatCard yang dimodifikasi
const StatCard = ({ icon, title, value, to, loading }) => { // Menghapus bgColor
    const navigate = useNavigate();
    const handleClick = () => to && navigate(to);

    return (
        <div 
            onClick={handleClick}
            // Warna dasar putih, dengan border bis hijau di kanan
            className={`relative p-6 rounded-2xl shadow-lg flex items-center gap-6 bg-white border-r-8 border-green-500 ${to ? 'cursor-pointer transform hover:-translate-y-1' : ''} transition-transform duration-300`}
        >
            <div className="bg-green-100 p-4 rounded-xl"> {/* Icon background hijau muda */}
                {icon}
            </div>
            <div>
                <p className="text-gray-600 text-lg font-semibold">{title}</p>
                {loading ? (
                    <div className="w-12 h-8 mt-1 bg-gray-200 rounded-md animate-pulse"></div>
                ) : (
                    <p className="text-gray-900 text-3xl font-bold">{value}</p>
                )}
            </div>
        </div>
    );
};

const DashboardAdminPage = () => {
    const [stats, setStats] = useState({
        totalPegawai: 0,
        totalCuti: 0,
        totalUser: 0,
        totalArsip: 0
    });
    const [loading, setLoading] = useState(true);
    const [adminName, setAdminName] = useState('Admin');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.nama_lengkap) {
            setAdminName(user.nama_lengkap);
        }

        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/dashboard/admin'); 
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Gagal memuat data statistik:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header Sambutan: Kembali ke warna hijau */}
            <div className="bg-gradient-to-r from-green-700 to-green-500 text-white rounded-2xl shadow-xl p-8">
                <h1 className="text-4xl font-bold">Selamat Datang, {adminName}!</h1>
                <p className="mt-2 text-green-100">Berikut adalah ringkasan data dari keseluruhan sistem.</p>
            </div>

            {/* Grid untuk 4 Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Briefcase size={32} className="text-green-600"/>} // Ikon berwarna hijau
                    title="Jumlah Pegawai"
                    value={stats.totalPegawai}
                    to="/admin/pegawai"
                    loading={loading}
                />
                <StatCard
                    icon={<UserX size={32} className="text-green-600"/>} // Ikon berwarna hijau
                    title="Pegawai Cuti"
                    value={stats.totalCuti}
                    to="/admin/penentuan-cuti"
                    loading={loading}
                />
                <StatCard
                    icon={<Users size={32} className="text-green-600"/>} // Ikon berwarna hijau
                    title="Jumlah User"
                    value={stats.totalUser}
                    to="/admin/users"
                    loading={loading}
                />
                 <StatCard
                    icon={<FolderKanban size={32} className="text-green-600"/>} // Ikon berwarna hijau
                    title="Total Dokumen"
                    value={stats.totalArsip}
                    to="/admin/arsip"
                    loading={loading}
                />
            </div>
            
            {/* <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800">Aktivitas Lainnya</h2>
                <p className="text-gray-600 mt-2">Tempat untuk grafik atau tabel ringkasan lainnya.</p>
            </div> */}
        </div>
    );
};

export default DashboardAdminPage;