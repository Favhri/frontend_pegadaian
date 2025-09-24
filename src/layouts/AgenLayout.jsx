// src/layouts/AgenLayout.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import AgenSidebar from '../components/navigation/AgenSidebar'; // Sidebar khusus Agen
import { Menu } from 'lucide-react';

const AgenLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Ambil nama user dari localStorage untuk ditampilkan di header
  const getUserName = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user')); 
        return user?.nama_lengkap || 'Agen';
    } catch {
        return 'Agen';
    }
  };
  const userName = getUserName();

  return (
    <div className="flex bg-gray-50 min-h-screen">
        <aside className="top-0 h-screen">
      <AgenSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>
      <div className="flex-1">
        <div className="lg:ml-[280px]">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Overlay untuk mobile */}
    {sidebarOpen && (
      <div 
        className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      ></div>
    )}

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

AgenLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AgenLayout;