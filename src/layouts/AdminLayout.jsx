// src/layouts/AdminLayout.jsx

import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import PropTypes from 'prop-types';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;