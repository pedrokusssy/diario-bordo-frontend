import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api, { getDiarios, getAllFormacao, getActividade, baseURL } from '../services/api';

const AppContext = createContext();

export function DiarioProvider({ children }) {
  const [diarios, setDiarios] = useState([]);
  const [formacoes, setFormacoes] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregamento centralizado
  const refreshAllData = useCallback(async () => {
  if (localStorage.getItem("isLogged") !== "true") return;
  
  try {
    setLoading(true);
    
    // Usamos Promise.allSettled ou tratamos erros individuais 
    // para que um 404 no perfil não quebre a lista de diários
    const [resDiarios, resFormacoes, resAtiv, resUser] = await Promise.all([
      getDiarios().catch(e => ({ data: [] })),
      getAllFormacao().catch(e => ({ data: [] })),
      getActividade().catch(e => ({ data: [] })),
      api.get("/auth/perfil").catch(e => {
          console.warn("Perfil não encontrado ou endpoint inexistente");
          return { data: null }; // Retorna null em vez de estourar o erro
      })
    ]);

    setDiarios(resDiarios.data);
    setFormacoes(resFormacoes.data);
    setAtividades(resAtiv.data);
    setUsuario(resUser.data);
    
  } catch (error) {
    console.error("Erro crítico na sincronização:", error);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // SSE: Ouve qualquer mudança no Backend
 // SSE: Ouve qualquer mudança no Backend
  useEffect(() => {
    // 1. Vai buscar o token
    const token = localStorage.getItem("token");
    
    // 2. Se não houver token (ex: utilizador não logado), nem tenta conectar
    if (!token) return;

    // 3. Passa o token na URL para passar pelo SecurityFilter do Spring
    const eventSource = new EventSource(`${baseURL}/api/updates/subscribe?token=${token}`);

    eventSource.addEventListener("db-change", (event) => {
      const changeType = event.data;
      console.log("Mudança detectada:", changeType);
      refreshAllData();
    });

    return () => eventSource.close();
  }, [refreshAllData]);

  return (
    <AppContext.Provider value={{ 
      diarios, formacoes, atividades, usuario, 
      loading, refreshAllData 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppGlobal = () => useContext(AppContext);