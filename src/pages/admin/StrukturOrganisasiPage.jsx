// src/pages/StrukturOrganisasiPage.jsx
import React from 'react';
import TreeNode from "../../components/TreeNode"; // Komponen rekursif yang akan kita buat

// Contoh data struktur organisasi dalam format nested object
const dataStruktur = {
  id: 1,
  nama: 'Riki Rolando',
  jabatan: 'Pimpinan Cabang',
  avatar: 'https://i.pravatar.cc/150?u=dirut',
  children: [
    {
      id: 2,
      nama: 'Eka Chandra',
      jabatan: 'Direktur Keuangan',
      avatar: 'https://i.pravatar.cc/150?u=dirkeu',
      children: [
        { id: 6, nama: 'Siti Nurhaliza', jabatan: 'Manager Akuntansi', avatar: 'https://i.pravatar.cc/150?u=manakutansi', children: [] },
        { id: 7, nama: 'Budi Santoso', jabatan: 'Manager Anggaran', avatar: 'https://i.pravatar.cc/150?u=mananggaran', children: [] },
      ],
    },
    {
      id: 3,
      nama: 'Damar Wulan',
      jabatan: 'Direktur SDM & Logistik',
      avatar: 'https://i.pravatar.cc/150?u=dirsdm',
      children: [
        { id: 8, nama: 'Diana Putri', jabatan: 'Manager Rekrutmen', avatar: 'https://i.pravatar.cc/150?u=manrekrut', children: [] },
      ],
    },
    {
      id: 4,
      nama: 'Ridwan Kamil',
      jabatan: 'Direktur Operasional',
      avatar: 'https://i.pravatar.cc/150?u=dirops',
      children: [
        { id: 9, nama: 'Agus Wijaya', jabatan: 'Manager Produk', avatar: 'https://i.pravatar.cc/150?u=manproduk', children: [] },
        { id: 10, nama: 'Ahmad Rizki', jabatan: 'Manager Layanan', avatar: 'https://i.pravatar.cc/150?u=manlayan', children: [] },
      ],
    },
  ],
};


const StrukturOrganisasiPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Struktur Organisasi</h1>
      <p className="text-gray-500 mb-8">Visualisasi hierarki jabatan di PT. Pegadaian.</p>
      
      {/* Container untuk chart, dibuat auto-scroll horizontal jika terlalu lebar */}
      <div className="overflow-x-auto py-4">
        <div className="inline-block">
          <ul className="org-chart">
            <TreeNode node={dataStruktur} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StrukturOrganisasiPage;