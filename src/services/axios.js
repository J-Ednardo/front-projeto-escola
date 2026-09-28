import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3005',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se a API retornou o nosso padrão de AppError/ZodError
    if (error.response && error.response.data && error.response.data.erro) {
      const { codigo, mensagem, detalhes } = error.response.data.erro;
      error.customError = { codigo, mensagem, detalhes };
    }
    return Promise.reject(error);
  }
);

export default api;