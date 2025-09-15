// src/components/DashboardCard.jsx

import PropTypes from 'prop-types';

const CardIcon = ({ icon }) => (
  <div className="text-4xl text-green-600">{icon}</div>
);
CardIcon.propTypes = {
  icon: PropTypes.node.isRequired,
};

const DashboardCard = ({ icon, title, value, subtitle, onClick }) => {
  return (
    // --- PERUBAHAN DI SINI ---
    // Menambahkan onClick, cursor-pointer, dan beberapa style interaktif
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border-l-4 border-green-600 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-700 group-hover:text-green-600 transition-colors">{title}</h3>
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
  onClick: PropTypes.func, // Menambahkan prop onClick
};

// Menambahkan default props untuk menghindari error jika onClick tidak di-passing
DashboardCard.defaultProps = {
  onClick: () => {},
};

export default DashboardCard;