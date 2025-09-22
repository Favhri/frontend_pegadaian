import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import apiClient from '../../api/axios';
import Modal from '../../components/Modal';
import { UploadCloud, Filter, Briefcase, Download, Eye, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatFileSize } from '../../utils/formatter';

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

const UploadModal = ({ isOpen, onClose, onSuccess, unitKerjaOptions, kategoriOptions }) => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({ nama_dokumen: '', kategori: '', sub_kategori: '', unit_kerja: '' });
    const [isUploading, setIsUploading] = useState(false);

    const resetForm = () => {
        setFile(null);
        setFormData({ nama_dokumen: '', kategori: '', sub_kategori: '', unit_kerja: '' });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'kategori' && value !== 'Bisnis') {
            setFormData({ ...formData, [name]: value, sub_kategori: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !formData.kategori || !formData.unit_kerja || !formData.nama_dokumen || isUploading) return;
        if (formData.kategori === 'Bisnis' && !formData.sub_kategori) {
            Swal.fire('Peringatan', 'Sub-kategori wajib diisi untuk kategori Bisnis.', 'warning');
            return;
        }

        setIsUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('nama_dokumen', formData.nama_dokumen);
        data.append('kategori', formData.kategori);
        if (formData.kategori === 'Bisnis') {
            data.append('sub_kategori', formData.sub_kategori);
        }
        data.append('unit_kerja', formData.unit_kerja);
        
        try {
            await apiClient.post('/arsip/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            Swal.fire('Berhasil!', 'Dokumen berhasil diupload.', 'success');
            onSuccess();
            resetForm();
            onClose();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal mengupload dokumen.', 'error');
        } finally {
            setIsUploading(false);
        }
    };
    
    const bisnisKategori = kategoriOptions.find(k => typeof k === 'object' && k.name === "Bisnis");

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Dokumen Baru">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dokumen *</label>
                    <input type="text" name="nama_dokumen" value={formData.nama_dokumen} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required>
                        <option value="">Pilih Kategori</option>
                        {kategoriOptions.map((kat, index) => (
                            typeof kat === 'string' 
                                ? <option key={index} value={kat}>{kat}</option>
                                : <option key={index} value={kat.name}>{kat.name}</option>
                        ))}
                    </select>
                 </div>
                 
                 {formData.kategori === 'Bisnis' && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Kategori Bisnis *</label>
                        <select name="sub_kategori" value={formData.sub_kategori} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required>
                            <option value="">Pilih Sub-Kategori</option>
                            {bisnisKategori?.sub.map(subKat => (
                                <option key={subKat} value={subKat}>{subKat}</option>
                            ))}
                        </select>
                     </div>
                 )}

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja *</label>
                    <select name="unit_kerja" value={formData.unit_kerja} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required>
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
                    <button type="submit" disabled={isUploading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400">{isUploading ? 'Mengupload...' : 'Upload'}</button>
                </div>
            </form>
        </Modal>
    );
};
UploadModal.propTypes = { isOpen: PropTypes.bool, onClose: PropTypes.func, onSuccess: PropTypes.func, unitKerjaOptions: PropTypes.array, kategoriOptions: PropTypes.array };


const ArsipDokumenUserPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dokumenList, setDokumenList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ unit_kerja: 'Semua', kategori: 'Semua', sub_kategori: 'Semua' });

    const unitKerjaOptions = ["CP TERANDAM", "UPC BANDAR BUAT", "UPC INDARUNG", "UPC MATA AIR", "UPC ALAI", "UPC SITEBA", "UPC BALAI BARU", "UPC BELIMBING", "UPC ANDURING", "UPC PARAK LAWEH"];
    const kategoriOptions = [
        "SDM", "Keuangan", { name: "Bisnis", sub: ["Pemasaran & Promosi","Peraturan Gadai", "Peraturan Non Gadai", "Peraturan Emas"] },
        "Resiko", "Logistik", "Surat Laporan", "Lainnya"
    ];

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
        const newFilters = { ...filters, [name]: value };
        if (name === 'kategori' && value !== 'Bisnis') {
            newFilters.sub_kategori = 'Semua';
        }
        setFilters(newFilters);
    };

   const handlePreview = (fileName) => {
    // URL langsung ke file statis, bukan melalui /api
    const url = `${apiClient.defaults.baseURL.replace('/api', '')}/uploads/${fileName}`;
    window.open(url, '_blank');
};

    const handleDownload = async (id, nama_dokumen) => {
        try {
            const response = await apiClient.get(`/arsip/download/${id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nama_dokumen);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            Swal.fire('Error', 'Gagal mengunduh file.', 'error');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6 space-y-6">
            <PageHeader title="Arsip Dokumen Digital" subtitle="Temukan dan kelola dokumen penting perusahaan" icon={<Briefcase size={32} />} />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"><UploadCloud size={20} /> Upload Dokumen Baru</button>
                    
                    <div className="w-full md:w-auto flex flex-wrap items-center gap-4">
                        <Filter size={20} className="text-gray-500" />
                        <select name="unit_kerja" value={filters.unit_kerja} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md bg-white text-sm">
                            <option value="Semua">Semua Unit</option>
                            {unitKerjaOptions.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                        <select name="kategori" value={filters.kategori} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md bg-white text-sm">
                            <option value="Semua">Semua Kategori</option>
                            {kategoriOptions.map((kat, index) => (
                                typeof kat === 'string' ? <option key={index} value={kat}>{kat}</option> : <option key={index} value={kat.name}>{kat.name}</option>
                            ))}
                        </select>
                        {filters.kategori === 'Bisnis' && (
                            <select name="sub_kategori" value={filters.sub_kategori} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md bg-white text-sm">
                                <option value="Semua">Semua Sub-Kategori</option>
                                {kategoriOptions.find(k => k.name === "Bisnis")?.sub.map(subKat => (
                                    <option key={subKat} value={subKat}>{subKat}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                {['Nama Dokumen', 'Kategori', 'Unit Kerja', 'Uploader', 'Tgl Upload', 'Ukuran', 'Aksi'].map(h => <th key={h} className="text-left py-3 px-4 font-semibold text-sm text-gray-600">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
                            ) : dokumenList.length > 0 ? (
                                dokumenList.map(doc => (
                                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 flex items-center gap-3"><FileText size={18} className="text-green-500" /><div><p className="font-medium text-gray-800">{doc.nama_dokumen}</p></div></td>
                                        <td className="py-3 px-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${doc.kategori === 'Bisnis' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{doc.kategori}{doc.sub_kategori ? ` / ${doc.sub_kategori}` : ''}</span></td>
                                        <td className="py-3 px-4 text-gray-600">{doc.unit_kerja}</td>
                                        <td className="py-3 px-4 text-gray-600">{doc.uploader}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{formatDistanceToNow(new Date(doc.created_at), { addSuffix: true, locale: id })}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{formatFileSize(doc.file_size)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handlePreview(doc.file_name)} className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"><Eye size={18} /></button>
                                                <button onClick={() => handleDownload(doc.id, doc.file_name)} className="text-gray-500 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"><Download size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" className="text-center py-8 text-gray-500">Tidak ada dokumen yang ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <UploadModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchDokumen} 
                unitKerjaOptions={unitKerjaOptions} 
                kategoriOptions={kategoriOptions} 
            />
        </div>
    );
};

export default ArsipDokumenUserPage;