import {
  Box,
  Flex,
  VStack,
  Link as ChakraLink,
  IconButton,
  useDisclosure,
  Text,
  Tooltip,
  HStack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { HamburgerIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaBook, FaGraduationCap, FaBell, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";

function Navbar({isCollapsed, setIsCollapsed}) {
  // Agora usamos onOpen e onClose para a Gaveta (Drawer)
  const { isOpen, onOpen, onClose } = useDisclosure();

  //const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLogged");
    navigate("/");
  };

  return (
    <>
      {/* BARRA PRINCIPAL */}
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
          
          {/* --- MOBILE: BOTÃO HAMBÚRGUER --- */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen} // Abre a gaveta
            icon={<HamburgerIcon />}
            variant="ghost"
            colorScheme="whiteAlpha"
            fontSize="20px"
            aria-label="Abrir Menu"
          />

          {/* BOTÃO RECOLHER/EXPANDIR (Apenas PC) */}
          <IconButton
            display={{ base: "none", md: "flex" }}
            icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            size="xs"
            position="absolute"
            right="-12px" 
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
              
              setIsCollapsed(!isCollapsed);
            }}

            aria-label="Toggle Sidebar"
            _hover={{ bg: "teal.400" }}
          />

          {/* LOGO (Escondido no Mobile, Visível no PC) */}
          <Box 
            display={{ base: "none", md: "block" }} 
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
            overflow="hidden"
          >
            <NavLink to="/diarios" icon={<FaBook />} isCollapsed={isCollapsed}>Diários</NavLink>
            <NavLink to="/formacao" icon={<FaGraduationCap />} isCollapsed={isCollapsed}>Formação</NavLink>
          </VStack>

          {/* --- MOBILE: NOTIFICAÇÕES E AVATAR --- */}
          <HStack display={{ base: "flex", md: "none" }} spacing={2}>
            
            {/* Sino Notificações */}
            <Box position="relative">
              <IconButton
                icon={<FaBell />}
                variant="ghost"
                colorScheme="whiteAlpha"
                fontSize="20px"
                borderRadius="full"
                aria-label="Notificações"
              />
              <Badge
                position="absolute"
                top="8px"
                right="8px"
                bg="red.500"
                boxSize="10px"
                borderRadius="full"
                border="2px solid"
                borderColor="teal.600"
              />
            </Box>

            {/* Menu Utilizador (Avatar) */}
            <Menu>
              <MenuButton borderRadius="full">
                <Avatar 
                  size="sm" 
                  bg="white" 
                  color="teal.600"
                  icon={<FaUserAlt fontSize="0.9rem" />} 
                />
              </MenuButton>
              <MenuList shadow="xl" border="none" borderRadius="xl" color="gray.800">
                <MenuItem icon={<FaUserAlt />} onClick={() => navigate("/minha-conta")} fontWeight="medium">
                  Minha Conta
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<FaSignOutAlt />} color="red.500" onClick={handleLogout} fontWeight="medium">
                  Terminar Sessão
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      {/* --- MENU MOBILE (DRAWER - DESLIZA DA ESQUERDA) --- */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="teal.700" color="white">
          <DrawerCloseButton mt={1} />
          
          <DrawerHeader borderBottomWidth="1px" borderColor="teal.600" pt={5}>
            <Box fontSize="20px" fontWeight="900" letterSpacing="wider">
              <Text display="inline">DIÁRIO </Text>
              <Text display="inline" color="teal.200">DE BORDO</Text>
            </Box>
          </DrawerHeader>

          <DrawerBody pt={6}>
            <VStack spacing={3} align="stretch">
              {/* Passamos o onClose para fechar a gaveta quando se clica num link! */}
              <NavLink to="/diarios" icon={<FaBook />} onClick={onClose}>Diários</NavLink>
              <NavLink to="/formacao" icon={<FaGraduationCap />} onClick={onClose}>Formação</NavLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

// Atualizamos o NavLink para aceitar a função onClick
function NavLink({ to, children, icon, isCollapsed, onClick }) {
  return (
    <Tooltip label={children} isDisabled={!isCollapsed} placement="right">
      <ChakraLink
        as={ReactRouterLink}
        to={to}
        onClick={onClick} // Fecha o menu mobile ao clicar
        p={3}
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent={isCollapsed ? "center" : "flex-start"}
        transition="all 0.2s"
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