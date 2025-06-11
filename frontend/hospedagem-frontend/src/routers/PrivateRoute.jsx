import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


//Componente com as definições e validações de rota privada, onde redirecionado usuários autenticados para page painel e não autenticados para a login.
const PrivateRoute = ({ children, requiredRole }) => {
  const { auth } = useAuth();
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !auth.isAdmin) {
    return <Navigate to="/painel" replace />;
  }

  return children;
};

export default PrivateRoute;
