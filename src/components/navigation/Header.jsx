// src/components/navigation/Header.jsx

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-800">Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer">
            <span className="text-2xl text-gray-500 hover:text-green-600">🔔</span>
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 items-center justify-center text-white text-xs">
                3
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-semibold text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;