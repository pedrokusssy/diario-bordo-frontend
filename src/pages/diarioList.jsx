import {
  Box, Button, HStack, useToast, Text, Flex, Heading, Badge, Table, Thead, Tbody, Tr, Th, Td,
  Divider, TableContainer, IconButton, useColorModeValue, VStack, Container,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Tooltip
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaFilePdf, FaEye } from "react-icons/fa";
import { getAllFormacaoByFormandoId, getFormandoById, deleteDiario } from "../services/api";
import { gerarDiarioBordoPDF } from "../services/pdfService";
import { useAppGlobal } from "../contexts/DiarioContext";

function DiarioList() {
  const { diarios, refreshAllData } = useAppGlobal();
  const [formacoes, setFormacoes] = useState([]);
  const [formando, setFormando] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDiario, setSelectedDiario] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const diariosOrdenados = [...(diarios || [])].sort((a, b) => new Date(b.dataActividade) - new Date(a.dataActividade));

  useEffect(() => {
    const fetchData = async () => {
      setLoadingLocal(true);
      try {
        const [resFormacoes, resFormando] = await Promise.all([
          getAllFormacaoByFormandoId(localStorage.getItem("pessoaId")),
          getFormandoById(localStorage.getItem("pessoaId"))
        ]);
        setFormacoes(resFormacoes.data);
        setFormando(resFormando.data);
      } catch (err) { console.error(err); }
      finally { setLoadingLocal(false); }
    };
    fetchData();
  }, []);

  const handleOpenDetails = (diario) => {
    setSelectedDiario(diario);
    onOpen();
  };

  const formatDescricao = (texto) => {
    if (!texto) return "";
    return texto.length > 155 ? texto.substring(0, 155) + "..." : texto;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apagar este registo?")) {
      try {
        await deleteDiario(id);
        refreshAllData();
        toast({ title: "Removido", status: "success" });
      } catch (err) { toast({ title: "Erro", status: "error" }); }
    }
  };

  const handleExportPDF = () => {
    if (!formacoes.length) return;
    const dadosId = {
      especialidade: formacoes[0].titulo,
      tutor: formacoes[0].tutor.nome,
      formando: formando.nome,
      periodo: {
        dataInicio: new Date(formacoes[0].periodo.dataInicio).toLocaleDateString('pt-PT'),
        dataFim: new Date(formacoes[0].periodo.dataFim).toLocaleDateString('pt-PT'),
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

  return (
    <Box h="100vh" w="100%" bg="gray.50" display="flex" flexDirection="column" overflow="hidden">
      <Box flexShrink={0} height={{ base: "80px", md: "110px", lg: "120px" }} />

      <Container maxW="container.xl" px={{ base: 4, md: 8 }} flex="1" display="flex" flexDirection="column" overflow="hidden" pb={6}>
        
        {/* HEADER */}
        <Flex justify="space-between" align="center" mb={6} flexShrink={0}>
          <Heading size="md" color="gray.600" fontWeight="700">Registos de atividades</Heading>
          <HStack spacing={3}>
            <Button leftIcon={<FaFilePdf />} colorScheme="orange" variant="outline" size="sm" onClick={handleExportPDF} isDisabled={diariosOrdenados.length === 0}>PDF</Button>
            <Button leftIcon={<FaPlus />} colorScheme="teal" size="sm" onClick={() => navigate("/novoDiario")}>Novo</Button>
          </HStack>
        </Flex>

        {/* --- DESKTOP: TABELA COM OVERSIZE NA DESCRIÇÃO --- */}
        <Box flex="1" bg={cardBg} borderRadius="xl" borderWidth="1px" borderColor={borderColor} shadow="sm" display={{ base: "none", md: "flex" }} flexDirection="column" overflow="hidden">
          <TableContainer flex="1" overflowY="auto">
            <Table variant="simple" layout="fixed">
              <Thead bg="white" position="sticky" top={0} zIndex={2}>
                <Tr shadow="sm">
                  <Th w="130px">Data</Th>
                  <Th w="220px">Atividade</Th>
                  <Th>Descrição (Oversize)</Th>
                  <Th w="120px" textAlign="center">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {diariosOrdenados.map((diario) => (
                  <Tr key={diario.id} _hover={{ bg: "gray.50" }}>
                    <Td fontWeight="bold" verticalAlign="top">{new Date(diario.dataActividade).toLocaleDateString('pt-PT')}</Td>
                    <Td verticalAlign="top">
                      <Badge colorScheme="teal" variant="subtle" p={2} borderRadius="md" whiteSpace="normal">
                        {diario.actividade.actividade}
                      </Badge>
                    </Td>
                    <Td verticalAlign="top" p={2}>
                      <Box
                        maxH="80px" overflowY="auto" whiteSpace="pre-wrap" wordBreak="break-word" fontSize="sm" color="gray.600"
                        cursor="pointer" onClick={() => handleOpenDetails(diario)} pr={2}
                        sx={{ "&::-webkit-scrollbar": { width: "3px" }, "&::-webkit-scrollbar-thumb": { background: "gray.200", borderRadius: "10px" } }}
                      >
                        {formatDescricao(diario.descricao)}
                      </Box>
                    </Td>
                    <Td verticalAlign="top">
                      <HStack justify="center" spacing={1}>
                        <IconButton aria-label="Ver" icon={<FaEye />} size="sm" variant="ghost" colorScheme="teal" onClick={() => handleOpenDetails(diario)} />
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

        {/* --- MOBILE: CARDS RESTAURADOS (100% ORIGINAIS) --- */}
        <Box flex="1" display={{ base: "flex", md: "none" }} flexDirection="column" overflowY="auto">
          <VStack spacing={4} align="stretch" pb={4}>
            {diariosOrdenados.map((diario) => (
              <Box 
                key={diario.id} bg={cardBg} p={4} borderRadius="xl" borderWidth="1px" borderColor={borderColor} shadow="sm"
                onClick={() => handleOpenDetails(diario)}
              >
                <Flex justify="space-between" align="start" mb={2}>
                  <Text fontWeight="bold" fontSize="sm" color="teal.700">
                    {new Date(diario.dataActividade).toLocaleDateString('pt-PT')}
                  </Text>
                  <Badge colorScheme="teal" variant="subtle" px={2} borderRadius="full">
                    ID: #{diario.id.toString().slice(-3)}
                  </Badge>
                </Flex>
                <Heading size="xs" mb={2} color="gray.700">{diario.actividade.actividade}</Heading>
                <Text fontSize="sm" color="gray.600" mb={4}>{formatDescricao(diario.descricao)}</Text>
                <Divider mb={3} />
                <HStack justify="flex-end">
                  <Button size="xs" variant="outline" colorScheme="blue" onClick={(e) => { e.stopPropagation(); navigate(`/editarDiario/${diario.id}`); }}>Editar</Button>
                  <Button size="xs" variant="outline" colorScheme="red" onClick={(e) => { e.stopPropagation(); handleDelete(diario.id); }}>Apagar</Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </Container>

      {/* --- MODAL RESTAURADO --- */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent borderRadius="32px">
          <ModalHeader>
            <Badge colorScheme="teal" mb={2}>{selectedDiario && new Date(selectedDiario.dataActividade).toLocaleDateString('pt-PT')}</Badge>
            <Heading size="md">{selectedDiario?.actividade.actividade}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Text color="gray.600" fontSize="md" lineHeight="1.8" whiteSpace="pre-wrap">{selectedDiario?.descricao}</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Fechar</Button>
            <Button colorScheme="teal" onClick={() => navigate(`/editarDiario/${selectedDiario?.id}`)}>Editar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default DiarioList;