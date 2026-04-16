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
    <Box h="100vh" w="100vw" overflow="hidden" bg="gray.100">
      <Navbar />
      
      <Flex
        align="flex-start"
        justify="center"
        h="calc(100vh - 64px)"
        p={{ base: 2, md: 8 }}
        position="relative"
      >
        <Center
          
  w="100%"
  maxW="1200px" // Aumentar um pouco para monitores grandes
  h="full"
  maxH="85vh"
  bg="white"
  borderRadius="xl"
  p={{ base: 4, md: 8 }} // Padding que se adapta
  shadow="2xl" // Sombra mais profunda para "flutuar" no fundo cinza
  overflowY="auto"
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { background: '#cbd5e0', borderRadius: '24px' },
          }}
        >
          <Routes>
            {/* Rotas Protegidas */}
            <Route path="/novoDiario" element={<ProtectedRoute><Diario /></ProtectedRoute>} />
            <Route path="/diarios" element={<ProtectedRoute><DiarioList /></ProtectedRoute>} />
            <Route path="/editarDiario/:id" element={<ProtectedRoute><Diario /></ProtectedRoute>} />
            <Route path="/minha-conta" element={<ProtectedRoute><MinhaConta /></ProtectedRoute>} />
            <Route path="/formacao" element={<ProtectedRoute><FormacaoList /></ProtectedRoute>} />
          </Routes>
        </Center>
      </Flex>
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