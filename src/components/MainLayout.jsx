import { Box, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "./Navbar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
  // 1. Estado para o Desktop (Expandir/Recolher)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navWidth = isCollapsed ? "60px" : "240px";

  // 2. Estado para o Mobile (Abrir/Fechar Drawer)
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg="gray.50" overflowX="hidden">

      {/* Topbar: recebe o navWidth para ajustar a margem no PC e o onOpen para o hambúrguer no Mobile */}
      <Topbar navWidth={navWidth} onOpen={onOpen} />

      {/* Navbar: contém tanto a Sidebar fixa (PC) quanto o Drawer (Mobile) */}
      <Navbar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        navWidth={navWidth}
      />

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <Box
        as="main"
        // No PC, a margem esquerda acompanha a largura da Navbar. No Mobile, é 0.
        ml={{ base: 0, md: navWidth }}
        // O padding top empurra o conteúdo para baixo da Topbar fixa

        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"

        display="flex"
        flexDirection="column"


      >
        <Box w="100%" minW="0">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;