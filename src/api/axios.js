// src/api/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:5000/api/',
  withCredentials: true
});

// Interceptor untuk menempelkan token ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR BARU UNTUK MENANGANI RESPONSE ERROR ---
apiClient.interceptors.response.use(
  (response) => {
    // Jika response sukses, langsung kembalikan
    return response;
  },
  (error) => {
    // Cek jika error adalah 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Hapus data login dari localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Tampilkan alert dan arahkan ke halaman login
      // Kita gunakan window.location.href untuk reload penuh agar state di AuthContext juga ter-reset
      alert('Sesi Anda telah berakhir. Silakan login kembali.');
      window.location.href = '/login';
    }
    
    // Kembalikan error agar bisa ditangani oleh komponen (misal: menampilkan pesan di form)
    return Promise.reject(error);
  }
);

export default apiClient;