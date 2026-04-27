import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  Icon,
  InputGroup,
  InputRightElement,
  useToast,
  InputLeftElement,
  Center,
  SlideFade,
  Container,
  VStack,
  IconButton
} from "@chakra-ui/react";
import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import api from "../services/api";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  // Cores Modernas
  const bgGradient = useColorModeValue(
    "radial(teal.50 0%, white 100%)",
    "radial(gray.900 0%, gray.800 100%)"
  );
  const cardBg = useColorModeValue("white", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.800");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, pessoaId, nome } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("pessoaId", pessoaId);
      localStorage.setItem("userName", nome);
      localStorage.setItem("isLogged", "true");

      toast({
        title: `Bem-vindo, ${nome}!`,
        status: "success",
        duration: 2000,
        variant: "subtle"
      });

      setTimeout(() => {
        window.location.href = "/diarios";
      }, 500);

    } catch (error) {
      toast({
        title: "Erro de Acesso",
        description: "Credenciais inválidas.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient={bgGradient}
      position="relative"
      px={4} // Margem de segurança para mobile
    >
      {/* Decoração de fundo sutil */}
      <Box 
        position="absolute" top="-10%" left="-5%" 
        w={{ base: "300px", md: "500px" }} 
        h={{ base: "300px", md: "500px" }} 
        bg="teal.50" borderRadius="full" filter="blur(80px)" opacity="0.5" zIndex={0} 
      />
      
      <Container maxW={{ base: "full", sm: "md" }} p={0} zIndex={1}>
        <SlideFade in={true} offsetY="20px">
          <Stack spacing={6}>
            
            {/* Header Responsivo */}
            <VStack spacing={3} textAlign="center">
              <Center 
                w={{ base: 14, md: 16 }} 
                h={{ base: 14, md: 16 }} 
                bg="teal.500" 
                borderRadius="20px" 
                shadow="0 10px 20px -5px rgba(49, 151, 149, 0.4)"
              >
                <Icon as={FaLock} w={{ base: 6, md: 7 }} h={{ base: 6, md: 7 }} color="white" />
              </Center>
              <Box>
                <Heading 
                  fontSize={{ base: "2xl", md: "3xl" }} 
                  fontWeight="800" 
                  color={useColorModeValue("gray.800", "white")}
                  letterSpacing="tight"
                >
                  Bem-vindo de volta
                </Heading>
                <Text color={subTextColor} fontSize={{ base: "sm", md: "md" }} mt={1}>
                  Aceda ao seu <Text as="span" fontWeight="bold" color="teal.500">Diário de Bordo</Text>
                </Text>
              </Box>
            </VStack>

            {/* Card com padding adaptável */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 10 }}
              borderRadius={{ base: "2xl", md: "3xl" }}
              boxShadow="0 20px 40px -10px rgba(0, 0, 0, 0.07)"
              borderWidth="1px"
              borderColor={useColorModeValue("gray.100", "gray.600")}
            >
              <form onSubmit={handleLogin}>
                <Stack spacing={5}>
                  
                  <FormControl id="email" isRequired>
                    <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" ml={1}>E-MAIL</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none">
                        <FaEnvelope color="#A0AEC0" size="14px" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        bg={inputBg}
                        border="none"
                        borderRadius="xl"
                        fontSize="md"
                        _focus={{ bg: useColorModeValue("white", "gray.800"), ring: 2, ringColor: "teal.400" }}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl id="password" isRequired>
                    <FormLabel fontSize="xs" fontWeight="bold" color="gray.500" ml={1}>PALAVRA-PASSE</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none">
                        <FaLock color="#A0AEC0" size="14px" />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        bg={inputBg}
                        border="none"
                        borderRadius="xl"
                        fontSize="md"
                        _focus={{ bg: useColorModeValue("white", "gray.800"), ring: 2, ringColor: "teal.400" }}
                      />
                      <InputRightElement w="3rem">
                        <IconButton
                          h="1.75rem"
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                          aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="lg"
                    fontSize="md"
                    h="55px"
                    borderRadius="xl"
                    isLoading={isLoading}
                    loadingText="A entrar..."
                    shadow="0 10px 20px -5px rgba(49, 151, 149, 0.3)"
                    _hover={{ transform: "translateY(-1px)", shadow: "0 15px 25px -5px rgba(49, 151, 149, 0.4)" }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s"
                    mt={2}
                  >
                    Entrar no Sistema
                  </Button>
                </Stack>
              </form>
            </Box>

            {/* Footer */}
            <Text textAlign="center" color="gray.400" fontSize="10px" fontWeight="bold" letterSpacing="1px">
              © {new Date().getFullYear()} DIÁRIO DE BORDO • TODOS OS DIREITOS RESERVADOS
            </Text>

          </Stack>
        </SlideFade>
      </Container>
    </Flex>
  );
}

export default Login;