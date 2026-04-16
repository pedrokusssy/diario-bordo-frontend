import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  GridItem,
  Divider,
  Avatar,
  Flex,
  Badge,
  Button,
  Center,
  Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { minhaConta } from "../services/api";

function MinhaConta() {

  
  const [formando, setFormando] = useState(null);

  useEffect(() => {
    minhaConta(localStorage.getItem("pessoaId"))
      .then(res => setFormando(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!formando) return (
    <Center h="60vh">
      <Spinner color="teal.500" size="xl" />
      <Text ml={4}>Carregando dados da conta...</Text>
    </Center>
  );

  return (
    // Ajustado padding e margem para mobile
    <Box maxW="800px" mx="auto" mt={{ base: 4, md: 10 }} p={{ base: 4, md: 6 }}>
      <VStack spacing={8} align="stretch">
        
        {/* Cabeçalho de Perfil Responsivo */}
        <Flex 
          align="center" 
          gap={5} 
          direction={{ base: "column", md: "row" }} // Coluna no mobile, Linha no desktop
          textAlign={{ base: "center", md: "left" }} // Centraliza texto no mobile
        >
          <Avatar size="2xl" name={formando.nome} bg="teal.500" />
          <Box>
            <Heading size="lg">{formando.nome}</Heading>
            <Badge colorScheme="teal" mt={1}>Formando Ativo</Badge>
            <Text color="gray.500" fontSize="sm" mt={2}>
              NÚMERO ESTUDANTE: 
              <Box as="span" display={{ base: "block", md: "inline" }} fontWeight="bold"> 
                {formando.id}
              </Box>
            </Text>
          </Box>
        </Flex>

        <Divider />

        {/* Detalhes em Grid - Já estava responsivo com base: 1 */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 10 }}>
          
          <GridItem>
            <VStack align={{ base: "center", md: "start" }} spacing={4}>
              <HStackIcon label="Nome Completo" value={formando.nome} />
              <HStackIcon label="Hospital de Origem" value={formando.hospitalOrigem || "Não informado"} />
            </VStack>
          </GridItem>

          <GridItem>
            <VStack align={{ base: "center", md: "start" }} spacing={4}>
              <HStackIcon 
                label="Membro desde" 
                value={new Date(formando.createdAt).toLocaleDateString()} 
              />
              <HStackIcon 
                label="Última Atualização" 
                value={formando.updatedAt ? new Date(formando.updatedAt).toLocaleDateString() : "Sem alterações"} 
              />
            </VStack>
          </GridItem>

        </SimpleGrid>

        <Divider />

        {/* Ações Responsivas */}
        <Flex 
          justify={{ base: "center", md: "flex-end" }} 
          direction={{ base: "column", md: "row" }} // Botões empilhados no mobile
          gap={3}
        >
          <Button colorScheme="teal" variant="outline" w={{ base: "full", md: "auto" }}>
            Alterar Senha
          </Button>
          <Button colorScheme="teal" w={{ base: "full", md: "auto" }}>
            Editar Perfil
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}

function HStackIcon({ label, value }) {
  return (
    <Box textAlign={{ base: "center", md: "left" }}>
      <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">
        {label}
      </Text>
      <Text fontSize="md" fontWeight="medium">
        {value}
      </Text>
    </Box>
  );
}

export default MinhaConta;