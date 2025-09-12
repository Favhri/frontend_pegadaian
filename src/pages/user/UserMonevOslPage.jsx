// src/pages/user/UserMonevOslPage.jsx

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import { BookText, Plus, Download } from 'lucide-react';

const formatCurrency = (value) => {
    if (!value) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(value);
};

const UserMonevOslPage = () => {
    const [laporanList, setLaporanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().slice(0, 10),
        unit_kerja: '',
        pencairan_gadai: '',
        pencairan_non_gadai: '',
        pencairan_emas: '',
        total_pelunasan: '',
        catatan: ''
    });

    const unitKerjaOptions = ["CP Terandam", "UPC Siteba", "UPC Belimbing", "UPC Alai", "UPC Mata Air", "UPC Parak laweh", "UPC balai baru", "UPC Simp Anduring", "UPC bandar Buat", "UPC Indarung"];

    const fetchLaporan = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/laporan');
            if (response.data.success) {
                setLaporanList(response.data.data);
            }
        } catch (error) {
            Swal.fire('Error', 'Gagal memuat data laporan.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLaporan();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/laporan', formData);
            if(response.data.success) {
                Swal.fire('Berhasil!', 'Laporan berhasil disimpan.', 'success');
                setIsFormVisible(false);
                fetchLaporan();
                setFormData({
                    tanggal: new Date().toISOString().slice(0, 10),
                    unit_kerja: '', pencairan_gadai: '', pencairan_non_gadai: '', pencairan_emas: '', total_pelunasan: '', catatan: ''
                });
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan laporan.', 'error');
        }
    };

    const handleExport = async () => {
        try {
            const response = await apiClient.get('/laporan/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = `Laporan_Harian_Pegadaian_${new Date().toISOString().slice(0,10)}.xlsx`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            Swal.fire('Error', 'Gagal mengunduh file export.', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <BookText size={32} />
                    <div>
                        <h1 className="text-3xl font-bold">Monev OSL Kanwil</h1>
                        <p>Input dan kelola laporan kinerja harian dari semua unit kerja.</p>
                    </div>
                </div>
            </div>

            {isFormVisible && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-down">
                    <h2 className="text-xl font-bold mb-4">Form Input Laporan Harian</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div><label className="block text-sm font-medium">Tanggal*</label><input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                        <div><label className="block text-sm font-medium">Unit Kerja*</label><select name="unit_kerja" value={formData.unit_kerja} onChange={handleChange} className="w-full p-2 border rounded-md bg-white" required><option value="">Pilih Unit</option>{unitKerjaOptions.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
                        <div className="lg:col-span-1"></div>
                        <div><label className="block text-sm font-medium">Pencairan Gadai</label><input type="number" name="pencairan_gadai" value={formData.pencairan_gadai} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                        <div><label className="block text-sm font-medium">Pencairan Non Gadai</label><input type="number" name="pencairan_non_gadai" value={formData.pencairan_non_gadai} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                        <div><label className="block text-sm font-medium">Pencairan Emas</label><input type="number" name="pencairan_emas" value={formData.pencairan_emas} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                        <div><label className="block text-sm font-medium">Total Pelunasan</label><input type="number" name="total_pelunasan" value={formData.total_pelunasan} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                        <div className="md:col-span-2 lg:col-span-3"><label className="block text-sm font-medium">Catatan</label><textarea name="catatan" value={formData.catatan} onChange={handleChange} rows="3" className="w-full p-2 border rounded-md"></textarea></div>
                        <div className="lg:col-span-3 flex justify-end gap-4">
                            <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Simpan Laporan</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Daftar Laporan Masuk</h2>
                    <div className='flex items-center gap-2'>
                        {!isFormVisible && <button onClick={() => setIsFormVisible(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/>Input Laporan</button>}
                        <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Download size={18}/>Export ke Excel</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <p>Memuat data...</p> : (
                        <table className="w-full text-sm">
                           <thead className="text-left bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
                                    <th className="p-2">Tanggal</th><th className="p-2">Unit Kerja</th><th className="p-2">Total Pencairan</th><th className="p-2">Total Pelunasan</th><th className="p-2">Delta OSL</th><th className="p-2">Penginput</th>
                                </tr>
                           </thead>
                           <tbody>
                                {laporanList.map(l => {
                                    const totalPencairan = parseFloat(l.pencairan_gadai) + parseFloat(l.pencairan_non_gadai) + parseFloat(l.pencairan_emas);
                                    const deltaOSL = totalPencairan - parseFloat(l.total_pelunasan);
                                    return (
                                        <tr key={l.id} className="border-b hover:bg-gray-50">
                                            <td className="p-2">{new Date(l.tanggal).toLocaleDateString('id-ID')}</td>
                                            <td className="p-2 font-medium">{l.unit_kerja}</td>
                                            <td className="p-2">{formatCurrency(totalPencairan)}</td>
                                            <td className="p-2">{formatCurrency(l.total_pelunasan)}</td>
                                            <td className={`p-2 font-semibold ${deltaOSL < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(deltaOSL)}</td>
                                            <td className="p-2 text-gray-500">{l.penginput}</td>
                                        </tr>
                                    )
                                })}
                           </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserMonevOslPage;