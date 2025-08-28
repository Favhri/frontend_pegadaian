// src/pages/admin/ManajemenUserPage.jsx

import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Modal from '../../components/Modal';
import axios from 'axios';

// --- KOMPONEN-KOMPONEN KECIL ---
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
        <div className={`bg-${color}-100 p-3 rounded-full`}>{icon}</div>
    </div>
);
StatsCard.propTypes = { title: PropTypes.string, value: PropTypes.string, icon: PropTypes.node, color: PropTypes.string };

const UserGroupIcon = ({ className = 'h-6 w-6' }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>);
UserGroupIcon.propTypes = { className: PropTypes.string };
const AdminIcon = ({ className = 'h-6 w-6' }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>);
AdminIcon.propTypes = { className: PropTypes.string };
const ManagerIcon = ({ className = 'h-6 w-6' }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>);
ManagerIcon.propTypes = { className: PropTypes.string };
const StaffIcon = ({ className = 'h-6 w-6' }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>);
StaffIcon.propTypes = { className: PropTypes.string };
const AgenIcon = ({ className = 'h-6 w-6' }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 100-2 1 1 0 000 2z"></path></svg>);
AgenIcon.propTypes = { className: PropTypes.string };

// --- FORM UNTUK MODAL ---
const UserForm = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nama_lengkap: user?.nama_lengkap || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        role: user?.role || 'user',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validasi password hanya jika password diisi
        if (formData.password) {
            if (formData.password !== formData.confirmPassword) {
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Password dan konfirmasi password tidak cocok!' });
                return;
            }
        }

        // Ambil data yang diubah saja, sisanya gunakan data lama
        const dataToSave = {
            id: user?.id,
            nama_lengkap: formData.nama_lengkap !== user?.nama_lengkap ? formData.nama_lengkap : user?.nama_lengkap,
            email: formData.email !== user?.email ? formData.email : user?.email,
            role: formData.role,
            status: user?.status || 'Aktif'
        };

        // Hanya tambahkan password jika diisi
        if (formData.password) {
            dataToSave.password = formData.password;
        }

        console.log('Form data to save:', dataToSave);
        
        // Validasi bahwa nama_lengkap dan email tidak kosong
        if (!dataToSave.nama_lengkap || !dataToSave.email) {
            Swal.fire('Error!', 'Nama lengkap dan email wajib diisi!', 'error');
            return;
        }

        onSave(dataToSave);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder={user ? "Kosongkan jika tidak diubah" : "Masukkan password baru"} required={!user} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Ketik ulang password" required={!user || formData.password} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md"><option value="user">User</option><option value="admin">Admin</option><option value="pimpinan">Pimpinan</option><option value="agen">Agen</option></select></div>
            <div className="flex justify-end gap-4 pt-4 border-t mt-4"><button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button><button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button></div>
        </form>
    );
};
UserForm.propTypes = { user: PropTypes.object, onClose: PropTypes.func.isRequired, onSave: PropTypes.func.isRequired };

