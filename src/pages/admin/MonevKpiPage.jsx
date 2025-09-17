// src/pages/admin/MonevKpiPage.jsx

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import { BarChart3, Plus, Download, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';

const getUserRole = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.role || 'user';
    } catch {
        return 'user';
    }
};

const initialFormState = {
    tanggal: new Date().toISOString().slice(0, 10),
    unit_kerja: '',
    nasabah_baru: '', nasabah_existing: '', nasabah_akun: '', nasabah_transaksi: '',
    pds_umi_corner: '', g24: '', antam: '', mte: '', deposito_emas: '',
    gte_kte: '', mikro: '', disbursement: '', agen: ''
};

const unitKerjaOptions = ["CP Terandam", "UPC Siteba", "UPC Belimbing", "UPC Alai", "UPC Mata Air", "UPC Parak laweh", "UPC balai baru", "UPC Simp Anduring", "UPC bandar Buat", "UPC Indarung"];

// --- PERBAIKAN UTAMA DI SINI ---
// Komponen FormFields dipindahkan ke luar dari komponen utama
const KpiFormFields = ({ formData, handleChange }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal*</label>
                <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja*</label>
                <select name="unit_kerja" value={formData.unit_kerja} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required>
                    <option value="">Pilih Unit</option>
                    {unitKerjaOptions.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-gray-800 mb-2 border-b pb-2">Nasabah & PDS</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div><label className="block text-sm font-medium">Nasabah Baru</label><input type="number" name="nasabah_baru" value={formData.nasabah_baru || ''} onChange={handleChange} placeholder="Jumlah" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">Nasabah Existing</label><input type="number" name="nasabah_existing" value={formData.nasabah_existing || ''} onChange={handleChange} placeholder="Jumlah" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">PDS Akun</label><input type="number" name="nasabah_akun" value={formData.nasabah_akun || ''} onChange={handleChange} placeholder="Jumlah" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">PDS Transaksi</label><input type="number" name="nasabah_transaksi" value={formData.nasabah_transaksi || ''} onChange={handleChange} placeholder="Jumlah" className="w-full p-2 border rounded-md" /></div>
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-gray-800 mb-2 border-b pb-2">Produk Emas (gram)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div><label className="block text-sm font-medium">G24</label><input type="number" name="g24" value={formData.g24 || ''} onChange={handleChange} placeholder="gram" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">Antam</label><input type="number" name="antam" value={formData.antam || ''} onChange={handleChange} placeholder="gram" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">MTE</label><input type="number" name="mte" value={formData.mte || ''} onChange={handleChange} placeholder="gram" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">Deposito Emas</label><input type="number" name="deposito_emas" value={formData.deposito_emas || ''} onChange={handleChange} placeholder="gram" className="w-full p-2 border rounded-md" /></div>
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-gray-800 mb-2 border-b pb-2">Produk Non Gadai & Lainnya (Rp)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div><label className="block text-sm font-medium">UMI Corner</label><input type="number" name="pds_umi_corner" value={formData.pds_umi_corner || ''} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">GTE & KTE</label><input type="number" name="gte_kte" value={formData.gte_kte || ''} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">Mikro</label><input type="number" name="mikro" value={formData.mikro || ''} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">Disbursement</label><input type="number" name="disbursement" value={formData.disbursement || ''} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">Agen</label><input type="number" name="agen" value={formData.agen || ''} onChange={handleChange} placeholder="Rp" className="w-full p-2 border rounded-md" /></div>
            </div>
        </div>
    </div>
);

const MonevKpiPage = () => {
    const [kpiList, setKpiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentKpi, setCurrentKpi] = useState(null);
    const userRole = getUserRole();
    
    const [formData, setFormData] = useState(initialFormState);

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

    const handleOpenModal = (kpi) => {
        setCurrentKpi(kpi);
        setFormData({
            tanggal: new Date(kpi.tanggal).toISOString().slice(0, 10),
            unit_kerja: kpi.unit_kerja,
            nasabah_baru: kpi.nasabah_baru,
            nasabah_existing: kpi.nasabah_existing,
            nasabah_akun: kpi.nasabah_akun,
            nasabah_transaksi: kpi.nasabah_transaksi,
            pds_umi_corner: kpi.pds_umi_corner,
            g24: kpi.g24,
            antam: kpi.antam,
            mte: kpi.mte,
            deposito_emas: kpi.deposito_emas,
            gte_kte: kpi.gte_kte,
            mikro: kpi.mikro,
            disbursement: kpi.disbursement,
            agen: kpi.agen,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentKpi(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
         const apiCall = currentKpi
            ? apiClient.put(`/kpi/${currentKpi.id}`, formData)
            : apiClient.post('/kpi', formData);

        try {
            const response = await apiCall;
            Swal.fire('Berhasil!', response.data.message, 'success');
            setIsFormVisible(false);
            setIsModalOpen(false);
            setFormData(initialFormState);
            fetchKpi();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data.', 'error');
        }
    };

    const handleDelete = (kpi) => {
        Swal.fire({
            title: `Yakin hapus data KPI dari ${kpi.unit_kerja}?`,
            text: "Data ini tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonText: 'Batal',
            confirmButtonText: 'Ya, hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await apiClient.delete(`/kpi/${kpi.id}`);
                    Swal.fire('Terhapus!', 'Data KPI berhasil dihapus.', 'success');
                    fetchKpi();
                } catch (error) {
                    Swal.fire('Error', error.response?.data?.message || 'Gagal menghapus data.', 'error');
                }
            }
        });
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
                        <KpiFormFields formData={formData} handleChange={handleChange} />
                        <div className="flex justify-end gap-4 border-t pt-4 mt-4">
                            <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Simpan Data</button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Data Monev KPI Tersimpan</h2>
                    <div className="flex items-center gap-2">
                        {userRole === 'admin' && !isFormVisible && (
                            <button onClick={() => { setCurrentKpi(null); setFormData(initialFormState); setIsFormVisible(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                                <Plus size={18}/>Input Data
                            </button>
                        )}
                        <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            <Download size={18}/>Export ke Excel
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <p>Memuat data...</p> : (
                        <table className="w-full text-xs whitespace-nowrap">
                           <thead className="text-left bg-gray-50 uppercase">
                                <tr>
                                    <th className="p-2 sticky left-0 bg-gray-50">Unit Kerja</th>
                                    <th className="p-2">Tgl</th>
                                    <th className="p-2">Nasabah Baru</th>
                                    <th className="p-2">PDS Akun</th>
                                    <th className="p-2">PDS Transaksi</th>
                                    <th className="p-2">UMI Corner (Rp)</th>
                                    <th className="p-2">G24 (gr)</th>
                                    <th className="p-2">Antam (gr)</th>
                                    {userRole === 'admin' && <th className="p-2 text-center">Aksi</th>}
                                </tr>
                           </thead>
                           <tbody className="divide-y">
                                {kpiList.map(k => (
                                    <tr key={k.id} className="hover:bg-gray-50">
                                        <td className="p-2 font-medium sticky left-0 bg-white">{k.unit_kerja}</td>
                                        <td className="p-2">{new Date(k.tanggal).toLocaleDateString('id-ID')}</td>
                                        <td className="p-2">{k.nasabah_baru}</td>
                                        <td className="p-2">{k.nasabah_akun}</td>
                                        <td className="p-2">{k.nasabah_transaksi}</td>
                                        <td className="p-2">{k.pds_umi_corner}</td>
                                        <td className="p-2">{k.g24}</td>
                                        <td className="p-2">{k.antam}</td>
                                        {userRole === 'admin' && (
                                            <td className="p-2 text-center flex justify-center gap-2">
                                                <button onClick={() => handleOpenModal(k)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(k)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                           </tbody>
                        </table>
                    )}
                </div>
            </div>

             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Edit Data Monev KPI">
                <form onSubmit={handleSubmit}>
                    <KpiFormFields formData={formData} handleChange={handleChange} />
                    <div className="flex justify-end gap-4 border-t pt-4 mt-4">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Simpan Perubahan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MonevKpiPage;