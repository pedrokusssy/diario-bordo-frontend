import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  // Aqui você verifica se o usuário está logado (ex: verificando o localStorage)
  const isAuthenticated = localStorage.getItem("isLogged") === "true";

  if (!isAuthenticated) {
    // Se não estiver logado, manda para a rota raiz (Login)
    return <Navigate to="/" replace />;
  }

  return children;
};