// --- KOMPONEN UTAMA HALAMAN ---
const ManajemenUserPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('Semua');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    Swal.fire('Akses Ditolak', 'Anda harus login untuk mengakses halaman ini.', 'error');
                    setLoading(false);
                    return;
                }
                
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                                const responseData = response.data;
                                console.log('Response from API:', responseData);

                                let usersArr = Array.isArray(responseData)
                                    ? responseData
                                    : Array.isArray(responseData.data)
                                        ? responseData.data
                                        : Array.isArray(responseData.users)
                                            ? responseData.users
                                            : [];

                                console.log('Users array before formatting:', usersArr);

                                const formattedUsers = usersArr.map(user => {
                                    console.log('Processing user:', user);
                                    return {
                                        id: user.id,
                                        nama_lengkap: user.nama_lengkap || '',
                                        email: user.email || '',
                                        role: user.role || 'user',
                                        status: user.status || 'Aktif',
                                        tglBergabung: (user.createdAt || user.created_at)
                ? new Date(user.createdAt || user.created_at).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : '-',
            };
            });
                 setUserList(formattedUsers);
            } catch (err) {
                console.error("Gagal mengambil data user:", err);
                const errorMessage = err.response?.status === 401 
                    ? 'Sesi Anda telah berakhir. Silakan login kembali.'
                    : 'Gagal mengambil data user dari server.';
                Swal.fire('Error!', errorMessage, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return userList.filter(user => {
            const matchesSearch = 
                (user.nama_lengkap?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            const matchesRole = filterRole === 'Semua' || 
                (user.role?.toLowerCase() || '') === filterRole.toLowerCase();
            return matchesSearch && matchesRole;
        });
    }, [userList, searchTerm, filterRole]);

    const handleSaveUser = async (userData) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('Token tidak ditemukan');
            
            // Log token structure for debugging
            console.log('Token being used:', token);

            if (userData.id) {
                // Edit user: hanya field yang diubah
                const userLama = userList.find(u => u.id === userData.id) || {};
                // Hanya kirim field yang benar-benar berubah
                const updatePayload = {
                    id: userData.id
                };

                // Bandingkan dan tambahkan hanya field yang berubah
                if (userData.nama_lengkap !== userLama.nama_lengkap) updatePayload.nama_lengkap = userData.nama_lengkap;
                if (userData.email !== userLama.email) updatePayload.email = userData.email;
                if (userData.role !== userLama.role) updatePayload.role = userData.role;
                if (userData.status !== userLama.status) updatePayload.status = userData.status;
                if (userData.password) updatePayload.password = userData.password;

                console.log('Update payload (hanya field yang berubah):', updatePayload);

                const response = await axios.put(`http://localhost:5000/api/users/${userData.id}`, updatePayload, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Update response:', response.data);
                Swal.fire('Berhasil', 'Data user berhasil diupdate!', 'success');
            } else {
                // Tambah user
                await axios.post('http://localhost:5000/api/users', userData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire('Berhasil', 'User baru berhasil ditambahkan!', 'success');
            }
            fetchUsers();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error saving user:', err);
            let errorMsg = 'Gagal simpan data user!';
            if (err.response?.data) {
                errorMsg += '\n' + (err.response.data.message || JSON.stringify(err.response.data));
                console.log('Server response:', err.response.data);
            }
            if (err.response?.status === 401) {
                errorMsg = 'Sesi anda telah berakhir. Silakan login kembali.';
                // Redirect to login or handle expired token
                localStorage.removeItem('authToken');
                window.location.href = '/login';
            }
            Swal.fire('Error!', errorMsg, 'error');
        }
    };

    const openModal = (user = null) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    // Fungsi hapus user
    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('Token tidak ditemukan');
            await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire('Berhasil', 'User berhasil dihapus!', 'success');
            fetchUsers();
        } catch (err) {
            Swal.fire('Error!', err.response?.data?.message || 'Gagal hapus user!', 'error');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <PageHeader title="Manajemen User" subtitle="Kelola data user, role, dan status akun pegawai" icon={<UserGroupIcon className="w-8 h-8" />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                 <StatsCard title="Total User" value={userList.length.toString()} color="blue" icon={<UserGroupIcon />} />
                 <StatsCard title="Admin" value={userList.filter(u => u.role === 'admin').length.toString()} color="red" icon={<AdminIcon />} />
                 <StatsCard title="Pimpinan" value={userList.filter(u => u.role === 'pimpinan').length.toString()} color="purple" icon={<ManagerIcon />} />
                 <StatsCard title="User" value={userList.filter(u => u.role === 'user').length.toString()} color="green" icon={<StaffIcon />} />
                 <StatsCard title="Agen" value={userList.filter(u => u.role === 'agen').length.toString()} color="orange" icon={<AgenIcon />} />
            </div>

            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                    <button onClick={() => openModal()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors w-full md:w-auto">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                        Tambah User Baru
                    </button>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input type="text" placeholder="Cari user..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="p-2 border border-gray-300 rounded-md w-full md:w-64" />
                        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                            <option value="Semua">Semua</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="pimpinan">Pimpinan</option>
                            <option value="agen">Agen</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <p className="text-center py-8 text-gray-500">Memuat data user...</p>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-green-800 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Tgl Bergabung</th>
                                    <th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{user.nama_lengkap}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 capitalize">{user.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full font-semibold text-xs ${user.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{user.tglBergabung}</td>
                                        <td className="px-6 py-4 text-center flex gap-2 justify-center">
                                            <button onClick={() => openModal(user)} className="font-medium text-blue-600 hover:underline">Edit</button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentUser ? 'Edit User' : 'Tambah User Baru'}>
                <UserForm user={currentUser} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} />
            </Modal>
        </div>
    );
};

export default ManajemenUserPage;
