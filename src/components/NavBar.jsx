import {
  Box,
  Flex,
  VStack,
  Link as ChakraLink,
  IconButton,
  useDisclosure,
  Collapse,
  Button,
  Text,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { HamburgerIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaSignOutAlt, FaBook, FaGraduationCap, FaUserAlt } from "react-icons/fa";
import { useState } from "react";

function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLogged");
    navigate("/");
  };

  return (
    <Box
      bg="teal.600"
      color="white"
      position="fixed"
      left={0}
      top={0}
      zIndex={1100}
      boxShadow="xl"
      w={{ base: "100%", md: isCollapsed ? "80px" : "240px" }}
      h={{ base: "auto", md: "100vh" }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      // Removido o overflow="hidden" para permitir que o botão "pílula" na borda apareça
    >
      <Flex
        direction={{ base: "row", md: "column" }}
        h="full"
        px={{ base: 4, md: isCollapsed ? 2 : 6 }}
        py={{ base: 3, md: 8 }}
        align={{ base: "center", md: isCollapsed ? "center" : "stretch" }}
        justify={{ base: "space-between", md: "flex-start" }}
        position="relative"
      >
        {/* BOTÃO RECOLHER/EXPANDIR - Estilo "Pílula" na borda direita */}
        <IconButton
          display={{ base: "none", md: "flex" }}
          icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          size="xs"
          position="absolute"
          // Posiciona exatamente na linha divisória da sidebar
          right="-12px" 
          top="32px"
          borderRadius="full"
          bg="teal.500"
          color="white"
          boxShadow="lg"
          border="2px solid"
          borderColor="teal.600"
          _hover={{ bg: "teal.400" }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle Sidebar"
          zIndex={1200}
        />

        {/* LOGO - Duas cores e quebra de linha */}
        <Box 
          fontWeight="900" 
          lineHeight="1.1"
          textAlign={isCollapsed ? "center" : "left"}
          mb={{ base: 0, md: 12 }}
          px={isCollapsed ? 0 : 2}
          transition="all 0.3s"
        >
          {isCollapsed ? (
            <Text fontSize="xl" color="teal.200">D.B.</Text>
          ) : (
            <Box fontSize="22px" letterSpacing="wider">
              <Text>DIÁRIO</Text>
              <Text color="teal.200">DE BORDO</Text>
            </Box>
          )}
        </Box>

        {/* --- MENU DESKTOP --- */}
        <VStack
          display={{ base: "none", md: "flex" }}
          spacing={2} 
          align={isCollapsed ? "center" : "stretch"}
          flex="1"
          overflow="hidden" // Garante que o texto dos links não saia da barra ao encolher
        >
          <NavLink to="/diarios" icon={<FaBook />} isCollapsed={isCollapsed}>Diários</NavLink>
          <NavLink to="/formacao" icon={<FaGraduationCap />} isCollapsed={isCollapsed}>Formação</NavLink>
          <NavLink to="/minha-conta" icon={<FaUserAlt />} isCollapsed={isCollapsed}>Minha Conta</NavLink>
          
          <Box flex="1" /> 
          
          <Divider borderColor="teal.500" opacity={0.3} />
          
          <Tooltip label="Sair" isDisabled={!isCollapsed} placement="right">
            <Button
              leftIcon={<FaSignOutAlt />}
              variant="ghost"
              colorScheme="whiteAlpha"
              justifyContent={isCollapsed ? "center" : "flex-start"}
              onClick={handleLogout}
              px={isCollapsed ? 0 : 4}
              _hover={{ bg: "red.500", color: "white" }}
              fontWeight="light" // Fonte Light também no botão de sair
            >
              {!isCollapsed && "Sair"}
            </Button>
          </Tooltip>
        </VStack>

        {/* HAMBÚRGUER MOBILE */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="outline"
          colorScheme="whiteAlpha"
        />
      </Flex>

      {/* MENU MOBILE */}
      <Collapse in={isOpen} animateOpacity>
        <VStack bg="teal.700" p={4} display={{ md: "none" }} spacing={3} align="stretch">
          <NavLink to="/diarios" icon={<FaBook />}>Diários</NavLink>
          <NavLink to="/formacao" icon={<FaGraduationCap />}>Formação</NavLink>
          <NavLink to="/minha-conta" icon={<FaUserAlt />}>Minha Conta</NavLink>
          <Button colorScheme="red" onClick={handleLogout} leftIcon={<FaSignOutAlt />}>
            Sair
          </Button>
        </VStack>
      </Collapse>
    </Box>
  );
}

function NavLink({ to, children, icon, isCollapsed }) {
  return (
    <Tooltip label={children} isDisabled={!isCollapsed} placement="right">
      <ChakraLink
        as={ReactRouterLink}
        to={to}
        p={3}
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent={isCollapsed ? "center" : "flex-start"}
        transition="all 0.2s"
        // ALTERAÇÃO: Texto em Light para um visual mais limpo
        fontWeight="light" 
        _activeLink={{ bg: "teal.500", textDecoration: "none" }} 
        _hover={{ textDecoration: "none", bg: "teal.500" }}
      >
        <Box fontSize="20px">{icon}</Box>
        {!isCollapsed && (
          <Text ml={3} fontSize="md" whiteSpace="nowrap">
            {children}
          </Text>
        )}
      </ChakraLink>
    </Tooltip>
  );
}

export default Navbar;