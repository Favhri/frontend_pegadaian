// favhri/frontend_pegadaian/frontend_pegadaian-d3466cf846b15b6230fd2001ed5e5bbe9d0e3e4e/src/pages/user/ArsipDokumenUserPage.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import apiClient from '../../api/axios';
import Swal from 'sweetalert2';
import Modal from '../../components/Modal';
import { Filter, Briefcase, FileText, UploadCloud, Download, Eye } from 'lucide-react';

const ArsipDokumenUserPage = () => {
    const [dokumenList, setDokumenList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ unit_kerja: 'Semua', kategori: 'Semua' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const unitKerjaOptions = ["CP TERANDAM", "UPC BANDAR BUAT", "UPC INDARUNG", "UPC MATA AIR", "UPC ALAI", "UPC SITEBA", "UPC BALAI BARU", "UPC BELIMBING", "UPC ANDURING", "UPC PARAK LAWEH"];
    const kategoriOptions = ["SDM","Keuangan", "Bisnis", "Resiko", "Logistik", "Surat Laporan", "Lainnya"];

    const fetchDokumen = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/arsip', { params: filters });
            if (response.data.success) {
                setDokumenList(response.data.data);
            }
        } catch (error) {
            Swal.fire('Error', 'Gagal memuat data arsip.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDokumen();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handlePreview = (fileName) => {
        if (!fileName) return Swal.fire('Error', 'Nama file tidak valid.', 'error');
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const previewable = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
        if (previewable.includes(fileExtension)) {
            window.open(`http://localhost:5000/uploads/${fileName}`, '_blank');
        } else {
            Swal.fire('Info', 'Tipe file ini tidak bisa di-preview, silakan download.', 'info');
        }
    };

    const handleDownload = async (fileName) => {
        if (!fileName) return Swal.fire('Error', 'Nama file tidak valid.', 'error');
        try {
            const response = await apiClient.get(`/arsip/download/${fileName}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            Swal.fire('Error', 'Gagal mengunduh file.', 'error');
        }
    };
    
    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                    <Briefcase size={32} />
                    <div>
                        <h1 className="text-3xl font-bold">Arsip Dokumen</h1>
                        <p className="text-lg">Temukan dan unggah dokumen penting perusahaan di sini.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* ====> PERUBAHAN UTAMA DI SINI <==== */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b">
                    {/* Bagian Kiri: Filter */}
                    <div className="flex items-center gap-4">
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
                    {/* Bagian Kanan: Tombol Upload */}
                    <div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                            <UploadCloud size={20} /> Upload
                        </button>
                    </div>
                </div>

                {loading ? <p className="text-center py-8">Memuat data...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dokumenList.length > 0 ? dokumenList.map(doc => (
                            <div key={doc.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex flex-col justify-between hover:shadow-lg hover:border-green-500 transition-all">
                                <div className="flex items-start gap-4">
                                    <FileText className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-gray-800 break-words">{doc.nama_dokumen}</h4>
                                        <p className="text-sm text-gray-500">{doc.kategori} - {doc.unit_kerja}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Oleh {doc.uploader} pada {new Date(doc.created_at).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        {formatBytes(doc.file_size)}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handlePreview(doc.file_name)} className="text-blue-500 hover:text-blue-700" title="Preview"><Eye size={18} /></button>
                                        <button onClick={() => handleDownload(doc.file_name)} className="text-green-500 hover:text-green-700" title="Download"><Download size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="col-span-full text-center py-8 text-gray-500">Tidak ada dokumen yang cocok dengan filter.</p>
                        )}
                    </div>
                )}
            </div>
            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchDokumen} unitKerjaOptions={unitKerjaOptions} kategoriOptions={kategoriOptions} />
        </div>
    );
};

const UploadModal = ({ isOpen, onClose, onSuccess, unitKerjaOptions, kategoriOptions }) => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({ nama_dokumen: '', kategori: '', unit_kerja: '' });
    const [isUploading, setIsUploading] = useState(false);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || isUploading) return;
        setIsUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('nama_dokumen', formData.nama_dokumen);
        data.append('kategori', formData.kategori);
        data.append('unit_kerja', formData.unit_kerja);
        try {
            await apiClient.post('/arsip/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            Swal.fire('Berhasil!', 'Dokumen berhasil diupload.', 'success');
            onSuccess();
            onClose();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal mengupload dokumen.', 'error');
        } finally { setIsUploading(false); }
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Dokumen Baru">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Dokumen *</label><input type="text" name="nama_dokumen" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label><select name="kategori" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required><option value="">Pilih Kategori</option>{kategoriOptions.map(kat => <option key={kat} value={kat}>{kat}</option>)}</select></div>
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja *</label><select name="unit_kerja" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required><option value="">Pilih Unit Kerja</option>{unitKerjaOptions.map(unit => <option key={unit} value={unit}>{unit}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Upload File *</label><input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" required/></div>
                <div className="flex justify-end gap-4 pt-4 border-t"><button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button><button type="submit" disabled={isUploading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400">{isUploading ? 'Mengupload...' : 'Upload'}</button></div>
            </form>
        </Modal>
    );
};
UploadModal.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired, onSuccess: PropTypes.func.isRequired, unitKerjaOptions: PropTypes.array.isRequired, kategoriOptions: PropTypes.array.isRequired };

export default ArsipDokumenUserPage;