import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api, { getDiarios, getDiarioByFormandoId, getAllFormacao, getAllFormacaoByFormandoId, getActividade, baseURL } from '../services/api';

const AppContext = createContext();

export function DiarioProvider({ children }) {
  const [diarios, setDiarios] = useState([]);
  const [formacoes, setFormacoes] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregamento centralizado
const refreshAllData = useCallback(async () => {
    // CORREÇÃO AQUI: Se não estiver logado, tira o loading antes de sair!
    if (localStorage.getItem("isLogged") !== "true") {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const [resDiarios, resFormacoes, resAtiv, resUser] = await Promise.all([
        getDiarioByFormandoId(localStorage.getItem("pessoaId")).catch(e => ({ data: [] })),
        getAllFormacaoByFormandoId(localStorage.getItem("pessoaId")).catch(e => ({ data: [] })),
        getActividade().catch(e => ({ data: [] })),
        api.get("/auth/perfil").catch(e => {
            console.warn("Perfil não encontrado ou endpoint inexistente");
            return { data: null };
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