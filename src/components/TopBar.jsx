import {
  Flex,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Box,
  Badge,
  HStack
} from "@chakra-ui/react";
import { FaBell, FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLogged");
    navigate("/");
  };

  return (
    <Flex
      as="header"
      position="fixed"
      top={0}
      left={0}
      w="100%"
      h={{ base: "60px", md: "70px" }}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      zIndex={1000} // Fica por baixo da Navbar que tem zIndex 1100
      align="center"
      justify="flex-end" // Empurra tudo para a direita
      px={{ base: 4, md: 8 }}
    >
      <HStack spacing={4}>
        
        {/* ÍCONE DE NOTIFICAÇÕES */}
        <Box position="relative">
          <IconButton
            icon={<FaBell />}
            variant="ghost"
            colorScheme="gray"
            fontSize="20px"
            aria-label="Notificações"
            borderRadius="full"
          />
          {/* Bolinha vermelha a imitar notificação não lida */}
          <Badge
            position="absolute"
            top="8px"
            right="8px"
            bg="red.500"
            boxSize="10px"
            borderRadius="full"
            border="2px solid white"
          />
        </Box>

        {/* MENU DO UTILIZADOR (AVATAR CIRCULAR) */}
        <Menu>
          <MenuButton 
            transition="all 0.2s"
            borderRadius="full"
            _hover={{ ring: 2, ringColor: "teal.300", ringOffset: 1 }}
          >
            <Avatar 
              size="sm" 
              bg="teal.600" 
              color="white"
              icon={<FaUserAlt fontSize="1rem" />} 
            />
          </MenuButton>
          
          <MenuList shadow="lg" border="none" borderRadius="xl">
            <MenuItem 
              icon={<FaUserAlt />} 
              onClick={() => navigate("/minha-conta")}
              fontWeight="medium"
            >
              Minha Conta
            </MenuItem>
            <MenuDivider />
            <MenuItem 
              icon={<FaSignOutAlt />} 
              color="red.500" 
              onClick={handleLogout}
              fontWeight="medium"
            >
              Terminar Sessão
            </MenuItem>
          </MenuList>
        </Menu>

      </HStack>
    </Flex>
  );
}

export default Topbar;