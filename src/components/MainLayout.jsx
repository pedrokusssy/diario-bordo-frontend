import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "./NavBar";
import Topbar from "./TopBar";

function MainLayout({ children }) {
  // O estado que controla se a barra lateral está encolhida ou expandida
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box  bg="gray.50">
      
      {/* Barra de Topo */}
      <Topbar />

      {/* Barra Lateral - Passamos o estado para ela saber como se desenhar */}
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* ÁREA DE CONTEÚDO */}
      <Box
        as="main"
        // 1. A margem empurra o conteúdo consoante o tamanho da Navbar
        ml={{ base: 0, md: isCollapsed ? "80px" : "240px" }}
        
        // 2. A MAGIA DA LARGURA: 100% da tela MENOS o tamanho exato da Navbar
        w={{ base: "100%", md: isCollapsed ? "calc(100% - 80px)" : "calc(100% - 240px)" }}
        
        
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        display="flex"
        flexDirection="column"
      >
        {/* É aqui que as tuas páginas vão ser renderizadas! */}
        <Box w="100%" minW="0">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;