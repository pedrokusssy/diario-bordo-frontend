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
import { getDiarioByFormandoId, getAllFormacaoByFormandoId, getFormandoById, deleteDiario } from "../services/api";
import { gerarDiarioBordoPDF } from "../services/pdfService";

function DiarioList() {
  const [diarios, setDiarios] = useState([]);
  const [formacoes, setFormacoes] = useState([]);
  const [formando, setFormando] = useState([]);
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

  const carregarFormacoes = () => {
    setLoading(true);
    getAllFormacaoByFormandoId(localStorage.getItem("pessoaId"))
      .then((response) => {
        // console.log(response.data[0].tutor.nome);
        setFormacoes(response.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const carregarFormando = () => {
    setLoading(true);
    getFormandoById(localStorage.getItem("pessoaId"))
      .then((response) => {
        // console.log(response.data[0].tutor.nome);
        setFormando(response.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarFormacoes();
  }, []);

  useEffect(() => {
    carregarFormando();
  }, []);

  const handleExportPDF = () => {
    console.log(formacoes)
    const dadosId = {
      especialidade: formacoes[0].titulo,
      tutor: formacoes[0].tutor.nome,
      formando: formando.nome,
      periodo: {
        dataInicio:new Date(formacoes[0].periodo.dataInicio).toLocaleDateString('pt-PT') ,
        dataFim:new Date(formacoes[0].periodo.dataFim).toLocaleDateString('pt-PT'),
      },
      hospitalOrigem: formando.hospitalOrigem,
      horario: formacoes[0].periodo.horaInicio + " - " + formacoes[0].periodo.horaFim,
      local: formacoes[0].localFormacao,
      unidade: formacoes[0].unidade || ""
    };

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
      overflow="hidden"
      bg="gray.50"
    >
      <Container
        maxW="100%" // Mudado de container.xl para 100% para fluidez total
        px={[4, 6, 10]} // Padding lateral responsivo
        h="full"
        display="flex"
        flexDirection="column"
        pt={[4, 6, 10]} // Topo menor em ecrãs pequenos
        pb={6}
      >
        {/* HEADER RESPONSIVO */}
        <Flex
          justify="space-between"
          align={["start", "start", "flex-end"]} // Alinhamento muda conforme o ecrã
          direction={["column", "column", "row"]} // Empilha no telemóvel/portátil pequeno
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
              isDisabled={diarios.length === 0}
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

        {/* TABELA COM CORREÇÕES DE RESPONSIVIDADE E QUEBRA DE TEXTO */}
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
            {/* O layout="fixed" obriga a tabela a respeitar as larguras das colunas */}
            <Table variant="simple" size={["sm", "md", "lg"]} layout="fixed">
              <Thead position="sticky" top={0} bg={cardBg} zIndex={10} shadow="sm">
                <Tr>
                  {/* Larguras em Array: [mobile, tablet/laptop, monitor grande] */}
                  <Th w={["100px", "140px", "180px"]} color="teal.700">Data</Th>
                  <Th w={["120px", "180px", "220px"]} color="teal.700">Atividade</Th>
                  <Th color="teal.700">Descrição Detalhada</Th>
                  <Th w={["80px", "100px", "120px"]} textAlign="center" color="teal.700">Ações</Th>
                </Tr>
              </Thead>

              <Tbody>
                {diarios.map((diario) => (
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
                        isTruncated // Corta com "..." se a atividade for muito longa
                      >
                        {diario.actividade.actividade}
                      </Badge>
                    </Td>

                    {/* SOLUÇÃO PARA O BUG DO TEXTO HORIZONTAL */}
                    <Td>
                      <Text
                        fontSize={["xs", "sm"]}
                        color="gray.600"
                        lineHeight="tall"
                        whiteSpace="normal"    // Força o texto a quebrar a linha
                        wordBreak="break-word" // Quebra palavras gigantes
                        noOfLines={[2, 3, 4]}  // Limita linhas para não deformar a tabela
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