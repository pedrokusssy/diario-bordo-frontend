import {
  Box, FormControl, Textarea, Input, FormLabel, Stack, Button, useToast,
  Heading, Icon, Flex, useColorModeValue, Text, Center, Spinner,
  HStack, Avatar, SlideFade, Menu, MenuButton, MenuList, MenuItem 
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaChevronDown } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { pt } from "date-fns/locale";

import { useAppGlobal } from "../contexts/DiarioContext"; 
import { createDiario, getDiarioById, updateDiario } from "../services/api";

registerLocale("pt", pt);

function Diario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { atividades, usuario, loading } = useAppGlobal();

  // 1. TODOS OS HOOKS DE CORES NO TOPO (A CORREÇÃO ESTÁ AQUI)
  const bg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const inputBorder = useColorModeValue("gray.100", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const iconBg = useColorModeValue("teal.50", "teal.900");
  const headingColor = useColorModeValue("gray.800", "white");

  const [actividadeId, setActividadeId] = useState("");
  const [dataActividade, setDataActividade] = useState(new Date()); 
  const [descricao, setDescricao] = useState("");
  const [buscandoDados, setBuscandoDados] = useState(false);
  const [issubmitting, setIsSubmitting] = useState(false);

  const actividadeSelecionada = atividades.find(act => act.id === actividadeId);

  useEffect(() => {
    if (id) {
      setBuscandoDados(true);
      getDiarioById(id)
        .then(response => {
          const dados = response.data;
          setActividadeId(dados.actividade.id);
          if (dados.dataActividade) {
            setDataActividade(new Date(dados.dataActividade));
          }
          setDescricao(dados.descricao);
        })
        .catch(() => {
          toast({ title: "Erro de Sincronização", description: "Não conseguimos obter o registo.", status: "error" });
        })
        .finally(() => setBuscandoDados(false));
    }
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!actividadeId || !dataActividade || !descricao) {
      toast({ title: "Atenção", description: "Preencha os detalhes da atividade antes de guardar.", status: "warning", variant: "subtle" });
      setIsSubmitting(false);
      return;
    }

    const dataFormatadaParaAPI = dataActividade.toISOString().split('T')[0];

    const dadosDoDiario = {
      formando_id: localStorage.getItem("pessoaId"), 
      actividade_id: actividadeId,
      dataActividade: dataFormatadaParaAPI,
      descricao: descricao,
    };

    try {
      if (id) {
        await updateDiario(id, dadosDoDiario);
        toast({ title: "Guardado", status: "success", variant: "subtle" });
      } else {
        await createDiario(dadosDoDiario);
        toast({ title: "Registo Criado", status: "success", variant: "subtle" });
      }
      navigate("/diarios");
    } catch (error) {
      toast({ title: "Erro de Rede", description: "Tente novamente mais tarde.", status: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. O EARLY RETURN SÓ ACONTECE DEPOIS DE TODOS OS HOOKS ACIMA
  if (loading || buscandoDados) {
    return (
      <Center h="70vh">
        <Stack spacing={6} align="center">
          <Spinner size="xl" color="teal.500" thickness="3px" emptyColor="gray.100" speed="0.8s" />
          <Text color="gray.500" fontSize="sm" fontWeight="medium" letterSpacing="widest" textTransform="uppercase">
            A carregar...
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box w="100%" py={{ base: 6, md: 10 }} px={{ base: 4, md: 8 }}>
      
      <Button 
        leftIcon={<FaArrowLeft />} 
        variant="ghost" 
        mb={8} 
        colorScheme="gray" 
        color="gray.500"
        size="sm"
        borderRadius="full"
        onClick={() => navigate("/diarios")}
        _hover={{ bg: "gray.100", color: "gray.800" }}
        transition="all 0.2s ease"
      >
        Voltar à lista
      </Button>

      <SlideFade in={true} offsetY="20px">
        <Box
          w="100%"
          bg={bg}
          p={{ base: 6, md: 12 }}
          borderRadius="3xl"
          borderWidth="1px"
          borderColor={cardBorder}
          boxShadow="0 10px 40px -10px rgba(0,0,0,0.08)"
          position="relative"
        >
          <Flex align="center" mb={10} justify="space-between" wrap="wrap" gap={4}>
            <HStack spacing={5}>
              <Center w={12} h={12} bg={iconBg} borderRadius="full">
                <Icon as={MdModeEditOutline} w={6} h={6} color="teal.600" />
              </Center>
              <Box>
                <Heading size="lg" color={headingColor} fontWeight="normal" letterSpacing="tight">
                  {id ? "Editar Atividade" : "Nova Atividade"}
                </Heading>
              </Box>
            </HStack>

            <HStack bg={inputBg} px={3} py={1.5} borderRadius="full" borderWidth="1px" borderColor={inputBorder}>
              <Avatar size="2xs" name={usuario?.nome} bg="teal.600" color="white" />
              <Text fontSize="xs" fontWeight="bold" color="gray.600">
                {usuario?.nome?.split(' ')[0]}
              </Text>
            </HStack>
          </Flex>

          <form onSubmit={handleSubmit}>
            <Stack spacing={8}>
              
              <Stack direction={{ base: "column", md: "row" }} spacing={6}>
                
                <FormControl isRequired>
                  <FormLabel fontWeight="600" color="gray.600" fontSize="xs">
                    ACTIVIDADE
                  </FormLabel>
                  <Menu matchWidth>
                    <MenuButton
                      as={Button}
                      rightIcon={<FaChevronDown size={12} color="gray.400" />}
                      w="100%"
                      h="55px"
                      bg={inputBg}
                      border="1px solid"
                      borderColor={inputBorder}
                      borderRadius="xl"
                      fontWeight="medium"
                      textAlign="left"
                      px={4}
                      color={actividadeId ? "inherit" : "gray.500"}
                      _hover={{ borderColor: "gray.300" }}
                      _active={{ bg: inputBg }}
                      _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px #319795" }}
                    >
                      <Text noOfLines={1}>
                        {actividadeSelecionada ? actividadeSelecionada.actividade : "Selecione a actividade"}
                      </Text>
                    </MenuButton>
                    
                    <MenuList 
                      borderRadius="xl" 
                      boxShadow="lg" 
                      p={2} 
                      border="1px solid" 
                      borderColor="gray.100"
                      zIndex={10}
                    >
                      {atividades.map((act) => (
                        <MenuItem
                          key={act.id}
                          onClick={() => setActividadeId(act.id)}
                          borderRadius="md"
                          _hover={{ bg: "teal.50", color: "teal.700" }}
                          bg={actividadeId === act.id ? "teal.50" : "transparent"}
                          color={actividadeId === act.id ? "teal.700" : "inherit"}
                          fontWeight={actividadeId === act.id ? "bold" : "medium"}
                          py={2}
                        >
                          {act.actividade}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="600" color="gray.600" fontSize="xs">
                    DATA DA ACTIVIDADE
                  </FormLabel>
                  <Box sx={{
                    ".react-datepicker-wrapper": { width: "100%" },
                    ".react-datepicker": { fontFamily: "inherit", border: "1px solid", borderColor: "gray.200", borderRadius: "lg", shadow: "lg" },
                    ".react-datepicker__header": { bg: "white", borderBottom: "none" },
                    ".react-datepicker__day--selected": { bg: "teal.500", borderRadius: "full" },
                    ".react-datepicker__day:hover": { borderRadius: "full" },
                    ".react-datepicker__day--keyboard-selected": { bg: "teal.400", borderRadius: "full" },
                  }}>
                    <DatePicker
                      selected={dataActividade}
                      onChange={(date) => setDataActividade(date)}
                      locale="pt"
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                      customInput={
                        <Input
                          focusBorderColor="teal.500"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          borderRadius="xl"
                          h="55px"
                          fontWeight="medium"
                          _hover={{ borderColor: "gray.300" }}
                          cursor="pointer"
                        />
                      }
                    />
                  </Box>
                </FormControl>
              </Stack>

              <FormControl isRequired>
                <FormLabel fontWeight="600" color="gray.600" fontSize="xs" mb={3}>
                  DESCRIÇÃO DETALHADA
                </FormLabel>
                <Textarea
                  placeholder="Escreva os detalhes da sua atividade ..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  bg={inputBg}
                  border="1px solid"
                  borderColor={inputBorder}
                  borderRadius="xl"
                  rows={10}
                  focusBorderColor="teal.500"
                  _hover={{ borderColor: "gray.300" }}
                  p={5}
                  lineHeight="1.7"
                  resize="vertical"
                />
              </FormControl>

              <Box pt={4}>
                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  w={{ base: "full", md: "auto" }}
                  px={8}
                  h="50px"
                  float={{ md: "right" }}
                  fontSize="sm"
                  fontWeight="bold"
                  isLoading={issubmitting}
                  loadingText="A guardar..."
                  leftIcon={id ? <FaCheck /> : <MdModeEditOutline />}
                  borderRadius="full"
                  boxShadow="md"
                  _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s ease"
                >
                  {id ? "Atualizar" : "Guardar"}
                </Button>
                <Box clear="both" /> 
              </Box>
            </Stack>
          </form>
        </Box>
      </SlideFade>

    </Box>
  );
}

export default Diario;