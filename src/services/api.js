import axios from "axios";

console.log("A minha URL da API é:", import.meta.env.VITE_API_URL);

export const baseURL = (import.meta.env.VITE_API_URL || "").trim();

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  }
});
// O Interceptor atua como um "porteiro de saída"
api.interceptors.request.use(async (config) => {
  // Pega o token que guardámos no passo 1
  const token = localStorage.getItem("token");
  
  if (token) {
    // Cola o token no cabeçalho antes de o pedido sair do React
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

//User Formando Data

export function getFormandoById(id) {
  return api.get(`/formando/${id}`);
}


// GET
export function getDiarios() {
  return api.get("/diario");
}

export function getDiarioById(id){
  return api.get(`/diario/${id}`);
}

export function getDiarioByFormandoId(id){
  return api.get(`/diario/f/${id}`);
}

// POST
export function createDiario(data) {
  return api.post("/diario", data);
}

// PUT
export function updateDiario(id, data) {
  return api.put(`/diario/${id}`, data);
}

// DELETE
export function deleteDiario(id) {
  return api.delete(`/diario/${id}`);
}

//##################### ACTIVIDADE ROUTES

export function getActividade(){
  return api.get("/actividade");
}

//###### Account ######

export function minhaConta(id){
  return api.get(`/formando/${id}`);
}


//####### Formacao #############3

export function getAllFormacao(){
  return api.get("/formacao");
}

export function getAllFormacaoByFormandoId(id){
  return api.get(`/formacao/${id}`);
}

console.log("Axios configurado para:", baseURL);
export default api;