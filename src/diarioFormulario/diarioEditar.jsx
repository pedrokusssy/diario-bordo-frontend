import {
  Box,
  Select,
  FormControl,
  Textarea,
  Input,
  FormLabel,
  HStack,
  Button,
  useToast
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 

// Certifique-se de que todas essas 4 funções existam no seu arquivo api.js
import { getActividade, createDiario, getDiarioById, updateDiario } from "../services/api"; 

function Diario() {
  // 1. CAPTURA DO ID E HOOKS DE ROTEAMENTO/ALERTA
  const { id } = useParams(); 
  const navigate = useNavigate();
  const toast = useToast();

  // 2. STATES DO FORMULÁRIO
  const [actividades, setActividades] = useState([]); // <-- Faltava esse state para o Select
  const [actividadeId, setActividadeId] = useState("");
  const [dataActividade, setDataActividade] = useState("");
  const [descricao, setDescricao] = useState("");

  // 3. MONTAGEM: O useEffect roda quando a tela abre
  useEffect(() => {
    // A) Primeiro, carrega a lista de atividades para preencher o Select
    getActividade()
      .then(response => setActividades(response.data))
      .catch(err => console.error("Erro ao buscar atividades:", err));

    // B) Depois, verifica se existe um ID na URL (ou seja, se é uma Edição)
    if (id) {
      getDiarioById(id)
        .then(response => {
          const dados = response.data;
          setActividadeId(dados.actividade.id);
          setDataActividade(dados.dataActividade);
          setDescricao(dados.descricao);
        })
        .catch(err => {
          console.error("Erro ao carregar dados do diário:", err);
          toast({
            title: "Erro",
            description: "Não foi possível encontrar este diário.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  }, [id]); // O [id] garante que isso rode se a URL mudar

  // 4. FUNÇÃO DE SALVAR / ATUALIZAR
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!actividadeId || !dataActividade || !descricao) {
      toast({
        title: "Atenção!",
        description: "Por favor, preencha todos os campos.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const dadosDoDiario = {
      formando_id: "f2505c8f-401f-4bdb-b8fa-98c40748c2a5", // ID fixo que você definiu
      actividade_id: actividadeId,
      dataActividade: dataActividade,
      descricao: descricao,
    };

    try {
      // Se tem ID, significa que estamos EDITANDO
      if (id) {
        await updateDiario(id, dadosDoDiario);
        toast({
          title: "Sucesso!",
          description: "Diário atualizado com sucesso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } 
      // Se não tem ID, significa que estamos CRIANDO um novo
      else {
        await createDiario(dadosDoDiario);
        toast({
          title: "Sucesso!",
          description: "Diário criado com sucesso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      // Redireciona de volta para a lista após o sucesso
      navigate("/diarios");

    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o diário.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <FormControl display="flex" flexDir="column" gap="4">
        <form onSubmit={handleSubmit}>
          <HStack spacing="4">
            <Box w="100%">
              <FormLabel htmlFor="actividade">Actividade</FormLabel>
              <Select 
                id="actividade" 
                placeholder="Selecione uma atividade"
                value={actividadeId}
                onChange={(e) => setActividadeId(e.target.value)}
              >
                {actividades.map((actividade) => (
                  <option value={actividade.id} key={actividade.id}>
                    {actividade.actividade}
                  </option>
                ))}
              </Select>
            </Box>

            <Box w="100%">
              <FormLabel htmlFor="dataActividade">Data da Actividade</FormLabel>
              <Input 
                id="dataActividade" 
                type="date" 
                value={dataActividade}
                onChange={(e) => setDataActividade(e.target.value)}
              />
            </Box>
          </HStack>

          <HStack spacing="4">
            <Box w="100%">
              <FormLabel htmlFor="descricao">Descrição / Observação da actividade</FormLabel>
              <Textarea 
                id="descricao" 
                name="descricao" 
                size="sm" 
                placeholder="Descrição da atividade realizada" 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </Box>
          </HStack>

          <HStack justify="center">
            <Button
              w={240}
              p="6"
              type="submit"
              bg="teal.600"
              color="white"
              fontWeight="bold"
              fontSize="xl"
              mt="2"
              _hover={{ bg: "teal.800" }}
            >
              {/* O botão muda de nome inteligentemente */}
              {id ? "Atualizar" : "Salvar"}
            </Button>
          </HStack>
        </form>
      </FormControl>
    </>
  );
}

export default Diario;