// src/pages/admin/StrukturOrganisasiPage.jsx
import React from 'react';
import TreeNode from "../../components/TreeNode";
import '../../index.css';

const dataStruktur = {
  id: 1,
  nama: 'Riki Rolando',
  jabatan: 'Pimpinan Kantor Cabang',
  children: [
    {
      id: 2,
      nama: 'Eka Isra Wahyuli',
      jabatan: 'Manager Bisnis',
      children: [
        { 
          id: 3, 
          nama: 'Unit Bisnis', 
          jabatan: 'Divisi Unit Bisnis', 
          children: [
            // 9 UPC di bawah Unit Bisnis
            { 
              id: 4, 
              nama: 'Ahmad Zaelani', 
              jabatan: 'Kepala Unit Pelayanan Cabang (UPC) 1', 
              children: [
                { id: 5, nama: 'Putri Wulandari', jabatan: 'Penaksir', children: [] },
                { id: 6, nama: 'Gilang Ramadhan', jabatan: 'Pengelola Agunan', children: [] },
                { id: 7, nama: 'Siti Aminah', jabatan: 'Account Officer', children: [] },
                { id: 8, nama: 'Doni Setiawan', jabatan: 'Kasir', children: [] },
              ]
            },
            { 
              id: 9, 
              nama: 'Budi Santoso', 
              jabatan: 'Kepala Unit Pelayanan Cabang (UPC) 2', 
              children: [
                { id: 10, nama: 'Rina Sari', jabatan: 'Penaksir', children: [] },
                { id: 11, nama: 'Indra Gunawan', jabatan: 'Pengelola Agunan', children: [] },
                { id: 12, nama: 'Lisa Permata', jabatan: 'Account Officer', children: [] },
                { id: 13, nama: 'Agus Priyanto', jabatan: 'Kasir', children: [] },
              ]
            },
            { 
              id: 14, 
              nama: 'Sari Dewanti', 
              jabatan: 'Kepala Unit Pelayanan Cabang (UPC) 3', 
              children: [
                { id: 15, nama: 'Yoga Pratama', jabatan: 'Penaksir', children: [] },
                { id: 16, nama: 'Fitri Handayani', jabatan: 'Pengelola Agunan', children: [] },
                { id: 17, nama: 'Rizki Ananda', jabatan: 'Account Officer', children: [] },
                { id: 18, nama: 'Wawan Setiawan', jabatan: 'Kasir', children: [] },
              ]
            },
            { 
              id: 19, 
              nama: 'Toni Kurniawan', 
              jabatan: 'Kepala Unit Pelayanan Cabang (UPC) 4', 
              children: [
                { id: 20, nama: 'Diana Sartika', jabatan: 'Penaksir', children: [] },
                { id: 21, nama: 'Eko Prasetyo', jabatan: 'Pengelola Agunan', children: [] },
                { id: 22, nama: 'Nina Marlina', jabatan: 'Account Officer', children: [] },
                { id: 23, nama: 'Haris Maulana', jabatan: 'Kasir', children: [] },
              ]
            },
            { 
              id: 24, 
              nama: 'Linda Kartika', 
              jabatan: 'Kepala Unit Pelayanan Cabang (UPC) 5', 
              children: [
                { id: 25, nama: 'Ferry Adiputra', jabatan: 'Penaksir', children: [] },
                { id: 26, nama: 'Mega Utami', jabatan: 'Pengelola Agunan', children: [] },
                { id: 27, nama: 'Bayu Saputra', jabatan: 'Account Officer', children: [] },
                { id: 28, nama: 'Citra Dewi', jabatan: 'Kasir', children: [] },
              ]
            },
            { 
              id: 29, 
              nama: 'Joko Widodo', 
              jabatan: 'Kepala Unit Pelayanan Cabang (UPC) 6', 
              children: [
                { id: 30, nama: 'Ayu Lestari', jabatan: 'Penaksir', children: [] },
                { id: 31, nama: 'Dimas Prasetya', jabatan: 'Pengelola Agunan', children: [] },
                { id: 32, nama: 'Sinta Rahayu', jabatan: 'Account Officer', children: [] },
                { id: 33, nama: 'Irwan Setyadi', jabatan: 'Kasir', children: [] },
              ]
            },
            { 
              id: 34, 
              nama: 'Maya Sari', 
              jabatan: 'Kepala Unit Pelayanan Cabang (UPC) 7', 
              children: [
                { id: 35, nama: 'Rendi Pratama', jabatan: 'Penaksir', children: [] },
                { id: 36, nama: 'Dewi Anggraeni', jabatan: 'Pengelola Agunan', children: [] },
                { id: 37, nama: 'Andi Kurniawan', jabatan: 'Account Officer', children: [] },
                { id: 38, nama: 'Lila Safitri', jabatan: 'Kasir', children: [] },
              ]
            },
            { 
              id: 39, 
              nama: 'Reza Fahlevi', 
              jabatan: 'Kepala Unit Pelayanan Cabang (UPC) 8', 
              children: [
                { id: 40, nama: 'Vina Oktavia', jabatan: 'Penaksir', children: [] },
                { id: 41, nama: 'Surya Dinata', jabatan: 'Pengelola Agunan', children: [] },
                { id: 42, nama: 'Rika Handayani', jabatan: 'Account Officer', children: [] },
                { id: 43, nama: 'Fajar Nugraha', jabatan: 'Kasir', children: [] },
              ]
            },
            { 
              id: 44, 
              nama: 'Nita Purnama', 
              jabatan: 'Kepala Unit Pelayanan Cabang (UPC) 9', 
              children: [
                { id: 45, nama: 'Kevin Pratama', jabatan: 'Penaksir', children: [] },
                { id: 46, nama: 'Siska Amelia', jabatan: 'Pengelola Agunan', children: [] },
                { id: 47, nama: 'Dedy Wijaya', jabatan: 'Account Officer', children: [] },
                { id: 48, nama: 'Yuni Astuti', jabatan: 'Kasir', children: [] },
              ]
            },
          ]
        },
        { 
          id: 49, 
          nama: 'Dewi Lestari', 
          jabatan: 'Kepala Unit Bisnis Non Gadai', 
          children: [
            { id: 50, nama: 'Hendra Wijaya', jabatan: 'Account Officer', children: [] },
            { id: 51, nama: 'Maya Indah', jabatan: 'Fungsi KUR', children: [] },
          ]
        },
      ],
    },
    {
      id: 52,
      nama: 'Rahmat Hidayat',
      jabatan: 'Operasional Officer',
      children: [],
      layout: 'special-case' // Direct report ke Pimpinan tapi posisi visual sejajar dengan staf Unit Non Gadai
    }
  ],
};

const StrukturOrganisasiPage = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Struktur Organisasi Kantor Cabang</h1>
        <p className="text-gray-500 text-sm">Visualisasi hierarki jabatan dan penanggung jawab di PT. Pegadaian</p>
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