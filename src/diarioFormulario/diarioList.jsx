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
  Stack,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaFilePdf } from "react-icons/fa";
import { getAllFormacaoByFormandoId, getFormandoById, deleteDiario } from "../services/api";
import { gerarDiarioBordoPDF } from "../services/pdfService";
import { useAppGlobal } from "../contexts/DiarioContext";

function DiarioList() {
  const { diarios, refreshAllData } = useAppGlobal();
  const [formacoes, setFormacoes] = useState([]);
  const [formando, setFormando] = useState([]);
  
  const toast = useToast();
  const navigate = useNavigate();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const diariosOrdenados = [...(diarios || [])].sort((a, b) => {
    return new Date(b.dataActividade) - new Date(a.dataActividade);
  });

  useEffect(() => {
    const id = localStorage.getItem("pessoaId");
    if (id) {
      getAllFormacaoByFormandoId(id).then(res => setFormacoes(res.data)).catch(console.error);
      getFormandoById(id).then(res => setFormando(res.data)).catch(console.error);
    }
  }, []);

  const handleExportPDF = () => {
    const dadosId = {
      especialidade: formacoes[0]?.titulo,
      tutor: formacoes[0]?.tutor?.nome,
      formando: formando.nome,
      periodo: {
        dataInicio: formacoes[0]?.periodo?.dataInicio ? new Date(formacoes[0].periodo.dataInicio).toLocaleDateString('pt-PT') : '',
        dataFim: formacoes[0]?.periodo?.dataFim ? new Date(formacoes[0].periodo.dataFim).toLocaleDateString('pt-PT') : '',
      },
      hospitalOrigem: formando.hospitalOrigem,
      horario: formacoes[0]?.periodo ? `${formacoes[0].periodo.horaInicio} - ${formacoes[0].periodo.horaFim}` : '',
      local: formacoes[0]?.localFormacao,
      unidade: formacoes[0]?.unidade || ""
    };
    const atividadesFormatadas = diariosOrdenados.map(d => ({
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
        refreshAllData();
        toast({ title: "Removido", status: "success" });
      } catch (err) { toast({ title: "Erro", status: "error" }); }
    }
  };

  return (
    <Box 
      h="100vh" // SOLUÇÃO: Ecrã trancado
      w="100%"
      bg="gray.50" 
      display="flex"
      flexDirection="column"
      overflow="hidden" // SOLUÇÃO: Impede scroll na página toda
    >
      {/* ESPAÇADOR OBRIGATÓRIO PARA A NAVBAR FIXED */}
      <Box flexShrink={0} height={{ base: "80px", md: "110px", lg: "120px" }} />

      <Container 
        maxW="container.xl" 
        px={{ base: 4, md: 8 }}
        flex="1" // SOLUÇÃO: Container ocupa o resto do ecrã
        display="flex"
        flexDirection="column"
        overflow="hidden"
        pb={6}
      >
        
        {/* HEADER (TÍTULO E BOTÕES) */}
        <Flex 
          justify="space-between" 
          align="center" 
          mb={6} 
          pt={2} 
          flexShrink={0} // SOLUÇÃO: Header nunca é esmagado
        >
          <VStack align="start" spacing={0}>
            <Heading size={{ base: "md", md: "lg" }} color="gray.500" fontWeight="700">
            Registos de atividades diárias
            </Heading>
          </VStack>

          <HStack spacing={3}>
            <Button
              leftIcon={<FaFilePdf />}
              colorScheme="orange"
              variant="outline"
              size={{ base: "sm", md: "lg" }}
              onClick={handleExportPDF}
              isDisabled={diariosOrdenados.length === 0}
            >
              <Box as="span" display={{ base: "none", md: "inline" }}>PDF</Box>
            </Button>

            <Button
              leftIcon={<FaPlus />}
              colorScheme="teal"
              size={{ base: "sm", md: "lg" }}
              onClick={() => navigate("/novoDiario")}
            >
              <Box as="span" display={{ base: "none", md: "inline" }}>Novo</Box>
            </Button>
          </HStack>
        </Flex>

        {/* --- VISTA DESKTOP (TABELA COM SCROLL INTERNO) --- */}
        <Box 
          flex="1" // Ocupa espaço até ao fundo
          bg={cardBg} 
          borderRadius="xl" 
          borderWidth="1px" 
          borderColor={borderColor} 
          shadow="md"
          display={{ base: "none", md: "flex" }} // Flex em vez de block para o scroll funcionar
          flexDirection="column"
          overflow="hidden"
        >
          <TableContainer 
            flex="1" 
            overflowY="auto" // Scroll apenas dentro da tabela
            sx={{
              "&::-webkit-scrollbar": { width: "8px", height: "8px" },
              "&::-webkit-scrollbar-thumb": { background: "teal.400", borderRadius: "10px" },
              "&::-webkit-scrollbar-track": { background: "gray.50" },
            }}
          >
            <Table variant="simple" layout="fixed">
              <Thead>
                {/* Cabeçalho Fixo (Sticky) com fundo branco */}
                <Tr position="sticky" top={0} zIndex={2} shadow="sm">
                  <Th w="15%" bg="white">Data</Th>
                  <Th w="25%" bg="white">Atividade</Th>
                  <Th bg="white">Descrição</Th>
                  <Th w="120px" textAlign="center" bg="white">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {diariosOrdenados.map((diario) => (
                  <Tr key={diario.id} _hover={{ bg: "gray.50" }}>
                    <Td fontWeight="bold" whiteSpace="nowrap">
                      {new Date(diario.dataActividade).toLocaleDateString('pt-PT')}
                    </Td>
                    <Td>
                      <Badge colorScheme="teal" variant="subtle" p={2} borderRadius="md" whiteSpace="normal">
                        {diario.actividade.actividade}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600" whiteSpace="normal">
                        {diario.descricao}
                      </Text>
                    </Td>
                    <Td>
                      <HStack justify="center" spacing={1}>
                        <IconButton aria-label="Edit" icon={<FaEdit />} size="sm" variant="ghost" colorScheme="blue" onClick={() => navigate(`/editarDiario/${diario.id}`)} />
                        <IconButton aria-label="Delete" icon={<FaTrash />} size="sm" variant="ghost" colorScheme="red" onClick={() => handleDelete(diario.id)} />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* --- VISTA TELEMÓVEL (CARDS COM SCROLL INTERNO) --- */}
        <Box
          flex="1" // Ocupa espaço até ao fundo
          display={{ base: "flex", md: "none" }} 
          flexDirection="column"
          overflowY="auto" // Scroll apenas para os Cards
          sx={{
            "&::-webkit-scrollbar": { display: "none" }, // Esconde a barra para visual mais limpo
          }}
        >
          <VStack spacing={4} align="stretch" pb={4}>
            {diariosOrdenados.map((diario) => (
              <Box key={diario.id} bg={cardBg} p={4} borderRadius="xl" borderWidth="1px" borderColor={borderColor} shadow="sm">
                <Flex justify="space-between" align="start" mb={2}>
                  <Text fontWeight="bold" fontSize="sm" color="teal.700">
                    {new Date(diario.dataActividade).toLocaleDateString('pt-PT')}
                  </Text>
                  <Badge colorScheme="teal" variant="subtle" whiteSpace="normal" maxW="150px">
                    {diario.actividade.actividade}
                  </Badge>
                </Flex>
                <Text fontSize="sm" color="gray.600" mb={4}>{diario.descricao}</Text>
                <Divider mb={3} />
                <HStack justify="flex-end">
                  <Button size="xs" variant="outline" colorScheme="blue" onClick={() => navigate(`/editarDiario/${diario.id}`)}>Editar</Button>
                  <Button size="xs" variant="outline" colorScheme="red" onClick={() => handleDelete(diario.id)}>Apagar</Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

      </Container>
    </Box>
  );
}

export default DiarioList;