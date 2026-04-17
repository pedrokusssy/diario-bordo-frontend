import {
  Box,
  Button,
  HStack,
  useToast,
  Text,
  Flex,
  Heading,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useColorModeValue,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaFilePdf } from "react-icons/fa";
import { getDiarioByFormandoId, deleteDiario } from "../services/api";
import { gerarDiarioBordoPDF } from "../services/pdfService";

function DiarioList() {
  const [diarios, setDiarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    carregarDiarios();
  }, []);

  const carregarDiarios = () => {
    setLoading(true);
    getDiarioByFormandoId(localStorage.getItem("pessoaId"))
      .then((response) => setDiarios(response.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleExportPDF = () => {
    // CORREÇÃO: Pegamos o nome do formando do localStorage ou definimos um padrão
    const nomeFormando = localStorage.getItem("userName") || "Edevânio Almeida";

    const dadosId = {
      especialidade: "Ortopedia",
      tutor: "Dr. José Tulha",
      formando: nomeFormando, // Agora a variável está definida
      dataInicio: "09-02-2026",
      dataFim: "30-04-2026",
      hospitalOrigem: "Hospital Militar",
      horario: "08h - 16h",
      local: "Hospital da Prelada",
      unidade: "Bloco Operatório"
    };

    // Formata os diários para o formato que a função PDF espera
    const atividadesFormatadas = diarios.map(d => ({
      data: new Date(d.dataActividade).toLocaleDateString('pt-PT'),
      atividade: d.actividade.actividade,
      descricao: d.descricao
    }));

    gerarDiarioBordoPDF(dadosId, atividadesFormatadas);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apagar este diário?")) {
      try {
        await deleteDiario(id);
        setDiarios(diarios.filter(d => d.id !== id));
        toast({ title: "Removido", status: "success" });
      } catch (err) { toast({ title: "Erro", status: "error" }); }
    }
  };

  return (
    <Box 
      h="calc(100vh - 64px)" 
      w="100%" 
      display="flex" 
      flexDirection="column"
      overflow="hidden" // Impede scroll na página toda
      bg="gray.50"
    >
      <Container 
        maxW="container.xl" 
        h="full" 
        display="flex" 
        flexDirection="column" 
        pt={10} 
        pb={6}
      >
        {/* HEADER */}
        <Flex justify="space-between" align="flex-end" mb={8} flexShrink={0}>
          <VStack align="start" spacing={1}>
            <Heading size="xl" color="teal.700" letterSpacing="tight">Diário de Bordo</Heading>
            <Text fontSize="md" color="gray.500">Registos de formação e atividades diárias</Text>
          </VStack>
          
          <HStack spacing={4}>
            <Button
              leftIcon={<FaFilePdf />}
              colorScheme="orange"
              size="lg"
              onClick={handleExportPDF}
              isDisabled={diarios.length === 0}
            >
              Exportar PDF
            </Button>

            <Button 
              leftIcon={<FaPlus />} 
              colorScheme="teal" 
              size="lg"
              onClick={() => navigate("/novoDiario")}
            >
              Novo Registro
            </Button>
          </HStack>
        </Flex>

        {/* ÁREA DA TABELA COM SCROLL INTERNO */}
        <Box 
          flex="1" 
          bg={cardBg} 
          borderRadius="2xl" 
          borderWidth="1px" 
          borderColor={borderColor}
          shadow="2xl"
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          <TableContainer 
            overflowY="auto" // Scroll apenas vertical
            flex="1"
            sx={{
              "&::-webkit-scrollbar": { width: "8px" },
              "&::-webkit-scrollbar-thumb": { background: "teal.500", borderRadius: "10px" },
            }}
          >
            <Table variant="simple" size="lg">
              <Thead position="sticky" top={0} bg={cardBg} zIndex={10} shadow="sm">
                <Tr>
                  <Th py={5} color="teal.700">Data</Th>
                  <Th color="teal.700">Atividade</Th>
                  <Th color="teal.700">Descrição Detalhada</Th>
                  <Th textAlign="center" color="teal.700">Ações</Th>
                </Tr>
              </Thead>
              
              <Tbody>
                {diarios.map((diario) => (
                  <Tr key={diario.id} _hover={{ bg: "teal.50" }}>
                    <Td fontWeight="bold" w="180px">
                      {new Date(diario.dataActividade).toLocaleDateString('pt-PT')}
                    </Td>
                    <Td w="220px">
                      <Badge colorScheme="teal" p={2} borderRadius="md" variant="subtle">
                        {diario.actividade.actividade}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600" lineHeight="tall" noOfLines={2}>
                        {diario.descricao}
                      </Text>
                    </Td>
                    <Td w="120px">
                      <HStack justify="center" spacing={1}>
                        <IconButton icon={<FaEdit />} variant="ghost" colorScheme="blue" size="sm" onClick={() => navigate(`/editarDiario/${diario.id}`)} />
                        <IconButton icon={<FaTrash />} variant="ghost" colorScheme="red" size="sm" onClick={() => handleDelete(diario.id)} />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  );
  1
}

export default DiarioList;