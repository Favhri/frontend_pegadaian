import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/axios';
import Swal from 'sweetalert2';
import { Edit, Trash2, BookText, Download, Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import { initialFormState, FormFields } from '../agen/LaporanHarianAgenPage';
import { formatCurrency } from '../../utils/formatter';

const LaporanHarianAgenAdminPage = () => {
    const [laporanList, setLaporanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLaporan, setCurrentLaporan] = useState(null);
    const [formData, setFormData] = useState(initialFormState);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const fetchLaporan = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/laporan-harian-agen');
            setLaporanList(response.data.data || []);
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

    const handleOpenModal = (laporan) => {
        setCurrentLaporan(laporan);
        const formattedLaporan = {
            ...laporan,
            tanggal: new Date(laporan.tanggal).toISOString().split('T')[0]
        };
        setFormData(formattedLaporan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLaporan(null);
        setFormData(initialFormState);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiCall = currentLaporan
            ? apiClient.put(`/laporan-harian-agen/${currentLaporan.id}`, formData)
            : apiClient.post('/laporan-harian-agen', formData);
    
        try {
            const response = await apiCall;
            Swal.fire('Berhasil!', response.data.message, 'success');
            setIsFormVisible(false);
            setIsModalOpen(false);
            setCurrentLaporan(null);
            setFormData(initialFormState);
            fetchLaporan();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan data.', 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Anda yakin?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await apiClient.delete(`/laporan-harian-agen/${id}`);
                    Swal.fire('Terhapus!', 'Laporan berhasil dihapus.', 'success');
                    fetchLaporan();
                } catch (error) {
                    Swal.fire('Error', 'Gagal menghapus laporan.', 'error');
                }
            }
        });
    };
    
    const handleExport = async () => {
        try {
            const response = await apiClient.get('/laporan-harian-agen/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            const fileName = `Laporan_Harian_Agen_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            Swal.fire('Error', 'Gagal mengunduh file export.', 'error');
        }
    };

    const jumlahClosingan = useMemo(() => {
        const pot = (Number(formData.gadai_pot) || 0) + (Number(formData.mulia_pot) || 0) + (Number(formData.mikro_pot) || 0) + (Number(formData.lainnya_pot) || 0);
        const osl = (Number(formData.gadai_osl) || 0) + (Number(formData.mulia_osl) || 0) + (Number(formData.mikro_osl) || 0) + (Number(formData.lainnya_osl) || 0);
        return { pot, osl };
    }, [formData]);

    return (
        <div className="space-y-6 p-4">
            <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-lg"><BookText size={32} /></div>
                    <div>
                        <h1 className="text-3xl font-bold">Laporan Harian Agen</h1>
                        <p className="text-green-100">Lihat, edit, hapus, dan export laporan harian dari semua agen.</p>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Edit Laporan Harian">
                <form onSubmit={handleSubmit}>
                    <FormFields formData={formData} handleChange={handleChange} />
                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md mt-4">
                        <span className="font-semibold">Total Closingan:</span>
                        <div>
                            <span className="mr-4">POT: <span className="font-bold">{jumlahClosingan.pot}</span></span>
                            <span>OSL: <span className="font-bold">{formatCurrency(jumlahClosingan.osl)}</span></span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 border-t pt-4 mt-2">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Update Laporan</button>
                    </div>
                </form>
            </Modal>

            {isFormVisible && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-down">
                    <h2 className="text-xl font-bold mb-4">Form Input Laporan Harian</h2>
                    <form onSubmit={handleSubmit}>
                        <FormFields formData={formData} handleChange={handleChange} />
                        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md mt-4">
                            <span className="font-semibold">Total Closingan:</span>
                            <div>
                                <span className="mr-4">POT: <span className="font-bold">{jumlahClosingan.pot}</span></span>
                                <span>OSL: <span className="font-bold">{formatCurrency(jumlahClosingan.osl)}</span></span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 border-t pt-4 mt-2">
                            <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Simpan Laporan</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Data Laporan Masuk</h2>
                    <div className="flex gap-2">
                        {!isFormVisible && (
                            <button onClick={() => { setCurrentLaporan(null); setFormData(initialFormState); setIsFormVisible(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200">
                                <Plus size={18}/> Input Laporan
                            </button>
                        )}
                        <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            <Download size={18}/> Export ke Excel
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                {/* <th rowSpan="2" className="p-3 border-b align-bottom sticky left-0 bg-gray-50 z-10">Agen Pelapor</th> */}
                                <th rowSpan="2" className="p-3 border-b align-bottom">Tanggal</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Hari</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Posisi</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Kegiatan</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Agen Baru</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom">Kunjungan</th>
                                <th colSpan="2" className="p-3 text-center border-b border-l">Gadai</th>
                                <th colSpan="2" className="p-3 text-center border-b border-l">Mulia</th>
                                <th colSpan="2" className="p-3 text-center border-b border-l">Mikro</th>
                                <th colSpan="3" className="p-3 text-center border-b border-l">Lainnya</th>
                                <th colSpan="2" className="p-3 text-center border-b border-l bg-green-100">Jumlah Closingan</th>
                                <th rowSpan="2" className="p-3 border-b align-bottom text-center">Aksi</th>
                            </tr>
                            <tr>
                                <th className="p-2 text-center border-l">POT</th>
                                <th className="p-2 text-center">OSL</th>
                                <th className="p-2 text-center border-l">POT</th>
                                <th className="p-2 text-center">OSL</th>
                                <th className="p-2 text-center border-l">POT</th>
                                <th className="p-2 text-center">OSL</th>
                                <th className="p-2 text-center border-l">Nama Produk</th>
                                <th className="p-2 text-center">POT</th>
                                <th className="p-2 text-center">OSL</th>
                                <th className="p-2 text-center border-l bg-green-100">POT</th>
                                <th className="p-2 text-center bg-green-100">OSL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? ( <tr><td colSpan="19" className="text-center py-8">Memuat data...</td></tr> ) 
                            : laporanList.length > 0 ? laporanList.map((laporan) => {
                                const totalPot = (Number(laporan.gadai_pot) || 0) + (Number(laporan.mulia_pot) || 0) + (Number(laporan.mikro_pot) || 0) + (Number(laporan.lainnya_pot) || 0);
                                const totalOsl = (Number(laporan.gadai_osl) || 0) + (Number(laporan.mulia_osl) || 0) + (Number(laporan.mikro_osl) || 0) + (Number(laporan.lainnya_osl) || 0);
                                return (
                                <tr key={laporan.id} className="border-b hover:bg-gray-50">
                                    {/* <td className="p-3 font-semibold sticky left-0 bg-white hover:bg-gray-50 z-10">{laporan.nama_agen_pelapor}</td> */}
                                    <td className="p-3">{new Date(laporan.tanggal).toLocaleDateString('id-ID')}</td>
                                    <td className="p-3">{laporan.hari}</td>
                                    <td className="p-3">{laporan.posisi}</td>
                                    <td className="p-3 truncate max-w-xs">{laporan.kegiatan}</td>
                                    <td className="p-3 text-center">{laporan.pendaftaran_agen_baru || '0'}</td>
                                    <td className="p-3 text-center">{laporan.kunjungan_agen || '0'}</td>
                                    <td className="p-3 text-center border-l">{laporan.gadai_pot || '0'}</td>
                                    <td className="p-3 text-right">{formatCurrency(laporan.gadai_osl)}</td>
                                    <td className="p-3 text-center border-l">{laporan.mulia_pot || '0'}</td>
                                    <td className="p-3 text-right">{formatCurrency(laporan.mulia_osl)}</td>
                                    <td className="p-3 text-center border-l">{laporan.mikro_pot || '0'}</td>
                                    <td className="p-3 text-right">{formatCurrency(laporan.mikro_osl)}</td>
                                    <td className="p-3 border-l">{laporan.lainnya_nama_produk || '-'}</td>
                                    <td className="p-3 text-center">{laporan.lainnya_pot || '0'}</td>
                                    <td className="p-3 text-right">{formatCurrency(laporan.lainnya_osl)}</td>
                                    <td className="p-3 text-center border-l bg-gray-100 font-semibold">{totalPot}</td>
                                    <td className="p-3 text-right bg-gray-100 font-semibold">{formatCurrency(totalOsl)}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleOpenModal(laporan)} className="text-blue-600 hover:text-blue-800" title="Edit"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(laporan.id)} className="text-red-600 hover:text-red-800" title="Hapus"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )}) : (
                                <tr><td colSpan="19" className="text-center py-8">Belum ada data laporan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LaporanHarianAgenAdminPage;