import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// --- Komponen header dan lainnya tetap sama ---
const PageHeader = ({ title, subtitle, icon }) => (
  <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 mb-6 text-white shadow-lg">
    <div className="flex items-center gap-4 mb-2">
      <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
    <p className="text-green-100">{subtitle}</p>
  </div>
);
PageHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
};

const StatsCard = ({ title, value, icon, color }) => (
  <div className={`bg-white p-5 rounded-lg shadow-md border-l-4 border-${color}-500 flex items-center justify-between`}>
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`bg-${color}-100 p-3 rounded-full text-${color}-600`}>{icon}</div>
  </div>
);
StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

const StatusBadge = ({ status }) => {
  const isAktif = status === 'Aktif';
  const baseStyle = 'px-3 py-1 text-xs font-semibold rounded-full border';
  const activeStyle = 'bg-green-50 border-green-200 text-green-700';
  const inactiveStyle = 'bg-red-50 border-red-200 text-red-700';
  return (
    <span className={`${baseStyle} ${isAktif ? activeStyle : inactiveStyle}`}>
      {isAktif ? 'Aktif' : 'Nonaktif'}
    </span>
  );
};
StatusBadge.propTypes = {
  status: PropTypes.oneOf(['Aktif', 'Tidak Aktif']).isRequired,
};

const UserGroupIcon = ({ className = 'h-8 w-8' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const CheckCircleIcon = ({ className = 'h-6 w-6' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ className = 'h-6 w-6' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AgentTable = ({ agents, onDelete }) => {
  if (!agents.length) {
    return <p className="text-center text-gray-500 py-8">Tidak ada data agen.</p>;
  }

  const headers = ["No", "Tanggal", "Cabang", "Outlet", "ID Agen", "CIF", "Nama Agen", "Tgl Pengajuan", "Tgl Activate", "Nama Usaha", "Tipe Agen", "Referral Agen", "NIK", "Nama Mitra Agen", "Aksi"];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 hidden md:table-header-group">
          <tr>
            {headers.map(header => <th key={header} scope="col" className="px-4 py-3">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {agents.map((agent, index) => (
            <tr key={agent.idAgen} className="bg-white border-b md:border-b-0 mb-4 md:mb-0 block md:table-row rounded-lg md:rounded-none shadow-md md:shadow-none">
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">No</span>{index + 1}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">Tanggal</span>{agent.tanggal}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">Cabang</span>{agent.cabang}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">Outlet</span>{agent.outlet}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">ID Agen</span>{agent.idAgen}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">CIF</span>{agent.cif}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">Nama Agen</span>{agent.namaAgen}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">Tgl Pengajuan</span>{agent.tglPengajuan}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">Tgl Activate</span>{agent.tglActivate}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">Nama Usaha</span>{agent.namaUsaha}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">Tipe Agen</span>{agent.tipeAgen}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">Referral Agen</span>{agent.referralAgen}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">NIK</span>{agent.nik}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell border-b md:border-b-0"><span className="font-bold md:hidden">Nama Mitra Agen</span>{agent.namaMitraAgen}</td>
              <td className="p-3 md:px-4 md:py-2 flex justify-between md:table-cell">
                <span className="font-bold md:hidden">Aksi</span>
                <div>
                  <button className="font-medium text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => onDelete(agent.idAgen, agent.namaAgen)} className="font-medium text-red-600 hover:underline ml-4">Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
AgentTable.propTypes = {
  agents: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const ManajemenAgenPage = () => {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const dummyAgents = [
      { idAgen: 'AGN-00123', tanggal: '2025-08-23', cabang: 'Padang', outlet: 'UPC Pasar Raya', cif: '12345678', namaAgen: 'Ahmad Rizki Pratama', tglPengajuan: '2025-08-01', tglActivate: '2025-08-05', namaUsaha: 'Warung Pratama', tipeAgen: 'Perorangan', referralAgen: 'Budi Santoso', nik: '1371012345670001', namaMitraAgen: 'John Doe', status: 'Aktif' },
      { idAgen: 'AGN-00124', tanggal: '2025-08-22', cabang: 'Bukittinggi', outlet: 'UPC Jam Gadang', cif: '87654321', namaAgen: 'Siti Nurhaliza', tglPengajuan: '2025-07-20', tglActivate: '2025-07-25', namaUsaha: 'Toko Nur', tipeAgen: 'Agen Syariah', referralAgen: '-', nik: '1372023456780002', namaMitraAgen: 'Jane Smith', status: 'Aktif' },
      { idAgen: 'AGN-00098', tanggal: '2025-08-21', cabang: 'Solok', outlet: 'UPC Solok', cif: '11223344', namaAgen: 'Budi Santoso', tglPengajuan: '2025-06-15', tglActivate: '2025-06-20', namaUsaha: 'Santoso Jaya', tipeAgen: 'Perorangan', referralAgen: 'Ahmad R.P.', nik: '1373034567890003', namaMitraAgen: 'Mike Ross', status: 'Tidak Aktif' },
    ];
    setAgents(dummyAgents);
  }, []);

  const handleDelete = (agentId, agentName) => {
    MySwal.fire({
      title: `Yakin ingin menghapus agen ${agentName}?`,
      text: "Data yang sudah dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setAgents(prev => prev.filter(agent => agent.idAgen !== agentId));
        MySwal.fire('Terhapus!', `Data agen ${agentName} telah dihapus.`, 'success');
      }
    });
  };

  // **Perbaikan filter**
  const filteredAgents = agents.filter(agent =>
    (agent?.namaAgen || '')
      .toLowerCase()
      .includes((searchTerm || '').toLowerCase())
  );

  const totalAgen = agents.length;
  const agenAktif = agents.filter(a => a.status === 'Aktif').length;
  const agenNonaktif = agents.filter(a => a.status === 'Tidak Aktif').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Manajemen Agen" subtitle="Kelola data, role, dan status akun agen" icon={<UserGroupIcon />} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatsCard title="Total Agen" value={totalAgen} icon={<UserGroupIcon className="h-6 w-6" />} color="sky" />
        <StatsCard title="Agen Aktif" value={agenAktif} icon={<CheckCircleIcon />} color="teal" />
        <StatsCard title="Agen Nonaktif" value={agenNonaktif} icon={<XCircleIcon />} color="rose" />
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
          <button className="bg-green-600 w-full md:w-auto text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center space-x-2 text-sm">
            <PlusIcon />
            <span>Tambah Agen Baru</span>
          </button>
          <div className="w-full md:w-auto flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
            <input
              type="text"
              placeholder="Cari agen..."
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
          </div>
        </div>
        <AgentTable agents={filteredAgents} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ManajemenAgenPage;
