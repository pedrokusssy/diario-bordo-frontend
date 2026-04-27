import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "./Navbar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
  // O estado que controla se a barra lateral está encolhida ou expandida
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box minH="100vh" bg="gray.50">
      
      {/* Barra de Topo */}
      <Topbar />

      {/* Barra Lateral - Passamos o estado para ela saber como se desenhar */}
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* ÁREA DE CONTEÚDO */}
      <Box
        as="main"
        // A margem esquerda empurra o conteúdo consoante o tamanho da Navbar
        ml={{ base: 0, md: isCollapsed ? "80px" : "240px" }}
        // O padding top empurra o conteúdo para baixo da Topbar
        pt={{ base: "60px", md: "70px" }}
        transition="margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        minH="100vh"
        display="flex"
        flexDirection="column"
      >
        {/* É aqui que as tuas páginas vão ser renderizadas! */}
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;