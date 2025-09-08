// src/pages/admin/ArsipDokumenPage.jsx

import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import Modal from '../../components/Modal';
import { UploadCloud, Filter, Trash2, FileText, Briefcase, Calendar, HardDrive } from 'lucide-react';

// ... (Komponen PageHeader & StatsCard tidak perlu diubah)
const PageHeader = ({ title, subtitle, icon }) => (
    <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 mb-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
            <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <p className="text-green-100">{subtitle}</p>
    </div>
);
PageHeader.propTypes = { title: PropTypes.string, subtitle: PropTypes.string, icon: PropTypes.node };

const StatsCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-5 rounded-lg shadow-md border-l-4 border-${color}-500 flex items-center justify-between`}>
        <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`bg-${color}-100 p-3 rounded-full text-${color}-600`}>{icon}</div>
    </div>
);
StatsCard.propTypes = { title: PropTypes.string.isRequired, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, icon: PropTypes.node.isRequired, color: PropTypes.string.isRequired };


const ArsipDokumenPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dokumenList, setDokumenList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ unit_kerja: 'Semua', kategori: 'Semua' });

    const unitKerjaOptions = ["Kantor Cabang", "CP TERANDAM", "UPC BANDAR BUAT", "UPC INDARUNG", "UPC MATA AIR", "UPC ALAI", "UPC SITEBA", "UPC BALAI BARU", "UPC BELIMBING", "UPC ANDURING", "UPC PARAK LAWEH"];
    const kategoriOptions = ["Keuangan", "Operasional", "Legal", "Inventory", "SDM", "Lainnya"];

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

    useEffect(() => {
        fetchDokumen();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6 space-y-6">
            <PageHeader
                title="Arsip Dokumen Digital"
                subtitle="Kelola dan arsipkan dokumen penting perusahaan secara terpusat"
                icon={<Briefcase size={32} />}
            />
            
            {/* ... (StatsCard bisa ditambahkan di sini kalau perlu) ... */}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
                    >
                        <UploadCloud size={20} />
                        Upload Dokumen Baru
                    </button>
                    <div className="w-full md:w-auto flex items-center gap-4">
                        <Filter size={20} className="text-gray-500" />
                        <select name="unit_kerja" value={filters.unit_kerja} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md bg-white">
                            <option value="Semua">Semua Unit</option>
                            {unitKerjaOptions.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                        <select name="kategori" value={filters.kategori} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md bg-white">
                            <option value="Semua">Semua Kategori</option>
                            {kategoriOptions.map(kat => <option key={kat} value={kat}>{kat}</option>)}
                        </select>
                    </div>
                </div>

                {/* Tabel Dokumen */}
                <div className="overflow-x-auto">
                    {loading ? <p className="text-center py-8">Memuat data...</p> : (
                         <table className="w-full text-sm text-left text-gray-600">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                 <tr>
                                     <th className="px-6 py-3">Nama Dokumen</th>
                                     <th className="px-6 py-3">Kategori</th>
                                     <th className="px-6 py-3">Unit Kerja</th>
                                     <th className="px-6 py-3">Tanggal Upload</th>
                                     <th className="px-6 py-3">Uploader</th>
                                     <th className="px-6 py-3 text-center">Aksi</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {dokumenList.map(doc => (
                                     <tr key={doc.id} className="bg-white border-b hover:bg-gray-50">
                                         <td className="px-6 py-4 font-medium text-gray-900">{doc.nama_dokumen}</td>
                                         <td className="px-6 py-4">{doc.kategori}</td>
                                         <td className="px-6 py-4">{doc.unit_kerja}</td>
                                         <td className="px-6 py-4">{new Date(doc.created_at).toLocaleDateString('id-ID')}</td>
                                         <td className="px-6 py-4">{doc.uploader}</td>
                                         <td className="px-6 py-4 text-center">
                                             <button className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                    )}
                </div>
            </div>

            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchDokumen} unitKerjaOptions={unitKerjaOptions} kategoriOptions={kategoriOptions} />
        </div>
    );
};

const UploadModal = ({ isOpen, onClose, onSuccess, unitKerjaOptions, kategoriOptions }) => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({ nama_dokumen: '', kategori: '', unit_kerja: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            Swal.fire('Error', 'Mohon pilih file yang akan diupload.', 'error');
            return;
        }

        const data = new FormData();
        data.append('file', file);
        data.append('nama_dokumen', formData.nama_dokumen);
        data.append('kategori', formData.kategori);
        data.append('unit_kerja', formData.unit_kerja);

        try {
            await apiClient.post('/arsip/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire('Berhasil!', 'Dokumen berhasil diupload.', 'success');
            onSuccess();
            onClose();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal mengupload dokumen.', 'error');
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Dokumen Baru">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... (Form fields seperti di ArsipDokumenPage sebelumnya) ... */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dokumen *</label>
                    <input type="text" name="nama_dokumen" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <select name="kategori" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required>
                        <option value="">Pilih Kategori</option>
                        {kategoriOptions.map(kat => <option key={kat} value={kat}>{kat}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja *</label>
                    <select name="unit_kerja" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required>
                        <option value="">Pilih Unit Kerja</option>
                        {unitKerjaOptions.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload File *</label>
                    <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" required/>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Upload</button>
                </div>
            </form>
        </Modal>
    );
};
UploadModal.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired, onSuccess: PropTypes.func.isRequired, unitKerjaOptions: PropTypes.array.isRequired, kategoriOptions: PropTypes.array.isRequired };


export default ArsipDokumenPage;