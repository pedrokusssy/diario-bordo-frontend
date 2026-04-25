import {
  Box,
  Heading,
  Text,
  Badge,
  Flex,
  Icon,
  SimpleGrid,
  Button,
  useColorModeValue,
  Avatar,
  Tooltip,
  Divider,
  Center,
  Skeleton,
  VStack,
  HStack
} from "@chakra-ui/react";
import { FaCalendarAlt, FaInfoCircle, FaGraduationCap, FaChevronRight } from "react-icons/fa";
// 1. Removemos a API daqui e importamos o Contexto Global
import { useAppGlobal } from "../contexts/DiarioContext";

function FormacaoList() {
  // 2. Fomos buscar as formacoes e o estado de loading diretamente ao Contexto!
  // Fazemos "loading: isLoading" apenas para renomear a variável e não termos de mudar o teu HTML lá em baixo.
  const { formacoes, loading: isLoading } = useAppGlobal();

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const tutorBg = useColorModeValue("gray.50", "gray.800");

  // 3. Adeus useEffect e adeus chamadas à API! O Contexto já trata de tudo.

  // --- FUNÇÃO SALVA-VIDAS ---
  // Garante que o Avatar e o Text recebem sempre uma STRING (texto) e nunca um Objeto.
  const getTutorName = (tutor) => {
    if (!tutor) return "Não atribuído";
    if (typeof tutor === "string") return tutor;
    if (tutor.nome) return tutor.nome; // Se for o objeto {id, nome, telefone...} extrai o nome
    return "Não atribuído";
  };

  return (
    <Box p={{ base: 4, md: 8 }} maxW="1600px" mx="auto">
      
      {/* HEADER */}
      <Flex 
        direction={{ base: "column", sm: "row" }} 
        justify="space-between" 
        align={{ base: "start", sm: "center" }} 
        gap={4}
        mb={10}
      >
        <VStack align="start" spacing={0}>
          <HStack color="teal.600">
            <Icon as={FaGraduationCap} boxSize={6} />
            <Heading size="lg" letterSpacing="tight">Minhas Formações</Heading>
          </HStack>
          <Text color="gray.500" fontSize="sm">Acompanhe o progresso das suas especializações</Text>
        </VStack>

        <Button 
          colorScheme="teal" 
          size="lg" 
          boxShadow="md"
          w={{ base: "full", sm: "auto" }}
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
        >
          Solicitar Formação
        </Button>
      </Flex>

      {/* GRID COM SKELETON LOADING */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
        {isLoading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} h="300px" borderRadius="xl" />)
        ) : formacoes && formacoes.length > 0 ? (
          formacoes.map((f) => {
            
            // Extraímos o nome limpo e seguro antes de construir o Card
            const nomeTutor = getTutorName(f.tutor);

            return (
              <Box
                key={f.id}
                p={{ base: 5, md: 6 }}
                shadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="2xl"
                bg={cardBg}
                transition="all 0.3s"
                position="relative"
                overflow="hidden"
                _hover={{ shadow: "xl", borderColor: "teal.400", transform: "translateY(-4px)" }}
              >
                {/* Badge de Período Superior */}
                <Flex justify="space-between" align="center" mb={4}>
                  <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="lg" fontSize="xs">
                    <Icon as={FaCalendarAlt} mr={1} />
                    {new Date(f.periodo?.dataInicio).toLocaleDateString('pt-PT') || "Início"} — {new Date(f.periodo?.dataFim).toLocaleDateString('pt-PT') || "Fim"}
                  </Badge>
                  <Tooltip label={`Info do Registo`}>
                    <Box>
                      <Icon as={FaInfoCircle} color="gray.300" cursor="help" />
                    </Box>
                  </Tooltip>
                </Flex>

                {/* Título com Quebra de Segurança */}
                <Heading 
                  size="md" 
                  mb={3} 
                  lineHeight="shorter"
                  wordBreak="break-word" 
                  noOfLines={2}
                >
                  {f.titulo || "Formação em Curso"}
                </Heading>

                <Text 
                  fontSize="sm" 
                  color="gray.600" 
                  noOfLines={3} 
                  mb={6} 
                  wordBreak="break-word"
                  minH="60px"
                >
                  {f.localFormacao || "Sem descrição"}
                </Text>

                <Divider mb={5} />

                {/* RODAPÉ DO CARD: Tutor e Data */}
                <VStack align="stretch" spacing={4}>
                  <Flex 
                    align="center" 
                    gap={3} 
                    bg={tutorBg} 
                    p={3} 
                    borderRadius="xl"
                  >
                    {/* AVATAR SEGURO: Recebe sempre a string processada */}
                    <Avatar size="sm" name={nomeTutor} bg="teal.500" />
                    
                    <Box overflow="hidden">
                      <Text fontSize="10px" fontWeight="bold" color="gray.400" textTransform="uppercase">
                        Tutor Responsável
                      </Text>
                      
                      {/* TEXTO SEGURO: Renderiza sempre a string processada */}
                      <Text fontSize="sm" fontWeight="bold" isTruncated title={nomeTutor}>
                        {nomeTutor}
                      </Text>
                    </Box>
                  </Flex>

                  <Button 
                      variant="link" 
                      colorScheme="teal" 
                      size="sm" 
                      rightIcon={<FaChevronRight />}
                      justifyContent="flex-end"
                  >
                    Ver Detalhes
                  </Button>
                </VStack>
              </Box>
            );
          })
        ) : (
          // Mensagem caso não existam dados
          <Center gridColumn="1 / -1" py={20}>
            <VStack>
              <Icon as={FaGraduationCap} boxSize={12} color="gray.200" />
              <Text color="gray.500">Nenhuma formação encontrada.</Text>
            </VStack>
          </Center>
        )}
      </SimpleGrid>
    </Box>
  );
}

export default FormacaoList;