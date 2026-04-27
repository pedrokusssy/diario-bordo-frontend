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
    <Container maxW="container.md" py={{ base: 4, md: 12 }} px={{ base: 4, md: 6 }}>
      
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
        p={{ base: 5, sm: 8, md: 12 }} // Padding reduzido no mobile (5) e maior no desktop (12)
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="2xl"
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" top={0} left={0} right={0} h="4px" bg="teal.500" />

        <Flex align="center" mb={{ base: 6, md: 10 }} direction={{ base: "row", sm: "row" }}>
          <Center 
            w={{ base: 10, md: 14 }} 
            h={{ base: 10, md: 14 }} 
            bg="teal.50" 
            borderRadius="full" 
            mr={{ base: 3, md: 5 }}
            flexShrink={0}
          >
            <Icon as={id ? FaEdit : FaBook} w={{ base: 5, md: 6 }} h={{ base: 5, md: 6 }} color="teal.500" />
          </Center>
          <Box>
            <Heading size={{ base: "md", md: "lg" }} color="gray.800" letterSpacing="tight">
              {id ? "Editar Registro" : "Novo Lançamento"}
            </Heading>
            <Text color={secondaryTextColor} fontSize={{ base: "xs", md: "md" }}>
              Formando: <Text as="span" fontWeight="bold" color="teal.600">{usuario?.nome}</Text>
            </Text>
          </Box>
        </Flex>

        <Divider mb={{ base: 6, md: 10 }} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={{ base: 5, md: 8 }}>
            
            <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 4, md: 6 }}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.700" mb={2} fontSize={{ base: "sm", md: "md" }}>
                  <Icon as={FaTasks} mr={2} color="teal.400" />
                  Atividade Realizada
                </FormLabel>
                <Select
                  placeholder="Selecione a atividade"
                  value={actividadeId}
                  onChange={(e) => setActividadeId(e.target.value)}
                  focusBorderColor="teal.400"
                  size={{ base: "md", md: "lg" }}
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
                <FormLabel fontWeight="bold" color="gray.700" mb={2} fontSize={{ base: "sm", md: "md" }}>
                  <Icon as={FaCalendarAlt} mr={2} color="teal.400" />
                  Data do Registro
                </FormLabel>
                <Input
                  type="date"
                  value={dataActividade}
                  onChange={(e) => setDataActividade(e.target.value)}
                  focusBorderColor="teal.400"
                  size={{ base: "md", md: "lg" }}
                  borderRadius="lg"
                  bg={useColorModeValue("gray.50", "gray.800")}
                />
              </FormControl>
            </Stack>

            <FormControl isRequired>
              <FormLabel fontWeight="bold" color="gray.700" mb={2} fontSize={{ base: "sm", md: "md" }}>
                Descrição Detalhada
              </FormLabel>
              <Textarea
                placeholder="Descreva detalhadamente o que foi realizado..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                size={{ base: "md", md: "lg" }}
                borderRadius="lg"
                rows={{ base: 5, md: 8 }} // Menos linhas no mobile para não ocupar o ecrã todo
                focusBorderColor="teal.400"
                bg={useColorModeValue("gray.50", "gray.800")}
                lineHeight="tall"
              />
            </FormControl>

            <Box pt={4}>
              <Button
                type="submit"
                colorScheme="teal"
                size={{ base: "lg", md: "xl" }}
                w="full"
                h={{ base: "50px", md: "60px" }} // Altura adaptável
                fontSize={{ base: "md", md: "lg" }}
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

      <Text mt={6} textAlign="center" fontSize="xs" color="gray.400">
        Os seus dados são salvos de forma segura na plataforma.
      </Text>
    </Container>
  );
}

export default Diario;