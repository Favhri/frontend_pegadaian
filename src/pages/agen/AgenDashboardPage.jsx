// src/pages/agen/AgenDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { NavLink } from 'react-router-dom';
import { ArrowRight, TrendingUp, BookCheck, Clock } from 'lucide-react';

const formatCurrency = (value) => {
    if (!value) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

const AgenDashboardPage = () => {
    const [stats, setStats] = useState({ totalKunjungan: 0, totalOsl: 0, laporanTerakhir: [] });
    const userName = JSON.parse(localStorage.getItem('user'))?.nama_lengkap || 'Agen';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/dashboard/agen');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch agen stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-2">Halo, {userName}!</h1>
                <p className="text-lg">Selamat datang di Dashboard Agen Pegadaian.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4">Aksi Cepat</h3>
                    <div className="space-y-3">
                        <NavLink to="/agen/laporan-harian" className="flex justify-between items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            <span>Input Laporan Harian</span>
                            <ArrowRight className="text-green-600" />
                        </NavLink>
                        <NavLink to="/agen/laporan-kunjungan" className="flex justify-between items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            <span>Input Laporan Kunjungan</span>
                            <ArrowRight className="text-green-600" />
                        </NavLink>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4">Kinerja Bulan Ini</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-full"><BookCheck className="text-blue-600" /></div>
                            <div>
                                <p className="text-gray-500">Total Kunjungan</p>
                                <p className="text-2xl font-bold">{stats.totalKunjungan}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-full"><TrendingUp className="text-yellow-600" /></div>
                            <div>
                                <p className="text-gray-500">Total OSL Closing</p>
                                <p className="text-2xl font-bold">{formatCurrency(stats.totalOsl)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4">Aktivitas Laporan Terakhir</h3>
                <div className="space-y-2">
                    {stats.laporanTerakhir.length > 0 ? stats.laporanTerakhir.map(laporan => (
                         <div key={laporan.id + laporan.jenis} className="flex items-center p-3 bg-gray-50 rounded-md">
                            <Clock size={16} className="mr-3 text-gray-400" />
                            <span className={`font-semibold mr-2 px-2 py-0.5 rounded-full text-xs ${laporan.jenis === 'Harian' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>{laporan.jenis}</span>
                            <span>- {new Date(laporan.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    )) : (
                        <p className="text-gray-500">Belum ada laporan yang dibuat.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgenDashboardPage;