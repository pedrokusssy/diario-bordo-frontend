import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api, { getDiarios, getDiarioByFormandoId, getAllFormacao, getAllFormacaoByFormandoId, getActividade, baseURL } from '../services/api';

const AppContext = createContext();

export function DiarioProvider({ children }) {
  const [diarios, setDiarios] = useState([]);
  const [formacoes, setFormacoes] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FUNÇÕES GRANULARES (Para recarregar só o que é preciso) ---
  const refreshDiarios = useCallback(async () => {
    const pessoaId = localStorage.getItem("pessoaId");
    if (!pessoaId) return;
    try {
      const res = await getDiarioByFormandoId(pessoaId);
      setDiarios(res.data);
    } catch (e) {
      console.error("Erro ao recarregar diários:", e);
    }
  }, []);

  const refreshFormacoes = useCallback(async () => {
    const pessoaId = localStorage.getItem("pessoaId");
    if (!pessoaId) return;
    try {
      const res = await getAllFormacaoByFormandoId(pessoaId);
      setFormacoes(res.data);
    } catch (e) {
      console.error("Erro ao recarregar formações:", e);
    }
  }, []);

  // --- CARREGAMENTO INICIAL PESADO (Roda apenas quando a app abre) ---
  const refreshAllData = useCallback(async () => {
    if (localStorage.getItem("isLogged") !== "true") {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const pessoaId = localStorage.getItem("pessoaId");
      
      const [resDiarios, resFormacoes, resAtiv, resUser] = await Promise.all([
        getDiarioByFormandoId(pessoaId).catch(e => ({ data: [] })),
        getAllFormacaoByFormandoId(pessoaId).catch(e => ({ data: [] })),
        getActividade().catch(e => ({ data: [] })),
        api.get("/auth/perfil").catch(e => {
            console.warn("Perfil não encontrado");
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

  const loginSucesso = useCallback(() => {
    refreshAllData();
    // Aqui também terias de ter uma lógica para reiniciar o EventSource
  }, [refreshAllData]);

  // Arranca com tudo na primeira vez
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // --- SSE: OUVE MUDANÇAS NO BACKEND DE FORMA INTELIGENTE ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const pessoaId = localStorage.getItem("pessoaId");
    
    if (!token || !pessoaId) return;

    // Adicionado pessoaId na URL para o backend saber quem é esta aba aberta
    const eventSource = new EventSource(`${baseURL}/api/updates/subscribe?pessoaId=${pessoaId}&token=${token}`);

    eventSource.addEventListener("db-change", (event) => {
      const oQueMudou = event.data; // Espera receber "DIARIO" ou "FORMACAO"
      console.log("Notificação do Servidor. Tabela alterada:", oQueMudou);

      // Lógica Condicional: Poupa a Base de Dados
      if (oQueMudou === "DIARIO") {
        refreshDiarios();
      } else if (oQueMudou === "FORMACAO") {
        refreshFormacoes();
      } else {
        // Se a mensagem for outra ou vazia, pelo sim pelo não, atualiza tudo
        refreshAllData();
      }
    });

    return () => eventSource.close();
  }, [refreshAllData, refreshDiarios, refreshFormacoes]);

  return (
    <AppContext.Provider value={{ 
      diarios, formacoes, atividades, usuario, 
      loading, refreshAllData, refreshDiarios, refreshFormacoes
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppGlobal = () => useContext(AppContext);