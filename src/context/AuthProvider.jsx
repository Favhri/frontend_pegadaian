// src/context/AuthProvider.jsx
import React, { createContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Update activity setiap ada event
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    // Event listener buat deteksi user aktif
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("scroll", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [updateActivity]);

  // Cek token expired + idle
  useEffect(() => {
    const checkSession = setInterval(async () => {
      if (!token) return;

      const now = Date.now();
      const idleTime = now - lastActivity;

      // Misal idle lebih dari 10 menit → paksa logout
      if (idleTime > 10 * 60 * 1000) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setToken(null);
        navigate("/login");
        return;
      }

      try {
        // Panggil endpoint refresh token kalau user masih aktif
        await axios.post("http://localhost:5000/api/auth/refresh-token", {}, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          if (res.data?.token) {
            localStorage.setItem("authToken", res.data.token);
            setToken(res.data.token);
          }
        });
      } catch (err) {
        console.error("Token refresh gagal:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setToken(null);
        navigate("/login");
      }
    }, 5 * 60 * 1000); // cek tiap 5 menit

    return () => clearInterval(checkSession);
  }, [token, lastActivity, navigate]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
