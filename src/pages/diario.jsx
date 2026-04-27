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
  VStack,
  HStack,
  Badge
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBook, FaCalendarAlt, FaTasks, FaSave, FaEdit, FaArrowLeft, FaPlus } from "react-icons/fa";

import { useAppGlobal } from "../contexts/DiarioContext"; 
import { createDiario, getDiarioById, updateDiario } from "../services/api";

function Diario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { atividades, usuario, loading } = useAppGlobal();

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
  const inputBg = useColorModeValue("gray.50", "gray.900");

  const [actividadeId, setActividadeId] = useState("");
  const [dataActividade, setDataActividade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [buscandoDados, setBuscandoDados] = useState(false);
  const [issubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    if (!actividadeId || !dataActividade || !descricao) {
      toast({ title: "Campos obrigatórios", description: "Por favor, preencha todos os campos.", status: "warning", variant: "subtle" });
      setIsSubmitting(false);
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
        toast({ title: "Sucesso!", description: "Registo atualizado com sucesso.", status: "success", variant: "left-accent" });
      } else {
        await createDiario(dadosDoDiario);
        toast({ title: "Sucesso!", description: "Novo registo criado com sucesso.", status: "success", variant: "left-accent" });
      }
      navigate("/diarios");
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro ao salvar os dados.", status: "error" });
    } finally {
      setIsSubmitting(false);
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
    <Container maxW="container.md" py={{ base: 2, md: 6 }}>
      
      <Button 
        leftIcon={<FaArrowLeft />} 
        variant="ghost" 
        mb={4} 
        colorScheme="teal" 
        size="sm"
        borderRadius="full"
        onClick={() => navigate("/diarios")}
        _hover={{ bg: "teal.50", color: "teal.600" }}
      >
        Voltar para a lista
      </Button>

      <Box
        bg={bg}
        p={{ base: 6, md: 10 }}
        borderRadius="24px"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="0 10px 30px rgba(0,0,0,0.05)"
        position="relative"
        transition="all 0.3s"
      >
        <Box position="absolute" top={0} left={0} right={0} h="6px" bg="teal.500" borderTopRadius="24px" />

        <Flex align="center" mb={8} justify="space-between">
          <HStack spacing={4}>
            <Center 
              w={12} 
              h={12} 
              bg="teal.50" 
              borderRadius="16px" 
              flexShrink={0}
            >
              <Icon as={id ? FaEdit : FaBook} w={6} h={6} color="teal.500" />
            </Center>
            <Box>
              <Heading size="md" color="gray.800" fontWeight="700">
                {id ? "Editar Registo" : "Novo Lançamento"}
              </Heading>
              <Text color={secondaryTextColor} fontSize="sm">
                Formando: <Text as="span" fontWeight="bold" color="teal.600">{usuario?.nome}</Text>
              </Text>
            </Box>
          </HStack>
          
          <Badge display={{ base: "none", sm: "block" }} colorScheme="teal" variant="subtle" px={3} borderRadius="full">
            {usuario?.nome?.split(' ')[0]}
          </Badge>
        </Flex>

        <Divider mb={8} />

        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            
            <Stack direction={{ base: "column", md: "row" }} spacing={6}>
              <FormControl isRequired>
                <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                  <Icon as={FaTasks} mr={2} color="teal.500" />
                  Atividade Realizada
                </FormLabel>
                <Select
                  placeholder="Selecione a atividade"
                  value={actividadeId}
                  onChange={(e) => setActividadeId(e.target.value)}
                  focusBorderColor="teal.500"
                  borderRadius="xl"
                  bg={inputBg}
                  h="50px"
                >
                  {atividades.map((act) => (
                    <option value={act.id} key={act.id}>
                      {act.actividade}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                  <Icon as={FaCalendarAlt} mr={2} color="teal.500" />
                  Data do Registo
                </FormLabel>
                <Input
                  type="date"
                  value={dataActividade}
                  onChange={(e) => setDataActividade(e.target.value)}
                  focusBorderColor="teal.500"
                  borderRadius="xl"
                  bg={inputBg}
                  h="50px"
                />
              </FormControl>
            </Stack>

            <FormControl isRequired>
              <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
                Descrição Detalhada
              </FormLabel>
              <Textarea
                placeholder="Descreva aqui o que aprendeu ou realizou hoje..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                borderRadius="xl"
                rows={{ base: 6, md: 8 }}
                focusBorderColor="teal.500"
                bg={inputBg}
                lineHeight="tall"
                p={4}
              />
            </FormControl>

            <Box pt={4}>
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                w="full"
                h="56px"
                fontSize="md"
                isLoading={issubmitting}
                loadingText="A gravar..."
                leftIcon={id ? <FaSave /> : <FaPlus />}
                shadow="lg"
                borderRadius="full"
                _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
                transition="all 0.2s"
              >
                {id ? "Guardar Alterações" : "Finalizar Registo"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>

      <Text mt={8} textAlign="center" fontSize="xs" color="gray.400" fontWeight="medium">
        DIÁRIO DE BORDO &bull; {new Date().getFullYear()}
      </Text>
    </Container>
  );
}

export default Diario;