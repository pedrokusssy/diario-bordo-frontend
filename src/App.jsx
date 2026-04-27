import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importa o teu Layout e as tuas Páginas
import MainLayout from "./components/MainLayout"; 
import Login from "./pages/Login"; // (Ajusta os caminhos se necessário)
import DiarioList from "./pages/DiarioList";
// import Formacao from "./pages/Formacao";
// import NovoDiario from "./pages/NovoDiario";

function App() {
  return (
    <ChakraProvider>
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
                <Routes>
                  {/* Todas as tuas páginas do sistema entram aqui! */}
                  <Route path="/diarios" element={<DiarioList />} />
                  {/* <Route path="/novoDiario" element={<NovoDiario />} /> */}
                  {/* <Route path="/editarDiario/:id" element={<EditarDiario />} /> */}
                  {/* <Route path="/formacao" element={<Formacao />} /> */}
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;