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
    const diariosParaPDF = [...(diarios || [])].sort((a, b) => new Date(a.dataActividade) - new Date(b.dataActividade));
    gerarDiarioBordoPDF(dadosId, diariosParaPDF.map(d => ({
      data: new Date(d.dataActividade).toLocaleDateString('pt-PT'),
      atividade: d.actividade.actividade,
      descricao: d.descricao
    })));
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
    <Box minH="100vh" w="100%" bg="gray.50" pb={10} overflowX="hidden">
      <Container 
        maxW="container.xl" 
        px={{ base: 4, md: 8 }} 
        /* pt (Padding Top):
          - base: 100px (Telemóvel em pé)
          - md: 110px (Tablet/PC)
        */
        pt={{ base: "100px", md: "110px" }}
        /* ESTA É A CORREÇÃO PARA O MODO HORIZONTAL:
          Quando a altura do ecrã for menor que 500px (telemóvel deitado),
          forçamos o conteúdo a subir para 60px para não ser "comido" pela Navbar.
        */
        sx={{
          "@media screen and (max-height: 500px) and (orientation: landscape)": {
            pt: "65px !important",
          },
        }}
      >
        
        {/* HEADER RESPONSIVO */}
        <Flex 
          justify="space-between" 
          align="center" 
          direction="row" 
          gap={2} 
          
          mb={{ base: 4, md: 8 }}
          sx={{
            "@media screen and (max-height: 500px)": {
              mb: 2,
            },
          }}
        >

          <VStack align="start" spacing={0} flex="1">
            <Heading 
              size={{ base: "md", md: "lg", lg: "xl" }} 
              color="teal.700" 
              fontWeight="800"
              lineHeight="1.5"
            >
              Diário de Bordo
            </Heading>
            <Text 
              fontSize="sm" 
              color="gray.500" 
              display={{ base: "none", md: "block" }}
            >
              Registos de formação e atividades diárias
            </Text>
          </VStack>

          <HStack spacing={3}>
            <Button
              leftIcon={<FaFilePdf />}
              colorScheme="orange"
              variant="outline"
              size={{ base: "sm", md: "lg" }}
              onClick={handleExportPDF}
              isDisabled={diariosOrdenados.length === 0}
              px={{ base: 4, md: 6 }}
            >
              <Box as="span" display={{ base: "none", md: "inline" }}>
                Exportar PDF
              </Box>
            </Button>

            <Button
              leftIcon={<FaPlus />}
              colorScheme="teal"
              size={{ base: "sm", md: "lg" }}
              onClick={() => navigate("/novoDiario")}
              px={{ base: 4, md: 6 }}
            >
              <Box as="span" display={{ base: "none", md: "inline" }}>
                Novo Registro
              </Box>
            </Button>
          </HStack>
        </Flex>

        <Box 
          display={{ base: "none", md: "block" }} 
          bg={cardBg} 
          borderRadius="2xl" 
          borderWidth="1px" 
          borderColor={borderColor} 
          shadow="xl" 
          overflow="hidden"
        >
          <TableContainer>
            <Table variant="simple" layout="fixed">
              <Thead bg="gray.50">
                <Tr>
                  <Th w="15%">Data</Th>
                  <Th w="25%">Atividade</Th>
                  <Th w="45%">Descrição</Th>
                  <Th w="15%" textAlign="center">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {diariosOrdenados.map((diario) => (
                  <Tr key={diario.id} _hover={{ bg: "teal.50" }}>
                    <Td fontWeight="bold">{new Date(diario.dataActividade).toLocaleDateString('pt-PT')}</Td>
                    <Td>
                      <Badge 
                        colorScheme="teal" 
                        p={2} 
                        borderRadius="md" 
                        variant="subtle" 
                        whiteSpace="normal" // Quebra linha aqui
                        wordBreak="break-word"
                      >
                        {diario.actividade.actividade}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600" whiteSpace="normal" wordBreak="break-word">{diario.descricao}</Text>
                    </Td>
                    <Td>
                      <HStack justify="center" spacing={2}>
                        <IconButton aria-label="Edit" icon={<FaEdit />} variant="ghost" colorScheme="blue" size="sm" onClick={() => navigate(`/editarDiario/${diario.id}`)} />
                        <IconButton aria-label="Delete" icon={<FaTrash />} variant="ghost" colorScheme="red" size="sm" onClick={() => handleDelete(diario.id)} />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* --- VISTA TELEMÓVEL (Cards para ecrãs pequenos) --- */}
        <VStack display={{ base: "flex", md: "none" }} spacing={4} w="full" align="stretch">
          {diariosOrdenados.map((diario) => (
            <Box 
              key={diario.id} 
              bg={cardBg} 
              p={4} 
              borderRadius="xl" 
              borderWidth="1px" 
              borderColor={borderColor} 
              shadow="md"
              mx={1}
            >
              <Stack direction="row" justify="space-between" align="start" mb={3} spacing={2}>
                <Text fontWeight="bold" color="teal.700" fontSize="sm" whiteSpace="nowrap">
                  {new Date(diario.dataActividade).toLocaleDateString('pt-PT')}
                </Text>
                
                <Badge 
                  colorScheme="teal" 
                  variant="subtle" 
                  fontSize="xs" 
                  px={2}
                  py={1}
                  borderRadius="md"
                  whiteSpace="normal"    // Quebra linha no mobile
                  wordBreak="break-word"
                  textAlign="right"
                  maxW="180px"           // Limita largura para forçar a quebra
                >
                  {diario.actividade.actividade}
                </Badge>
              </Stack>
              
              <Text fontSize="sm" color="gray.600" mb={4} wordBreak="break-word">
                {diario.descricao}
              </Text>

              <Divider mb={3} />
              
              <HStack justify="flex-end" spacing={2}>
                <Button size="xs" leftIcon={<FaEdit />} variant="outline" colorScheme="blue" onClick={() => navigate(`/editarDiario/${diario.id}`)}>
                  Editar
                </Button>
                <Button size="xs" leftIcon={<FaTrash />} variant="outline" colorScheme="red" onClick={() => handleDelete(diario.id)}>
                  Apagar
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>

      </Container>
    </Box>
  );
}

export default DiarioList;