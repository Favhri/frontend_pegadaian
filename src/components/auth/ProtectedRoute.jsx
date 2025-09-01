// src/components/auth/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../../context/AuthProvider";

const getUserRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role || "user";
  } catch {
    return "user";
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token } = useContext(AuthContext);
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
