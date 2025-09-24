// src/pages/user/UserMonevKpiPage.jsx

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import { BarChart3, Plus, Download } from 'lucide-react';

const UserMonevKpiPage = () => {
    const [kpiList, setKpiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().slice(0, 10),
        unit_kerja: '',
        nasabah_baru: '', nasabah_existing: '', nasabah_akun: '', nasabah_transaksi: '',
        pds_umi_corner: '', g24: '', antam: '', mte: '', deposito_emas: '',
        gte_kte: '', mikro: '', disbursement: '', agen: ''
    });

    const unitKerjaOptions = ["CP Terandam", "UPC Siteba", "UPC Belimbing", "UPC Alai", "UPC Mata Air", "UPC Parak laweh", "UPC balai baru", "UPC Simp Anduring", "UPC bandar Buat", "UPC Indarung"];

    const fetchKpi = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/kpi');
            if (response.data.success) {
                setKpiList(response.data.data);
            }
        } catch (error) {
            Swal.fire('Error', 'Gagal memuat data Monev KPI.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKpi();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/kpi', formData);
            if(response.data.success) {
                Swal.fire('Berhasil!', 'Data Monev KPI berhasil disimpan.', 'success');
                setIsFormVisible(false);
                fetchKpi();
                setFormData({
                    tanggal: new Date().toISOString().slice(0, 10),
                    unit_kerja: '', nasabah_baru: '', nasabah_existing: '', nasabah_akun: '', nasabah_transaksi: '',
                    pds_umi_corner: '', g24: '', antam: '', mte: '', deposito_emas: '',
                    gte_kte: '', mikro: '', disbursement: '', agen: ''
                });
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data.', 'error');
        }
    };

    const handleExport = async () => {
        try {
            const response = await apiClient.get('/kpi/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = `Monev_KPI_Area_${new Date().toISOString().slice(0,10)}.xlsx`;
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
                    <BarChart3 size={32} />
                    <div>
                        <h1 className="text-3xl font-bold">Monev KPI Area</h1>
                        <p>Input dan monitoring Key Performance Indicator (KPI) per unit kerja.</p>
                    </div>
                </div>
            </div>

            {isFormVisible && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-down">
                    <h2 className="text-xl font-bold mb-4">Form Input Monev KPI</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div><label className="block text-sm font-medium">Tanggal*</label><input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                            <div><label className="block text-sm font-medium">Unit Kerja*</label><select name="unit_kerja" value={formData.unit_kerja} onChange={handleChange} className="w-full p-2 border rounded-md bg-white" required><option value="">Pilih Unit</option>{unitKerjaOptions.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4 border-t pt-4">
                            <div><label className="block text-sm font-medium">Nasabah Baru</label><input type="number" name="nasabah_baru" value={formData.nasabah_baru} onChange={handleChange} placeholder="Angka" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Nasabah Existing</label><input type="number" name="nasabah_existing" value={formData.nasabah_existing} onChange={handleChange} placeholder="Angka" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Nasabah Akun</label><input type="number" name="nasabah_akun" value={formData.nasabah_akun} onChange={handleChange} placeholder="Angka" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Nasabah Transaksi</label><input type="number" name="nasabah_transaksi" value={formData.nasabah_transaksi} onChange={handleChange} placeholder="Angka" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">PDS/UMI Corner (Rp)</label><input type="number" name="pds_umi_corner" value={formData.pds_umi_corner} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">G24 (gr)</label><input type="number" name="g24" value={formData.g24} onChange={handleChange} placeholder="gr" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Antam (gr)</label><input type="number" name="antam" value={formData.antam} onChange={handleChange} placeholder="gr" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">MTE (gr)</label><input type="number" name="mte" value={formData.mte} onChange={handleChange} placeholder="gr" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Deposito Emas (gr)</label><input type="number" name="deposito_emas" value={formData.deposito_emas} onChange={handleChange} placeholder="gr" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">GTE & KTE (Rp)</label><input type="number" name="gte_kte" value={formData.gte_kte} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Mikro (Rp)</label><input type="number" name="mikro" value={formData.mikro} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Disbursement (Rp)</label><input type="number" name="disbursement" value={formData.disbursement} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Agen (Rp)</label><input type="number" name="agen" value={formData.agen} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                        </div>
                        <div className="flex justify-end gap-4 border-t pt-4">
                            <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Simpan Data</button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold">Data Monev KPI Tersimpan</h2>
                    <div className="flex items-center gap-2">
                        {!isFormVisible && (
                            <button onClick={() => setIsFormVisible(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                                <Plus size={18}/>Input Data
                            </button>
                        )}
                        <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            <Download size={18}/>Export ke Excel
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                    {loading ? <p>Memuat data...</p> : (
                        <table className="w-full text-sm text-left text-gray-500">
                           <thead className="text-left bg-gray-50 uppercase">
                                <tr>
                                    <th className="p-2 sticky left-0 bg-gray-50">Unit Kerja</th>
                                    <th className="p-2">Tgl</th>
                                    <th className="p-2">Nasabah Baru</th>
                                    <th className="p-2">Existing</th>
                                    <th className="p-2">Akun</th>
                                    <th className="p-2">Transaksi</th>
                                    <th className="p-2">PDS/UMI (Rp)</th>
                                    <th className="p-2">G24 (gr)</th>
                                    <th className="p-2">Antam (gr)</th>
                                    <th className="p-2">MTE (gr)</th>
                                    <th className="p-2">Deposito Emas (gr)</th>
                                    <th className="p-2">GTE/KTE (Rp)</th>
                                    <th className="p-2">Mikro (Rp)</th>
                                    <th className="p-2">Disbursement (Rp)</th>
                                    <th className="p-2">Agen (Rp)</th>
                                    <th className="p-2">Penginput</th>
                                </tr>
                           </thead>
                           <tbody className="divide-y">
                                {kpiList.map(k => (
                                    <tr key={k.id} className="hover:bg-gray-50">
                                        <td className="p-2 font-medium sticky left-0 bg-white">{k.unit_kerja}</td>
                                        <td className="p-2">{new Date(k.tanggal).toLocaleDateString('id-ID')}</td>
                                        <td className="p-2">{k.nasabah_baru}</td>
                                        <td className="p-2">{k.nasabah_existing}</td>
                                        <td className="p-2">{k.nasabah_akun}</td>
                                        <td className="p-2">{k.nasabah_transaksi}</td>
                                        <td className="p-2">{k.pds_umi_corner}</td>
                                        <td className="p-2">{k.g24}</td>
                                        <td className="p-2">{k.antam}</td>
                                        <td className="p-2">{k.mte}</td>
                                        <td className="p-2">{k.deposito_emas}</td>
                                        <td className="p-2">{k.gte_kte}</td>
                                        <td className="p-2">{k.mikro}</td>
                                        <td className="p-2">{k.disbursement}</td>
                                        <td className="p-2">{k.agen}</td>
                                        <td className="p-2 text-gray-500">{k.penginput}</td>
                                    </tr>
                                ))}
                           </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserMonevKpiPage;