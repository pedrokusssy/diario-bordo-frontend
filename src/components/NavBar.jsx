import {
  Box,
  Flex,
  HStack,
  Link as ChakraLink,
  IconButton,
  useDisclosure,
  Stack,
  Collapse,
  Button, // Adicionado
  Icon    // Adicionado
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom"; 
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaSignOutAlt } from "react-icons/fa"; // Ícone de Logout

function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

const handleLogout = () => {
  // 1. Removemos a chave que a ProtectedRoute está à procura  
   localStorage.removeItem("token");
   localStorage.removeItem("isLogged");
  // navigate("/login");
  // 2. (Opcional) Limpar outros dados se existirem
  // localStorage.clear(); 

  // 3. Redirecionamos para a página de login (raiz)
  navigate("/");
  
  // Opcional: Um pequeno log ou toast para confirmar
  console.log("Sessão terminada");
};



  return (
    <Box
      bg="teal.500"
      px={{ base: 4, md: 20, lg: 80 }}
      py={4}
      color="white"
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold" fontSize="xl" letterSpacing="tight">
          DIÁRIO DE BORDO
        </Box>

        {/* --- MENU DESKTOP --- */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          <NavLink to="/diarios">Diários</NavLink>
          <NavLink to="/formacao">Formação</NavLink>
          <NavLink to="/minha-conta">Minha Conta</NavLink>
          
          <Button
            leftIcon={<FaSignOutAlt />}
            variant="ghost"
            colorScheme="whiteAlpha"
            size="sm"
            onClick={handleLogout}
            _hover={{ bg: "red.400", color: "white" }}
          >
            Sair
          </Button>
        </HStack>

        {/* --- BOTÃO HAMBÚRGUER (Mobile) --- */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="outline"
          colorScheme="whiteAlpha"
          aria-label="Toggle Navigation"
        />
      </Flex>

      {/* --- MENU MOBILE --- */}
      <Collapse in={isOpen} animateOpacity>
        <Stack
          bg="teal.600"
          p={4}
          display={{ md: "none" }}
          mt={4}
          borderRadius="md"
          spacing={3}
        >
          <NavLink to="/diarios">Diários</NavLink>
          <NavLink to="/formacao">Formação</NavLink>
          <NavLink to="/minha-conta">Minha Conta</NavLink>
          
          <Button
            leftIcon={<FaSignOutAlt />}
            justifyContent="flex-start"
            variant="solid"
            colorScheme="red"
            size="md"
            onClick={handleLogout}
            mt={2}
          >
            Sair da Conta
          </Button>
        </Stack>
      </Collapse>
    </Box>
  );
}

function NavLink({ to, children }) {
  return (
    <ChakraLink
      as={ReactRouterLink}
      to={to}
      p={2}
      fontSize="md"
      fontWeight="medium"
      _hover={{ textDecoration: "none", bg: "teal.600", borderRadius: "md" }}
    >
      {children}
    </ChakraLink>
  );
}

export default Navbar;