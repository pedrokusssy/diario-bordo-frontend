import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api, { getDiarioByFormandoId, getAllFormacaoByFormandoId, getActividade, baseURL } from '../services/api';

const AppContext = createContext();

export function DiarioProvider({ children }) {
  const [diarios, setDiarios] = useState([]);
  const [formacoes, setFormacoes] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Controle para forçar o SSE a reiniciar após o login
  const [sseKey, setSseKey] = useState(0);

  const refreshDiarios = useCallback(async () => {
    const pessoaId = localStorage.getItem("pessoaId");
    if (!pessoaId) return;
    try {
      const res = await getDiarioByFormandoId(pessoaId);
      setDiarios(res.data);
    } catch (e) { console.error("Erro ao recarregar diários:", e); }
  }, []);

  const refreshFormacoes = useCallback(async () => {
    const pessoaId = localStorage.getItem("pessoaId");
    if (!pessoaId) return;
    try {
      const res = await getAllFormacaoByFormandoId(pessoaId);
      setFormacoes(res.data);
    } catch (e) { console.error("Erro ao recarregar formações:", e); }
  }, []);

  const refreshAllData = useCallback(async () => {
    if (localStorage.getItem("isLogged") !== "true") {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const pessoaId = localStorage.getItem("pessoaId");
      const [resDiarios, resFormacoes, resAtiv, resUser] = await Promise.all([
        getDiarioByFormandoId(pessoaId).catch(() => ({ data: [] })),
        getAllFormacaoByFormandoId(pessoaId).catch(() => ({ data: [] })),
        getActividade().catch(() => ({ data: [] })),
        api.get("/auth/perfil").catch(() => ({ data: null }))
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

  // Chamado no componente de Login para "acordar" o contexto
  const loginSucesso = useCallback(() => {
    refreshAllData();
    setSseKey(prev => prev + 1); // Força o restart do useEffect do SSE
  }, [refreshAllData]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // --- SSE CORRIGIDO ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const pessoaId = localStorage.getItem("pessoaId");
    
    if (!token || !pessoaId) return;

    console.log("Tentando conectar ao SSE...");
    const eventSource = new EventSource(`${baseURL}/api/updates/subscribe?pessoaId=${pessoaId}&token=${token}`);

    eventSource.onopen = () => console.log("✅ Conexão SSE estabelecida com sucesso!");

    eventSource.addEventListener("db-change", (event) => {
      const oQueMudou = event.data;
      console.log("!!! SINAL RECEBIDO !!! Tabela:", oQueMudou);

      if (oQueMudou === "DIARIO") refreshDiarios();
      else if (oQueMudou === "FORMACAO") refreshFormacoes();
      else refreshAllData();
    });

    eventSource.onerror = (err) => {
      console.error("❌ Erro na conexão SSE. O Spring Security pode estar a bloquear:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [sseKey, refreshAllData, refreshDiarios, refreshFormacoes]); // sseKey garante que reinicia no login

  return (
    <AppContext.Provider value={{ 
      diarios, formacoes, atividades, usuario, 
      loading, refreshAllData, refreshDiarios, refreshFormacoes, loginSucesso 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppGlobal = () => useContext(AppContext);