import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import { Users, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../../components/Modal';

// Komponen Header dikembalikan sesuai permintaan gambar
const PageHeader = ({ title, subtitle, icon }) => (
    <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
                {icon}
            </div>
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-green-100">{subtitle}</p>
            </div>
        </div>
    </div>
);


const ManajemenPegawaiPage = () => {
    const [pegawaiList, setPegawaiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    // const [currentPegawai, setCurrentPegawai] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalPegawai: 0
    });
    
    const [formData, setFormData] = useState({
        id_pegawai: null,
        nama_lengkap: '',
        NIK: '',
        jabatan: '',
        unit_kerja: ''
    });

    const unitKerjaOptions = [
        "CP TERANDAM", "UPC BANDAR BUAT", "UPC INDARUNG", "UPC MATA AIR", "UPC ALAI",
        "UPC SITEBA", "UPC BALAI BARU", "UPC BELIMBING", "UPC ANDURING", "UPC PARAK LAWEH"
    ];

    const fetchPegawai = async (page = 1) => {
        setLoading(true);
        try {
            const response = await apiClient.get('/pegawai', {
                params: { page, limit: 10 }
            });
            if (response.data.success) {
                setPegawaiList(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching pegawai:', error);
            Swal.fire('Error', 'Gagal memuat data master pegawai.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPegawai(pagination.currentPage);
    }, [pagination.currentPage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenModal = (pegawai = null) => {
    if (pegawai) {
        // Langsung set semua data pegawai ke formData
        setIsEditMode(true);
        setFormData(pegawai); 
    } else {
        // Reset formData untuk mode tambah data baru
        setIsEditMode(false);
        setFormData({
            id_pegawai: null,
            nama_lengkap: '',
            NIK: '',
            jabatan: '',
            unit_kerja: ''
        });
    }
    setIsModalOpen(true);
};

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPegawai(null);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isEditMode) {
            // Ambil ID dari formData, bukan currentPegawai lagi
            await apiClient.put(`/pegawai/${formData.id_pegawai}`, formData);
            Swal.fire('Sukses', 'Data pegawai berhasil diperbarui.', 'success');
        } else {
            await apiClient.post('/pegawai', formData);
            Swal.fire('Sukses', 'Data pegawai berhasil ditambahkan.', 'success');
        }
        fetchPegawai(pagination.currentPage);
        handleCloseModal();
    } catch (error) {
        console.error('Error submitting form:', error);
        Swal.fire('Error', 'Gagal menyimpan data pegawai.', 'error');
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
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await apiClient.delete(`/pegawai/${id}`);
                    Swal.fire('Dihapus!', 'Data pegawai telah dihapus.', 'success');
                    fetchPegawai(pagination.currentPage);
                } catch (error) {
                    Swal.fire('Error', 'Gagal menghapus data.', 'error');
                }
            }
        });
    };
    
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    return (
        <div className="space-y-6">
            {/* --- HEADER BARU SESUAI GAMBAR --- */}
            <PageHeader 
                title="Manajemen Pegawai" 
                subtitle="Kelola data master semua pegawai di perusahaan" 
                icon={<Users size={28} />} 
            />
            
            <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                <PlusCircle size={20} />
                Tambah Pegawai Baru
            </button>

            <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">Daftar Semua Pegawai</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-800 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">No</th>
                                <th className="px-6 py-3">Nama Lengkap</th>
                                <th className="px-6 py-3">NIK</th>
                                <th className="px-6 py-3">Jabatan</th>
                                <th className="px-6 py-3">Unit Kerja</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-4">Memuat data...</td></tr>
                            ) : pegawaiList.length > 0 ? (
                                pegawaiList.map((pegawai, index) => (
                                    <tr key={pegawai.id_pegawai} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{(pagination.currentPage - 1) * 10 + index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{pegawai.nama_lengkap}</td>
                                        <td className="px-6 py-4">{pegawai.NIK}</td>
                                        <td className="px-6 py-4">{pegawai.jabatan}</td>
                                        <td className="px-6 py-4">{pegawai.unit_kerja}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => handleOpenModal(pegawai)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                                <button onClick={() => handleDelete(pegawai.id_pegawai)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="text-center py-4">Tidak ada data pegawai.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                        Halaman {pagination.currentPage} dari {pagination.totalPages} ({pagination.totalPegawai} total pegawai)
                    </span>
                    <div className="inline-flex items-center gap-2">
                        <button 
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditMode ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">NIK</label>
                        <input type="text" name="NIK" value={formData.NIK} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jabatan</label>
                        <input type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Unit Kerja</label>
                        <select name="unit_kerja" value={formData.unit_kerja} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Pilih Unit Kerja</option>
                            {unitKerjaOptions.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManajemenPegawaiPage;