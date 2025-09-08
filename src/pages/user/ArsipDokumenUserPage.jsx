// src/pages/user/ArsipDokumenUserPage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import Swal from 'sweetalert2';
import { Filter, Briefcase } from 'lucide-react';

const ArsipDokumenUserPage = () => {
    const [dokumenList, setDokumenList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ unit_kerja: 'Semua', kategori: 'Semua' });

    const unitKerjaOptions = ["Kantor Cabang", "CP TERANDAM", "UPC BANDAR BUAT", "UPC INDARUNG", "UPC MATA AIR", "UPC ALAI", "UPC SITEBA", "UPC BALAI BARU", "UPC BELIMBING", "UPC ANDURING", "UPC PARAK LAWEH"];
    const kategoriOptions = ["Keuangan", "Operasional", "Legal", "Inventory", "SDM", "Lainnya"];

    useEffect(() => {
        const fetchDokumen = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filters.unit_kerja !== 'Semua') params.unit_kerja = filters.unit_kerja;
                if (filters.kategori !== 'Semua') params.kategori = filters.kategori;
                const response = await apiClient.get('/arsip', { params });
                if (response.data.success) {
                    setDokumenList(response.data.data);
                }
            } catch (error) {
                Swal.fire('Error', 'Gagal memuat data arsip.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchDokumen();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                    <Briefcase size={32} />
                    <div>
                        <h1 className="text-3xl font-bold">Arsip Dokumen</h1>
                        <p className="text-lg">Temukan dokumen penting perusahaan di sini.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4 mb-6">
                    <Filter size={20} className="text-gray-500" />
                    <h3 className="font-semibold">Filter Dokumen:</h3>
                    <select name="unit_kerja" value={filters.unit_kerja} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md bg-white">
                        <option value="Semua">Semua Unit</option>
                        {unitKerjaOptions.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                    <select name="kategori" value={filters.kategori} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md bg-white">
                        <option value="Semua">Semua Kategori</option>
                        {kategoriOptions.map(kat => <option key={kat} value={kat}>{kat}</option>)}
                    </select>
                </div>

                {loading ? <p>Memuat...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dokumenList.map(doc => (
                            <div key={doc.id} className="border p-4 rounded-lg">
                                <h4 className="font-bold">{doc.nama_dokumen}</h4>
                                <p className="text-sm text-gray-500">{doc.kategori} - {doc.unit_kerja}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArsipDokumenUserPage;