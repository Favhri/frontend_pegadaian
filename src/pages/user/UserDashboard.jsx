import React, { useState } from 'react';
import { 
  Package,
  Target, 
  PieChart,
  Clock,
  DollarSign,
  Search,
  Menu,
  Home,
  Calculator,
  CreditCard,
  Landmark,
  Settings,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [berat, setBerat] = useState('');
  const [kadar, setKadar] = useState('');
  const [hasilEstimasi, setHasilEstimasi] = useState('Masukkan data untuk melihat estimasi pinjaman');

  const hitungGadai = () => {
    const beratNum = parseFloat(berat);
    const kadarNum = parseFloat(kadar);
    const hargaEmasPerGram = 1050000;

    if (beratNum && kadarNum) {
      const nilaiEmas = beratNum * (kadarNum/24) * hargaEmasPerGram;
      const estimasiPinjaman = nilaiEmas * 0.85;
      setHasilEstimasi(`Rp ${estimasiPinjaman.toLocaleString('id-ID')}`);
    } else {
      setHasilEstimasi('Mohon lengkapi semua data');
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home size={20} />,
      path: '/user/dashboard'
    },
    {
      title: 'Kalkulator Gadai',
      icon: <Calculator size={20} />,
      path: '/user/kalkulator'
    },
    {
      title: 'Riwayat Transaksi',
      icon: <CreditCard size={20} />,
      path: '/user/transaksi'
    },
    {
      title: 'Info Cabang',
      icon: <Landmark size={20} />,
      path: '/user/cabang'
    },
    {
      title: 'Pengaturan',
      icon: <Settings size={20} />,
      path: '/user/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white h-screen fixed lg:static w-[280px] transition-all duration-300 ease-in-out z-50
          ${sidebarOpen ? 'left-0' : '-left-[280px] lg:left-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b">
            <span className="text-xl font-bold text-green-700">PEGADAIAN</span>
            <button 
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="px-4 space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="border-t p-4">
            <button className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-700 w-full">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            {/* Profile section */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-medium">U</span>
              </div>
              <span className="text-sm font-medium">User Name</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="text-green-700" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Pinjaman</p>
                  <p className="text-xl font-bold">Rp 5.000.000</p>
                </div>
              </div>
            </div>
            {/* Add more stat cards as needed */}
          </div>

          {/* Calculator Section - keep existing calculator code but update styling */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Kalkulator Gadai</h2>
            <div className="max-w-md">
              <input
                type="number"
                value={berat}
                onChange={(e) => setBerat(e.target.value)}
                placeholder="Berat Emas (gram)"
                className="w-full p-3 rounded-lg text-gray-800 mb-4"
              />
              <input
                type="number"
                value={kadar}
                onChange={(e) => setKadar(e.target.value)}
                placeholder="Kadar Emas (misal: 24)"
                className="w-full p-3 rounded-lg text-gray-800 mb-4"
              />
              <button 
                onClick={hitungGadai}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition duration-300 mb-4"
              >
                Hitung Estimasi
              </button>
              <div className="bg-green-50 p-4 rounded-lg text-center font-semibold">
                {hasilEstimasi}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Transaksi Terakhir</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Add table content */}
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;