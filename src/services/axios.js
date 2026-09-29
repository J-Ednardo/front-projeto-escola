import axios from "axios";

import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: 'http://localhost:3005',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
        toast.error('Muitas requisições. Aguarde um momento e tente novamente.');
    } else if (error.response && error.response.data && error.response.data.erro) {
      const { codigo, mensagem, detalhes } = error.response.data.erro;
      error.customError = { codigo, mensagem, detalhes };
    }
    return Promise.reject(error);
  }
);

export default api;