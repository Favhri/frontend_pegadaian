// src/components/Modal.jsx

import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Jangan render apapun jika modal tidak terbuka
  if (!isOpen) return null;

  // Mencegah modal tertutup saat konten di dalamnya diklik
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Latar belakang (overlay)
    <div 
      className="fixed inset-0 bg-white/75 backdrop-blur-[2px] z-50 flex justify-center items-center p-4 transition-opacity duration-300" // <-- PERBAIKAN DI SINI
      onClick={onClose} // Menutup modal saat overlay diklik
    >
      {/* Konten Modal */}
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={handleModalContentClick} // Mencegah penutupan
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-lg">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Body Modal (bisa di-scroll) */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Modal;
