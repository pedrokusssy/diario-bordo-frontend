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
import { getAllFormacaoByFormandoId, getFormandoById, deleteDiario } from "../services/api";
import { gerarDiarioBordoPDF } from "../services/pdfService";
import { useAppGlobal } from "../contexts/DiarioContext"; 

function DiarioList() {
  const { diarios, refreshAllData } = useAppGlobal();

  const [formacoes, setFormacoes] = useState([]);
  const [formando, setFormando] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(true);
  
  const toast = useToast();
  const navigate = useNavigate();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // --- A MÁGICA DA ORDENAÇÃO ACONTECE AQUI ---
  // Criamos uma cópia do array e ordenamos (b - a = do mais recente para o mais antigo)
  const diariosOrdenados = [...(diarios || [])].sort((a, b) => {
    return new Date(b.dataActividade) - new Date(a.dataActividade);
  });

  const carregarFormacoes = () => {
    setLoadingLocal(true);
    getAllFormacaoByFormandoId(localStorage.getItem("pessoaId"))
      .then((response) => setFormacoes(response.data))
      .catch(console.error)
      .finally(() => setLoadingLocal(false));
  };

  const carregarFormando = () => {
    setLoadingLocal(true);
    getFormandoById(localStorage.getItem("pessoaId"))
      .then((response) => setFormando(response.data))
      .catch(console.error)
      .finally(() => setLoadingLocal(false));
  };

  useEffect(() => {
    carregarFormacoes();
    carregarFormando();
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

    // --- NOVA ORDENAÇÃO EXCLUSIVA PARA O PDF ---
    // a - b = ordena do mais antigo para o mais recente
    const diariosParaPDF = [...(diarios || [])].sort((a, b) => {
      return new Date(a.dataActividade) - new Date(b.dataActividade);
    });

    const atividadesFormatadas = diariosParaPDF.map(d => ({
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
      } catch (err) { 
        toast({ title: "Erro", status: "error" }); 
      }
    }
  };

  return (
    <Box
      h="calc(100vh - 64px)"
      w="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      bg="gray.50"
    >
      <Container
        maxW="100%"
        px={[4, 6, 10]}
        h="full"
        display="flex"
        flexDirection="column"
        pt={[4, 6, 10]}
        pb={6}
      >
        <Flex
          justify="space-between"
          align={["start", "start", "flex-end"]}
          direction={["column", "column", "row"]}
          gap={[4, 4, 0]}
          mb={8}
          flexShrink={0}
        >
          <VStack align="start" spacing={1}>
            <Heading size={["lg", "xl"]} color="teal.700" letterSpacing="tight">
              Diário de Bordo
            </Heading>
            <Text fontSize={["sm", "md"]} color="gray.500">
              Registos de formação e atividades diárias
            </Text>
          </VStack>

          <HStack spacing={4} w={["full", "full", "auto"]}>
            <Button
              leftIcon={<FaFilePdf />}
              colorScheme="orange"
              size={["md", "lg"]}
              flex={["1", "1", "initial"]}
              onClick={handleExportPDF}
              isDisabled={diariosOrdenados.length === 0}
            >
              Exportar PDF
            </Button>

            <Button
              leftIcon={<FaPlus />}
              colorScheme="teal"
              size={["md", "lg"]}
              flex={["1", "1", "initial"]}
              onClick={() => navigate("/novoDiario")}
            >
              Novo Registro
            </Button>
          </HStack>
        </Flex>

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
            overflowY="auto"
            flex="1"
            sx={{
              "&::-webkit-scrollbar": { width: "8px" },
              "&::-webkit-scrollbar-thumb": { background: "teal.500", borderRadius: "10px" },
            }}
          >
            <Table variant="simple" size={["sm", "md", "lg"]} layout="fixed">
              <Thead position="sticky" top={0} bg={cardBg} zIndex={10} shadow="sm">
                <Tr>
                  <Th w={["100px", "140px", "180px"]} color="teal.700">Data</Th>
                  <Th w={["120px", "180px", "220px"]} color="teal.700">Atividade</Th>
                  <Th color="teal.700">Descrição Detalhada</Th>
                  <Th w={["80px", "100px", "120px"]} textAlign="center" color="teal.700">Ações</Th>
                </Tr>
              </Thead>

              <Tbody>
                {/* Usamos a lista ORDENADA para desenhar as linhas da tabela */}
                {diariosOrdenados.map((diario) => (
                  <Tr key={diario.id} _hover={{ bg: "teal.50" }}>
                    <Td fontWeight="bold" fontSize={["xs", "sm", "md"]}>
                      {new Date(diario.dataActividade).toLocaleDateString('pt-PT')}
                    </Td>

                    <Td>
                      <Badge
                        colorScheme="teal"
                        p={2}
                        borderRadius="md"
                        variant="subtle"
                        fontSize={["xs", "xs", "sm"]}
                        w="full"
                        textAlign="center"
                        isTruncated
                      >
                        {diario.actividade.actividade}
                      </Badge>
                    </Td>

                    <Td>
                      <Text
                        fontSize={["xs", "sm"]}
                        color="gray.600"
                        lineHeight="tall"
                        whiteSpace="normal"
                        wordBreak="break-word"
                        noOfLines={[2, 3, 4]}
                      >
                        {diario.descricao}
                      </Text>
                    </Td>

                    <Td>
                      <HStack justify="center" spacing={[1, 2]}>
                        <IconButton
                          icon={<FaEdit />}
                          variant="ghost"
                          colorScheme="blue"
                          size="sm"
                          onClick={() => navigate(`/editarDiario/${diario.id}`)}
                        />
                        <IconButton
                          icon={<FaTrash />}
                          variant="ghost"
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDelete(diario.id)}
                        />
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
}

export default DiarioList;