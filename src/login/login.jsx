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
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAppGlobal } from "../contexts/DiarioContext"; 

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {loginSucesso} = useAppGlobal();

  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    const dadosLogin = {
      "email": email,
      "password": password
    }

    try {
      console.log(dadosLogin)
      // Dentro do handleLogin no login.jsx
      const response = await api.post("/auth/login", dadosLogin);

      const { token, pessoaId, nome } = response.data;

      // Guardamos o ID da pessoa para usar nas rotas de Diário
      localStorage.setItem("token", token);
      localStorage.setItem("pessoaId", pessoaId);
      localStorage.setItem("userName", nome);
      localStorage.setItem("isLogged", "true");

      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso.",
        status: "success",
        duration: 3000,
      });

      // 2. Redireciona o utilizador para a Dashboard ou Lista de Diários
      window.location.href = "/diarios";

      // 3. (Opcional mas recomendado) Força o Contexto a carregar os dados
      // refreshAllData(); se estiveres a usar aquele contexto que criámos

    } catch (error) {
      console.error("Erro no login. Credenciais erradas?", error);
      toast({
        title: "Erro no login",
        description: "E-mail ou senha inválidos.",
        status: "error",
        duration: 3000,
      });
    }


  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6} w="full">
        {/* Cabeçalho */}
        <Stack align="center">
          <Icon as={FaLock} w={10} h={10} color="teal.500" />
          <Heading fontSize="4xl" textAlign="center">
            Acesso Restrito
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Entre para gerenciar seu <Text as="span" fontWeight="bold" color="teal.500">Diário de Bordo</Text>
          </Text>
        </Stack>

        {/* Card do Formulário */}
        <Box
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={8}
          borderWidth="1px"
        >
          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>E-mail</FormLabel>
                <InputGroup>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    focusBorderColor="teal.400"
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha secreta"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focusBorderColor="teal.400"
                  />
                  <InputRightElement h="full">
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  size="lg"
                  bg="teal.500"
                  color="white"
                  _hover={{
                    bg: "teal.600",
                  }}
                  leftIcon={<FaUser />}
                >
                  Entrar no Sistema
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Login;