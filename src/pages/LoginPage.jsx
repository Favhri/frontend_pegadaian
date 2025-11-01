// src/pages/LoginPage.jsx

import { useState, useEffect, useContext } from 'react'; // 1. Import useContext
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import apiClient from '../api/axios'; // Pastikan menggunakan apiClient
import { AuthContext } from '../context/AuthProvider'; // 2. Import AuthContext

// Komponen FeatureListItem tidak berubah...
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
  const { setToken } = useContext(AuthContext); // 3. Ambil fungsi setToken dari context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      // Gunakan apiClient yang sudah dikonfigurasi
      const response = await apiClient.post('/auth/login', loginPayload);
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Respons tidak valid dari server.");
      }

      // Simpan ke localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // 4. Perbarui state global di AuthContext
      setToken(token);

      if (rememberMe) {
        localStorage.setItem('pegadaian_remember', username);
      } else {
        localStorage.removeItem('pegadaian_remember');
      }

      setSuccess(`Login berhasil! Mengarahkan ke dashboard...`);
      
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'user') {
          navigate('/user/dashboard');
        }else if (user.role === 'agen') { 
          navigate('/agen/dashboard');
        } else {
          navigate('/login');
        }
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Username atau password salah. Silakan coba lagi.';
      setError(errorMessage);
      console.error("Error dari backend:", err.response);
    } finally {
      setLoading(false);
    }
  };

  // ... sisa kode JSX tidak berubah
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
              <img src="/assets/terndam.png" alt="logo" style={{ width: '200px', height: 'auto', margin: '0 auto' }} />
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
                  {showPassword ? 'Hide' : 'Show'}
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
              {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;