import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { DiarioProvider } from "./contexts/DiarioContext";

// Importa Layout e as Páginas
import MainLayout from "./components/MainLayout";
import Login from "./pages/login";
import DiarioList from "./pages/diarioList";
import FormacaoList from "./pages/formacao";
import Diario from "./pages/diario";
// Garante que o ficheiro na pasta se chama MinhaConta.jsx (com "M" maiúsculo)
import MinhaConta from "./pages/minhaConta"; 

function App() {
  return (
    <ChakraProvider>
      <DiarioProvider>
        <Router>
          <Routes>
            {/* 1. ROTAS SEM MOLDURA (Aparecem em ecrã inteiro) */}
            <Route path="/" element={<Login />} />

            {/* 2. ROTAS COM MOLDURA (Dashboard - Protegidas) */}
            <Route
              path="/*"
              element={
                /* O ProtectedRoute protege logo TUDO o que está aqui dentro */
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      {/* Já não precisamos de repetir o ProtectedRoute em cada página! */}
                      <Route path="/novoDiario" element={<Diario />} />
                      <Route path="/diarios" element={<DiarioList />} />
                      <Route path="/editarDiario/:id" element={<Diario />} />
                      <Route path="/minha-conta" element={<MinhaConta />} />
                      <Route path="/formacao" element={<FormacaoList />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </DiarioProvider>
    </ChakraProvider>
  );
}

export default App;