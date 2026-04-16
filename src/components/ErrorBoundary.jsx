import React from 'react';
import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erros
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/'; // Ou window.location.reload()
  };

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback personalizada
      return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50">
          <Box p={8} bg="white" borderRadius="lg" shadow="lg" textAlign="center">
            <Heading color="red.500" mb={4}>Oops! Algo deu errado.</Heading>
            <Text color="gray.600" mb={6}>
              Ocorreu um erro inesperado ao carregar esta página.
            </Text>
            <Button colorScheme="teal" onClick={this.handleReload}>
              Voltar ao Início
            </Button>
          </Box>
        </Flex>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;