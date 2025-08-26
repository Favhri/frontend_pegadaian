// src/pages/LoginPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

// Komponen kecil untuk icon centang di panel kiri
const FeatureListItem = ({ children }) => (
  <li className="flex items-center gap-3 py-2 text-lg">
    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
    {children}
  </li>
);
FeatureListItem.propTypes = {
  children: PropTypes.node.isRequired,
};


const LoginPage = () => {
  // State untuk mengelola input form
  const [username, setUsername] = useState(''); // Bisa berisi username atau email
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State untuk menangani proses login (loading, error, success)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const rememberedUser = localStorage.getItem('pegadaian_remember');
    if (rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  // --- FUNGSI LOGIN DENGAN API BACKEND ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Mohon lengkapi username dan password!');
      return;
    }

    setLoading(true);

    const loginPayload = {
      email: username,
      password: password,
    };

    console.log("Data yang akan dikirim ke backend:", loginPayload);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', loginPayload);

      // --- PERBAIKAN UTAMA DI SINI ---
      // Kita hanya mengambil 'token' karena backend tidak mengirim 'user'
      const { token } = response.data;

      // Jika tidak ada token, anggap login gagal
      if (!token) {
        throw new Error("Respons tidak valid dari server.");
      }

      localStorage.setItem('authToken', token);
      
      if (rememberMe) {
        localStorage.setItem('pegadaian_remember', username);
      } else {
        localStorage.removeItem('pegadaian_remember');
      }

      setSuccess(`Login berhasil! Mengarahkan ke dashboard...`);
      
      // Karena kita tidak mendapat role, untuk sekarang semua login berhasil
      // akan diarahkan ke dashboard admin.
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Username atau password salah. Silakan coba lagi.';
      setError(errorMessage);
      console.error("Error dari backend:", err.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-teal-500 p-4">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-green-700 to-green-600 text-white text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
              <img src="/src/assets/terndam.png" alt="logo" style={{ width: '200px', height: 'auto', margin: '0 auto' }} />
            {/* <span className="text-6xl">💎</span> */}
            {/* <h1 className="text-4xl font-bold">PEGADAIAN</h1> */}
          </div>
          <p className="text-xl mb-6">
            Solusi Finansial Terpercaya<br />
            Sejak 1901
          </p>
          <ul className="text-left space-y-2 self-center">
            <FeatureListItem>BUMN Terpercaya</FeatureListItem>
            <FeatureListItem>Proses Cepat & Mudah</FeatureListItem>
            <FeatureListItem>Jaringan Terluas di Indonesia</FeatureListItem>
            <FeatureListItem>Bunga Kompetitif</FeatureListItem>
            <FeatureListItem>Layanan 24/7</FeatureListItem>
          </ul>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800">Selamat Datang</h2>
            <p className="text-gray-600 mt-2">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-center">{success}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold text-green-800" htmlFor="username">
                Username atau Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username atau email Anda"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-green-800" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-green-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                Ingat saya
              </label>
              <a href="#" className="font-semibold text-green-600 hover:text-green-800">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:from-green-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : '🔐 Masuk ke Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
