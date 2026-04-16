import { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  useToast,
  Text,
  Flex,
  Heading,
  Badge,
  Stack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useColorModeValue,
  Divider,
  VStack,
  Center
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaCalendarAlt, FaBook, FaPlus } from "react-icons/fa";
import { getDiarioByFormandoId, deleteDiario } from "../services/api";

function DiarioList() {
  const [diarios, setDiarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const emptyStateBg = useColorModeValue("teal.50", "gray.800");

  useEffect(() => {
    carregarDiarios();
  }, []);

  const carregarDiarios = () => {
    setLoading(true);
    getDiarioByFormandoId(localStorage.getItem("pessoaId"))
      .then((response) => {
        setDiarios(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este diário?")) {
      try {
        await deleteDiario(id);
        setDiarios(diarios.filter((diario) => diario.id !== id));
        toast({
          title: "Sucesso",
          description: "Diário removido da base de dados.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível remover o registro.", status: "error" });
      }
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }} h="100%">
      {/* HEADER DA PÁGINA */}
      <Flex 
        justify="space-between" 
        align="center" 
        mb={8} 
        direction={{ base: "column", sm: "row" }}
        gap={4}
      >
        <VStack align={{ base: "center", sm: "start" }} spacing={0}>
          <Heading size="lg" color="teal.600">Registros do Diário</Heading>
          <Text fontSize="sm" color="gray.500">Gerencie as suas atividades de formação</Text>
        </VStack>
        
        <Button 
          leftIcon={<FaPlus />} 
          colorScheme="teal" 
          shadow="md"
          onClick={() => navigate("/novoDiario")}
          w={{ base: "full", sm: "auto" }}
        >
          Novo Registro
        </Button>
      </Flex>

      {/* --- VISUALIZAÇÃO COM DADOS --- */}
      {diarios.length > 0 ? (
        <>
          {/* MOBILE: CARDS */}
          <Stack spacing={4} display={{ base: "flex", md: "none" }}>
            {diarios.map((diario) => (
              <Box
                key={diario.id}
                p={5}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="xl"
                shadow="sm"
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <HStack color="teal.500" fontSize="sm">
                    <Icon as={FaCalendarAlt} />
                    <Text fontWeight="bold">
                      {new Date(diario.dataActividade).toLocaleDateString('pt-PT')}
                    </Text>
                  </HStack>
                  <Badge colorScheme="teal" variant="subtle" borderRadius="md">
                    {diario.actividade.actividade}
                  </Badge>
                </Flex>
                
                <Text fontSize="sm" color="gray.600" mb={4} noOfLines={3}>
                  {diario.descricao}
                </Text>
                
                <Divider mb={4} />
                
                <HStack justify="flex-end" spacing={3}>
                  <IconButton
                    icon={<FaEdit />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => navigate(`/editarDiario/${diario.id}`)}
                    aria-label="Editar"
                  />
                  <IconButton
                    icon={<FaTrash />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDelete(diario.id)}
                    aria-label="Apagar"
                  />
                </HStack>
              </Box>
            ))}
          </Stack>

          {/* DESKTOP: TABELA MODERNA */}
          <TableContainer
            display={{ base: "none", md: "block" }}
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            shadow="xl"
          >
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th color="gray.600">Data</Th>
                  <Th color="gray.600">Atividade</Th>
                  <Th color="gray.600">Descrição</Th>
                  <Th color="gray.600" textAlign="center">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {diarios.map((diario) => (
                  <Tr key={diario.id} _hover={{ bg: "teal.50", transition: "0.2s" }}>
                    <Td fontWeight="semibold">
                      {new Date(diario.dataActividade).toLocaleDateString('pt-PT')}
                    </Td>
                    <Td>
                      <Badge colorScheme="teal" px={2} py={1} borderRadius="md">
                        {diario.actividade.actividade}
                      </Badge>
                    </Td>
                    <Td maxW="400px">
                      <Text noOfLines={1} fontSize="sm" color="gray.600">
                        {diario.descricao}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2} justify="center">
                        <Tooltip label="Editar Registro">
                          <IconButton
                            icon={<FaEdit />}
                            size="sm"
                            variant="outline"
                            colorScheme="blue"
                            onClick={() => navigate(`/editarDiario/${diario.id}`)}
                          />
                        </Tooltip>
                        <Tooltip label="Eliminar Registro">
                          <IconButton
                            icon={<FaTrash />}
                            size="sm"
                            variant="outline"
                            colorScheme="red"
                            onClick={() => handleDelete(diario.id)}
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      ) : (
        /* --- ESTADO VAZIO (MODERNO PARA MONITORES) --- */
        !loading && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            h="100%"
            minH="450px"
            textAlign="center"
            px={6}
          >
            <Box 
              mb={8} 
              p={10} 
              bg={emptyStateBg} 
              borderRadius="3xl" 
              color="teal.400"
              position="relative"
            >
              <Icon as={FaBook} boxSize={20} />
              <Box 
                position="absolute"
                bottom="-2"
                right="-2"
                bg="white"
                p={3}
                borderRadius="full"
                shadow="lg"
              >
                <Icon as={FaPlus} boxSize={5} color="orange.400" />
              </Box>
            </Box>

            <VStack spacing={4} maxW="500px">
              <Heading size="xl" color="gray.800" letterSpacing="tight">
                Nada por aqui ainda...
              </Heading>
              
              <Text fontSize="lg" color="gray.500">
                O seu histórico de atividades está vazio. Comece a registrar 
                o seu progresso diário agora mesmo.
              </Text>

              <Button
                mt={6}
                colorScheme="teal"
                size="lg"
                height="60px"
                px={10}
                borderRadius="xl"
                shadow="lg"
                _hover={{ transform: "translateY(-3px)", shadow: "2xl" }}
                onClick={() => navigate("/novoDiario")}
              >
                Criar meu primeiro registro
              </Button>
            </VStack>

            <Text mt={16} fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="widest">
              Plataforma Diário de Bordo • v1.0
            </Text>
          </Flex>
        )
      )}
    </Box>
  );
}

// Componente Tooltip simples para as ações (opcional)
function Tooltip({ label, children }) {
  return (
    <Box position="relative" role="group">
      {children}
      <Box
        display="none"
        _groupHover={{ display: "block" }}
        position="absolute"
        bottom="100%"
        left="50%"
        transform="translateX(-50%)"
        bg="gray.800"
        color="white"
        fontSize="xs"
        px={2}
        py={1}
        borderRadius="md"
        whiteSpace="nowrap"
        mb={2}
        zIndex={10}
      >
        {label}
      </Box>
    </Box>
  );
}

export default DiarioList;