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
  Spinner
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBook, FaCalendarAlt, FaTasks, FaSave, FaEdit } from "react-icons/fa";

// Importamos o Hook global que criamos
import { useAppGlobal } from "../contexts/DiarioContext"; 
import { createDiario, getDiarioById, updateDiario } from "../services/api";

function Diario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // 1. Pegamos os dados do contexto
  const { atividades, usuario, loading } = useAppGlobal();

  // 2. DEFINIÇÃO DAS CORES (O que estava a faltar e causou o erro!)
  const bg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // 3. States do formulário
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
          // Preenchemos os campos com o que veio da Base de Dados
          setActividadeId(dados.actividade.id);
          setDataActividade(dados.dataActividade);
          setDescricao(dados.descricao);
        })
        .catch(err => {
          console.error("Erro ao buscar diário:", err);
          toast({ title: "Erro", description: "Não foi possível carregar os dados.", status: "error" });
        })
        .finally(() => setBuscandoDados(false));
    } else {
      // Se não houver ID, limpamos os campos para um novo registro
      setActividadeId("");
      setDataActividade("");
      setDescricao("");
    }
  }, [id, toast]);

  

  // 4. PROTEÇÃO: Se estiver a carregar ou a buscar dados de edição, mostra o Spinner
  if (loading || buscandoDados) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
  }

  // 5. PROTEÇÃO ADICIONAL: Se não houver usuário, não tenta renderizar o resto
  if (!usuario) {
    return (
      <Center h="60vh">
        <Text>A carregar dados do utilizador...</Text>
      </Center>
    );
  }

  // A partir daqui, usuario.id e bg estão seguros para serem usados.
  // APENAS AQUI, após as verificações acima, é seguro acessar usuario.id
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!actividadeId || !dataActividade || !descricao) {
      // ... toast
      return;
    }

    // Agora é seguro usar usuario.id
    const dadosDoDiario = {
      formando_id: localStorage.getItem("pessoaId"), 
      actividade_id: actividadeId,
      dataActividade: dataActividade,
      descricao: descricao,
    };

    // ... try/catch

  // ... renderização do formulário

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
      console.error(error);
      toast({ title: "Erro", description: "Ocorreu um erro ao salvar.", status: "error" });
    }
  };

  // Se o contexto ainda estiver carregando ou buscando dados de edição
  if (loading || buscandoDados) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
  }

  if (loading) return <Flex justify="center" p={10}><Spinner size="xl" /></Flex>;
  if (!usuario) return <Text>A carregar dados do utilizador...</Text>;

  return (
    <Box maxW="800px" mx="auto" mt={{ base: 4, md: 10 }} p={{ base: 4, md: 0 }}>
      <Box
        bg={bg}
        p={{ base: 6, md: 10 }}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="xl"
      >
        <Flex align="center" mb={8}>
          <Icon as={FaBook} w={8} h={8} color="teal.500" mr={4} />
          <Box>
            <Heading size="lg" color="teal.600">
              {id ? "Editar Registro" : "Novo Diário"}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Formando: <Text as="span" fontWeight="bold" color="gray.700">{usuario?.nome}</Text>
            </Text>
          </Box>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="teal.700">
                  <Icon as={FaTasks} mr={2} />
                  Actividade
                </FormLabel>
                <Select
                  placeholder="Selecione uma atividade"
                  value={actividadeId}
                  onChange={(e) => setActividadeId(e.target.value)}
                  focusBorderColor="teal.400"
                >
                  {/* Renderizamos as atividades que já vieram do contexto global */}
                  {atividades.map((act) => (
                    <option value={act.id} key={act.id}>
                      {act.actividade}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="teal.700">
                  <Icon as={FaCalendarAlt} mr={2} />
                  Data
                </FormLabel>
                <Input
                  type="date"
                  value={dataActividade}
                  onChange={(e) => setDataActividade(e.target.value)}
                  focusBorderColor="teal.400"
                />
              </FormControl>
            </Stack>

            <FormControl isRequired>
              <FormLabel fontWeight="bold" color="teal.700">
                Descrição da Actividade
              </FormLabel>
              <Textarea
                placeholder="Descreva detalhadamente o que foi realizado..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                size="md"
                rows={6}
                focusBorderColor="teal.400"
              />
            </FormControl>

            <Flex justify={{ base: "stretch", md: "flex-end" }} pt={4}>
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                px={12}
                leftIcon={id ? <FaEdit /> : <FaSave />}
                w={{ base: "full", md: "auto" }}
                shadow="lg"
                _hover={{ transform: "translateY(-2px)", boxShadow: "2xl" }}
              >
                {id ? "Atualizar Registro" : "Salvar Diário"}
              </Button>
            </Flex>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}

export default Diario;