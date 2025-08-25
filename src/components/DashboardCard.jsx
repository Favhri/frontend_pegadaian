// src/components/DashboardCard.jsx

import PropTypes from 'prop-types';

const CardIcon = ({ icon }) => (
  // Menggunakan warna hijau default dari Tailwind
  <div className="text-4xl text-green-600">{icon}</div>
);

CardIcon.propTypes = {
  icon: PropTypes.node.isRequired,
};

const DashboardCard = ({ icon, title, value, subtitle }) => {
  return (
    // Menggunakan warna hijau default dari Tailwind untuk border
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border-l-4 border-green-600">
      <div className="flex items-center justify-between mb-4">
        {/* Menggunakan warna abu-abu gelap untuk judul */}
        <h3 className="text-lg font-bold text-gray-700">{title}</h3>
        <CardIcon icon={icon} />
      </div>
      <div>
        <p className="text-4xl font-bold text-gray-800">{value}</p>
        <p className="text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default DashboardCard;