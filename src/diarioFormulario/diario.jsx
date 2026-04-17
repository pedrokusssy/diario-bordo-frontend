import {
  Box,
  Select,
  FormControl,
  Textarea,
  Input,
  FormLabel,
  Stack,
  Button,
  useToast,
  Heading,
  Icon,
  Flex,
  useColorModeValue,
  Text,
  Center,
  Spinner,
  Container,
  Divider,
  VStack
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBook, FaCalendarAlt, FaTasks, FaSave, FaEdit, FaArrowLeft } from "react-icons/fa";

import { useAppGlobal } from "../contexts/DiarioContext"; 
import { createDiario, getDiarioById, updateDiario } from "../services/api";

function Diario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { atividades, usuario, loading } = useAppGlobal();

  const bg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");

  const [actividadeId, setActividadeId] = useState("");
  const [dataActividade, setDataActividade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [buscandoDados, setBuscandoDados] = useState(false);

  useEffect(() => {
    if (id) {
      setBuscandoDados(true);
      getDiarioById(id)
        .then(response => {
          const dados = response.data;
          setActividadeId(dados.actividade.id);
          setDataActividade(dados.dataActividade);
          setDescricao(dados.descricao);
        })
        .catch(err => {
          toast({ title: "Erro", description: "Não foi possível carregar os dados.", status: "error" });
        })
        .finally(() => setBuscandoDados(false));
    }
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!actividadeId || !dataActividade || !descricao) {
      toast({ title: "Campos obrigatórios", description: "Por favor, preencha todos os campos.", status: "warning" });
      return;
    }

    const dadosDoDiario = {
      formando_id: localStorage.getItem("pessoaId"), 
      actividade_id: actividadeId,
      dataActividade: dataActividade,
      descricao: descricao,
    };

    try {
      if (id) {
        await updateDiario(id, dadosDoDiario);
        toast({ title: "Sucesso!", description: "Diário atualizado com sucesso.", status: "success" });
      } else {
        await createDiario(dadosDoDiario);
        toast({ title: "Sucesso!", description: "Diário criado com sucesso.", status: "success" });
      }
      navigate("/diarios");
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro ao salvar.", status: "error" });
    }
  };

  // Loader Centralizado
  if (loading || buscandoDados) {
    return (
      <Center h="70vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" thickness="4px" speed="0.65s" />
          <Text color="gray.500" fontWeight="medium">A preparar o seu diário...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    /* Container XL para dar amplitude e py=12 para respiração vertical */
    <Container maxW="container.md" py={12}>
      
      {/* Botão de Voltar Subtil */}
      <Button 
        leftIcon={<FaArrowLeft />} 
        variant="ghost" 
        mb={6} 
        colorScheme="teal" 
        size="sm"
        onClick={() => navigate("/diarios")}
      >
        Voltar para a lista
      </Button>

      <Box
        bg={bg}
        p={{ base: 8, md: 12 }} // Mais padding interno
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="2xl"
        position="relative"
        overflow="hidden"
      >
        {/* Barra de destaque superior */}
        <Box position="absolute" top={0} left={0} right={0} h="4px" bg="teal.500" />

        <Flex align="center" mb={10}>
          <Center w={14} h={14} bg="teal.50" borderRadius="full" mr={5}>
            <Icon as={id ? FaEdit : FaBook} w={6} h={6} color="teal.500" />
          </Center>
          <Box>
            <Heading size="lg" color="gray.800" letterSpacing="tight">
              {id ? "Editar Registro" : "Novo Lançamento"}
            </Heading>
            <Text color={secondaryTextColor} fontSize="md">
              Formando: <Text as="span" fontWeight="bold" color="teal.600">{usuario?.nome}</Text>
            </Text>
          </Box>
        </Flex>

        <Divider mb={10} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={8}>
            {/* Linha Dupla para Atividade e Data */}
            <Stack direction={{ base: "column", md: "row" }} spacing={6}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.700" mb={3}>
                  <Icon as={FaTasks} mr={2} color="teal.400" />
                  Atividade Realizada
                </FormLabel>
                <Select
                  placeholder="Selecione a atividade"
                  value={actividadeId}
                  onChange={(e) => setActividadeId(e.target.value)}
                  focusBorderColor="teal.400"
                  size="lg"
                  borderRadius="lg"
                  bg={useColorModeValue("gray.50", "gray.800")}
                >
                  {atividades.map((act) => (
                    <option value={act.id} key={act.id}>
                      {act.actividade}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.700" mb={3}>
                  <Icon as={FaCalendarAlt} mr={2} color="teal.400" />
                  Data do Registro
                </FormLabel>
                <Input
                  type="date"
                  value={dataActividade}
                  onChange={(e) => setDataActividade(e.target.value)}
                  focusBorderColor="teal.400"
                  size="lg"
                  borderRadius="lg"
                  bg={useColorModeValue("gray.50", "gray.800")}
                />
              </FormControl>
            </Stack>

            <FormControl isRequired>
              <FormLabel fontWeight="bold" color="gray.700" mb={3}>
                Descrição Detalhada
              </FormLabel>
              <Textarea
                placeholder="Descreva detalhadamente o que foi realizado, observações e aprendizagens..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                size="lg"
                borderRadius="lg"
                rows={8}
                focusBorderColor="teal.400"
                bg={useColorModeValue("gray.50", "gray.800")}
                lineHeight="tall"
              />
            </FormControl>

            <Box pt={6}>
              <Button
                type="submit"
                colorScheme="teal"
                size="xl" // Botão maior e mais impactante
                w="full"
                h="60px"
                fontSize="lg"
                leftIcon={id ? <FaEdit /> : <FaSave />}
                shadow="xl"
                borderRadius="xl"
                _hover={{ transform: "translateY(-2px)", boxShadow: "2xl" }}
                _active={{ transform: "scale(0.98)" }}
                transition="all 0.2s"
              >
                {id ? "Guardar Alterações" : "Finalizar Registro"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>

      <Text mt={8} textAlign="center" fontSize="sm" color="gray.400">
        Os seus dados são salvos de forma segura na plataforma.
      </Text>
    </Container>
  );
}

export default Diario;