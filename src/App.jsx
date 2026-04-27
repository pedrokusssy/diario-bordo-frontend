import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { DiarioProvider } from "./contexts/DiarioContext";
// Importa Layout e as Páginas
import MainLayout from "./components/MainLayout";
import Login from "./pages/Login";
import DiarioList from "./pages/DiarioList";
import FormacaoList from "./pages/Formacao";
import Diario from "./pages/Diario";
import MinhaConta from "./pages/minhaConta";

function App() {
  return (
    <ChakraProvider>
      <DiarioProvider>
        <Router>
          <Routes>
            {/* 1. ROTAS SEM MOLDURA (Aparecem em ecrã inteiro) */}
            <Route path="/" element={<Login />} />
            {/* Se tiveres página de Registo ou Esqueceu a Palavra-passe, põe aqui */}

            {/* 2. ROTAS COM MOLDURA (Dashboard) */}
            <Route
              path="/*"
              element={
                <MainLayout>
                  <ProtectedRoute>
                    <Routes>
                      {/* Todas as páginas do sistema entram aqui! com rotas protegidas */}!
                      <Route path="/novoDiario" element={<ProtectedRoute><Diario /></ProtectedRoute>} />
                      <Route path="/diarios" element={<ProtectedRoute><DiarioList /></ProtectedRoute>} />
                      <Route path="/editarDiario/:id" element={<ProtectedRoute><Diario /></ProtectedRoute>} />
                      <Route path="/minha-conta" element={<ProtectedRoute><MinhaConta /></ProtectedRoute>} />
                      <Route path="/formacao" element={<ProtectedRoute><FormacaoList /></ProtectedRoute>} />
                    </Routes>
                  </ProtectedRoute>
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </DiarioProvider>
    </ChakraProvider>
  );
}

export default App;