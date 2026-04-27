import React from "react";
import ReactDOM from "react-dom/client";

// 1. StrictMode removido daqui!
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import diarioList from "./pages/diarioList"; // Nota: está importado, mas não está sendo usado no código abaixo
import Diario from "./pages/diario";
import Navbar from "./components/NavBar";

// 2. Importação dos componentes das páginas (ajuste o caminho se necessário)


ReactDOM.createRoot(document.getElementById("root")).render(
  // Usando o React.StrictMode nativo
    <ChakraProvider>
        <App />
    </ChakraProvider>
);