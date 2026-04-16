import {
  Box,
  Heading,
  Text,
  Stack,
  Badge,
  Flex,
  Icon,
  SimpleGrid,
  Button,
  useColorModeValue,
  Avatar,
  Tooltip,
  HStack,
  Divider,
  Center
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { getAllFormacao } from "../services/api";

function FormacaoList() {
  const [formacoes, setFormacoes] = useState([]);
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    getAllFormacao()
      .then((res) => setFormacoes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    // Ajustado o padding lateral para ser menor no mobile (base: 4) e maior no desktop (md: 8)
    <Box p={{ base: 4, md: 8 }}>
      
      {/* Cabeçalho responsivo: empilha no mobile e fica em linha no desktop */}
      <Flex 
        direction={{ base: "column", sm: "row" }} 
        justify="space-between" 
        align={{ base: "start", sm: "center" }} 
        gap={4}
        mb={6}
      >
        <Heading size="lg" color="teal.600">Minhas Formações</Heading>
        <Button colorScheme="teal" size="md" w={{ base: "full", sm: "auto" }}>
          Solicitar Formação
        </Button>
      </Flex>

      {/* Grid inteligente: 1 coluna no mobile, 2 em tablets, 3 em telas grandes */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
        {formacoes.map((f) => (
          <Box
            key={f.id}
            p={{ base: 4, md: 5 }} // Padding menor no mobile
            shadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl" // Bordas mais arredondadas ficam melhores no mobile
            bg={cardBg}
            transition="all 0.2s"
            _hover={{ shadow: "md", borderColor: "teal.400" }}
          >
            <Flex justify="space-between" align="start" mb={3}>
              <Badge colorScheme="purple" variant="subtle" px={2} borderRadius="full">
                {f.periodo?.dataInicio|| "Sem Período"} {f.periodo?.dataFim|| "Sem Período"}
              </Badge>
              <Tooltip label={`Criado em: ${new Date(f.createdAt).toLocaleDateString()}`}>
                <Box>
                   <Icon as={FaInfoCircle} color="gray.400" />
                </Box>
              </Tooltip>
            </Flex>

            <Heading size="md" mb={2} noOfLines={1} fontSize={{ base: "lg", md: "xl" }}>
              {f.titulo}
            </Heading>

            <Text 
              fontSize="sm" 
              color="gray.600" 
              noOfLines={3} 
              mb={4} 
              minH={{ base: "auto", md: "60px" }} // Remove altura fixa no mobile para economizar espaço
            >
              {f.descricao || "Nenhuma descrição fornecida."}
            </Text>

            <Divider mb={4} />

            <Stack spacing={4}>
              {/* Seção do Tutor */}
              <Flex align="center" gap={3}>
                <Avatar size="sm" name={f.tutor} />
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.400" lineHeight="1">
                    TUTOR
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">{f.tutor || "Não atribuído"}</Text>
                </Box>
              </Flex>

              {/* Seção de Data */}
              <Flex align="center" gap={3}>
                <Center w="32px" h="32px" bg="teal.50" borderRadius="full">
                  <Icon as={FaCalendarAlt} color="teal.500" />
                </Center>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.400" lineHeight="1">
                    ÚLTIMA ATUALIZAÇÃO
                  </Text>
                  <Text fontSize="sm">
                    {f.updatedAt ? new Date(f.updatedAt).toLocaleDateString() : "Nunca"}
                  </Text>
                </Box>
              </Flex>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default FormacaoList;