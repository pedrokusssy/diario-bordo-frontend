import {
  Box,
  Flex,
  VStack,
  Link as ChakraLink,
  IconButton,
  Text,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaBook, FaGraduationCap } from "react-icons/fa";

function Navbar({ isCollapsed, setIsCollapsed, navWidth, isOpen, onClose }) {
  const location = useLocation();

  console.log("A função chegou à Navbar?", typeof setIsCollapsed);

  return (
    <>
      {/* --- SIDEBAR DESKTOP (Aparece apenas em md+) --- */}
      <Box
        as="nav"
        display={{ base: "none", md: "block" }}
        position="fixed"
        left={0}
        top={0}
        h="100vh"
        bg="teal.600"
        w={navWidth}
        transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        zIndex={1100}
        boxShadow="2xl"
      >
        <Flex
          direction="column"
          h="full"
          px={isCollapsed ? 2 : 6}
          py={8}
          align={isCollapsed ? "center" : "stretch"}
          position="relative"
        >
          {/* Botão de Toggle (Chevron) */}
          <IconButton
            display={{ base: "none", md: "flex" }}
            icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            size="xs"
            position="absolute"
            right="-12px" // Garante que ele fica na borda
            top="32px"
            borderRadius="full"
            bg="teal.500"
            color="white"
            boxShadow="lg"
            border="2px solid"
            borderColor="teal.600"

            // 1. Z-INDEX ALTÍSSIMO para garantir que o clique é detetado
            zIndex={9999}

            // 2. Teste de clique forçado
            onClick={(e) => {
              e.stopPropagation(); // Impede que o clique "fuja" para outros elementos
              console.log("BOTÃO CLICADO! Valor atual:", isCollapsed);
              setIsCollapsed(!isCollapsed);
            }}

            aria-label="Toggle Sidebar"
            _hover={{ bg: "teal.400" }}
          />

          {/* Logo / Nome */}
          <Box mb={12} textAlign={isCollapsed ? "center" : "left"} overflow="hidden">
            {isCollapsed ? (
              <Text fontSize="xl" fontWeight="900" color="white">D.B.</Text>
            ) : (
              <Box lineHeight="1.1" whiteSpace="nowrap">
                <Text color="white" fontWeight="900" fontSize="20px">DIÁRIO</Text>
                <Text color="teal.200" fontWeight="900" fontSize="20px">DE BORDO</Text>
              </Box>
            )}
          </Box>

          {/* Links de Navegação */}
          <VStack spacing={2} align={isCollapsed ? "center" : "stretch"} flex="1">
            <NavLink to="/diarios" icon={<FaBook />} isCollapsed={isCollapsed} isActive={location.pathname === "/diarios"}>
              Diários
            </NavLink>
            <NavLink to="/formacao" icon={<FaGraduationCap />} isCollapsed={isCollapsed} isActive={location.pathname === "/formacao"}>
              Formação
            </NavLink>
          </VStack>
        </Flex>
      </Box>

      {/* --- DRAWER MOBILE (Menu deslizante) --- */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="teal.700" color="white">
          <DrawerCloseButton mt={2} />
          <DrawerHeader borderBottomWidth="1px" borderColor="teal.600" pt={8}>
            <Text fontWeight="900">DIÁRIO DE BORDO</Text>
          </DrawerHeader>
          <DrawerBody pt={6}>
            <VStack spacing={4} align="stretch">
              <NavLink to="/diarios" icon={<FaBook />} onClick={onClose} isCollapsed={false} isActive={location.pathname === "/diarios"}>
                Diários
              </NavLink>
              <NavLink to="/formacao" icon={<FaGraduationCap />} onClick={onClose} isCollapsed={false} isActive={location.pathname === "/formacao"}>
                Formação
              </NavLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

// Componente Auxiliar para Links
function NavLink({ to, children, icon, isCollapsed, onClick, isActive }) {
  return (
    <Tooltip label={children} isDisabled={!isCollapsed} placement="right" hasArrow>
      <ChakraLink
        as={ReactRouterLink}
        to={to}
        onClick={onClick}
        p={3}
        borderRadius="xl"
        display="flex"
        alignItems="center"
        transition="all 0.2s"
        bg={isActive ? "teal.500" : "transparent"}
        color="white"
        _hover={{ textDecoration: "none", bg: "teal.500", transform: "translateX(4px)" }}
      >
        <Box fontSize="20px">{icon}</Box>
        {!isCollapsed && (
          <Text ml={3} fontSize="md" fontWeight="medium" whiteSpace="nowrap">
            {children}
          </Text>
        )}
      </ChakraLink>
    </Tooltip>
  );
}

export default Navbar;