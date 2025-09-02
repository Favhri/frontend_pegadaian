// src/api/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // Ini adalah kunci utamanya
});

export default apiClient;