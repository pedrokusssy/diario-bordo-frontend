import React from "react";
import { Flex, Box, Center } from "@chakra-ui/react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";

// 1. IMPORTAÇÃO DOS TEUS COMPONENTES (Verifica se os caminhos estão corretos)
import Navbar from "./components/NavBar";
import Diario from "./diarioFormulario/diario";
import DiarioList from "./diarioFormulario/diarioList";
import MinhaConta from "./minhaConta/minhaConta";
import FormacaoList from "./formacao/formacao";
import Login from "./login/login";
import { ProtectedRoute } from "./ProtectedRoute";
import { DiarioProvider } from "./contexts/DiarioContext";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  // Se for a página de login, renderizamos apenas o Login sem a moldura do sistema
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    );
  }

  // Se NÃO for login, renderizamos a "moldura" (Software Look)
  return (
    <Box minH="100vh" w="100%" bg="gray.50">
      <Navbar />
      
        
          <Routes>
            {/* Rotas Protegidas */}
            <Route path="/novoDiario" element={<ProtectedRoute><Diario /></ProtectedRoute>} />
            <Route path="/diarios" element={<ProtectedRoute><DiarioList /></ProtectedRoute>} />
            <Route path="/editarDiario/:id" element={<ProtectedRoute><Diario /></ProtectedRoute>} />
            <Route path="/minha-conta" element={<ProtectedRoute><MinhaConta /></ProtectedRoute>} />
            <Route path="/formacao" element={<ProtectedRoute><FormacaoList /></ProtectedRoute>} />
          </Routes>
    </Box>
  );
}

function App() {
  return (
    <React.StrictMode>
      <DiarioProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DiarioProvider>
    </React.StrictMode>
  );
}

export default App;