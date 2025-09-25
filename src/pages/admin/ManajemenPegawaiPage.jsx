import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import Swal from 'sweetalert2';
import Modal from '../../components/Modal';

const ManajemenPegawaiPage = () => {
    const [pegawai, setPegawai] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        NIK: '',
        jabatan: '',
        unit_kerja: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPegawai, setCurrentPegawai] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPegawai = async (page = 1, search = '') => {
        try {
            const response = await apiClient.get('/pegawai', {
                params: {
                    page,
                    limit: 10,
                    search,
                },
            });
            setPegawai(response.data.data);
            setPagination({
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
                totalItems: response.data.totalItems,
            });
        } catch (error) {
            console.error('Error fetching pegawai:', error);
        }
    };

    useEffect(() => {
        fetchPegawai(pagination.currentPage, searchTerm);
    }, [pagination.currentPage, searchTerm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setCurrentPegawai(null);
        setFormData({
            nama_lengkap: '',
            NIK: '',
            jabatan: '',
            unit_kerja: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                // PENGECEKAN & DEBUGGING: Pastikan currentPegawai dan id_pegawai ada
                console.log("Data yang akan di-UPDATE:", currentPegawai);
                if (!currentPegawai || !currentPegawai.id_pegawai) {
                    Swal.fire('Error', 'Gagal mengedit data: ID Pegawai tidak ditemukan.', 'error');
                    return;
                }
                await apiClient.put(`/pegawai/${currentPegawai.id_pegawai}`, formData);
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
        // DEBUGGING: Cek ID yang akan dihapus
        console.log("ID yang akan di-DELETE:", id);
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
                    // PENGECEKAN: Pastikan ID tidak null/undefined sebelum request
                    if (!id) {
                         Swal.fire('Error', 'Gagal menghapus data: ID Pegawai tidak ditemukan.', 'error');
                         return;
                    }
                    await apiClient.delete(`/pegawai/${id}`);
                    Swal.fire('Dihapus!', 'Data pegawai telah dihapus.', 'success');
                    fetchPegawai(pagination.currentPage);
                } catch (error) {
                    Swal.fire('Error', 'Gagal menghapus data.', 'error');
                }
            }
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manajemen Pegawai</h1>

            <div className="flex justify-between mb-4">
                <button
                    onClick={() => {
                        setIsEditMode(false);
                        handleShowModal();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Tambah Pegawai
                </button>
                <input
                    type="text"
                    placeholder="Cari pegawai..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border p-2 rounded w-1/3"
                />
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4 border-b">No</th>
                            <th className="py-2 px-4 border-b">Nama Lengkap</th>
                            <th className="py-2 px-4 border-b">NIK</th>
                            <th className="py-2 px-4 border-b">Jabatan</th>
                            <th className="py-2 px-4 border-b">Unit Kerja</th>
                            <th className="py-2 px-4 border-b">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pegawai.map((item, index) => (
                            <tr key={item.id_pegawai || index}>
                                <td className="py-2 px-4 border-b text-center">{(pagination.currentPage - 1) * 10 + index + 1}</td>
                                <td className="py-2 px-4 border-b">{item.nama_lengkap}</td>
                                <td className="py-2 px-4 border-b">{item.NIK}</td>
                                <td className="py-2 px-4 border-b">{item.jabatan}</td>
                                <td className="py-2 px-4 border-b">{item.unit_kerja}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        onClick={() => {
                                            // DEBUGGING: Cek data 'item' saat tombol edit diklik
                                            console.log("Data Pegawai yang di-klik Edit:", item);
                                            setIsEditMode(true);
                                            setCurrentPegawai(item);
                                            setFormData({
                                                nama_lengkap: item.nama_lengkap,
                                                NIK: item.NIK,
                                                jabatan: item.jabatan,
                                                unit_kerja: item.unit_kerja,
                                            });
                                            handleShowModal();
                                        }}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id_pegawai)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <p>Total Pegawai: {pagination.totalItems}</p>
                <div>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 border rounded ${pagination.currentPage === page ? 'bg-blue-500 text-white' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>

            <Modal show={showModal} onClose={handleCloseModal} title={isEditMode ? 'Edit Pegawai' : 'Tambah Pegawai'}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nama Lengkap</label>
                        <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">NIK</label>
                        <input type="text" name="NIK" value={formData.NIK} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Jabatan</label>
                        <input type="text" name="jabatan" value={formData.jabatan} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Unit Kerja</label>
                        <input type="text" name="unit_kerja" value={formData.unit_kerja} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Batal</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManajemenPegawaiPage;