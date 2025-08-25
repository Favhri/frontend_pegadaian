// src/pages/NotFoundPage.jsx

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-600">404</h1>
        <p className="text-2xl mt-4 text-gray-800">Halaman Tidak Ditemukan</p>
        <p className="mt-2 text-gray-500">Maaf, halaman yang kamu cari tidak ada.</p>
        {/* Tambahkan link untuk kembali ke home jika perlu */}
        {/* <a href="/" className="mt-6 inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Kembali ke Home</a> */}
      </div>
    </div>
  );
};

// PENTING: Jangan lupa tambahkan baris ini!
export default NotFoundPage;