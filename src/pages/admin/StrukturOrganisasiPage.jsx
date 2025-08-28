// src/pages/admin/StrukturOrganisasiPage.jsx
import React from 'react';
import TreeNode from "../../components/TreeNode";
import '../../index.css';

const dataStruktur = {
  id: 1,
  nama: 'Riki Rolando',
  jabatan: 'Pimpinan Kantor Cabang',
  avatar: 'https://i.pravatar.cc/150?u=pincab',
  children: [
    {
      id: 2,
      nama: 'Eka Isra Wahyuli',
      jabatan: 'Manager Bisnis',
      avatar: 'https://i.pravatar.cc/150?u=unitbisnis',
      children: [
        { 
          id: 3, 
          nama: 'Ahmad Zaelani', 
          jabatan: 'Kepala Unit Pelayanan Cabang (UPC)', 
          avatar: 'https://i.pravatar.cc/150?u=upc',
          children: [
            { id: 6, nama: 'Putri Wulandari', jabatan: 'Penaksir', avatar: 'https://i.pravatar.cc/150?u=penaksir1', children: [] },
            { id: 7, nama: 'Gilang Ramadhan', jabatan: 'Pengelola Agunan', avatar: 'https://i.pravatar.cc/150?u=agunan', children: [] },
            { id: 8, nama: 'Siti Aminah', jabatan: 'Account Officer', avatar: 'https://i.pravatar.cc/150?u=ao1', children: [] },
            { id: 9, nama: 'Doni Setiawan', jabatan: 'Kasir', avatar: 'https://i.pravatar.cc/150?u=kasir1', children: [] },
          ]
        },
        { 
          id: 4, 
          nama: 'Dewi Lestari', 
          jabatan: 'Kepala Unit Bisnis Non Gadai', 
          avatar: 'https://i.pravatar.cc/150?u=nongadai',
          children: [
            { id: 10, nama: 'Hendra Wijaya', jabatan: 'Account Officer', avatar: 'https://i.pravatar.cc/150?u=ao2', children: [] },
            { id: 11, nama: 'Maya Indah', jabatan: 'Fungsi KUR', avatar: 'https://i.pravatar.cc/150?u=kur', children: [] },
          ]
        },
      ],
    },
    {
      id: 5,
      nama: 'Rahmat Hidayat',
      jabatan: 'Operasional Officer',
      avatar: 'https://i.pravatar.cc/150?u=ops',
      children: [],
      layout: 'special-case' 
    }
  ],
};

const StrukturOrganisasiPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Struktur Organisasi Kantor Cabang</h1>
        <p className="text-gray-500">Visualisasi hierarki jabatan dan penanggung jawab di PT. Pegadaian.</p>
      </div>
      <div className="overflow-x-auto py-4">
        <div className="inline-block min-w-full">
          <ul className="org-chart">
            <TreeNode node={dataStruktur} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StrukturOrganisasiPage;