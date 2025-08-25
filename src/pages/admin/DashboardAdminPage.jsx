// src/pages/admin/DashboardAdminPage.jsx

import DashboardCard from '../../components/DashboardCard';

const DashboardAdminPage = () => {
  const dashboardData = [
    { icon: '👥', title: 'Total Pegawai', value: '145', subtitle: 'Pegawai aktif' },
    { icon: '📊', title: 'Laporan Bulan Ini', value: '28', subtitle: 'Laporan masuk' },
    { icon: '📅', title: 'Pengajuan Cuti', value: '12', subtitle: 'Menunggu persetujuan' },
    { icon: '📁', title: 'Total Dokumen', value: '1,247', subtitle: 'Dokumen tersimpan' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.map((data, index) => (
          <DashboardCard
            key={index}
            icon={data.icon}
            title={data.title}
            value={data.value}
            subtitle={data.subtitle}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardAdminPage;