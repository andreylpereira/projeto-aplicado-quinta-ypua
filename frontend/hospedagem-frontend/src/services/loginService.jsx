import api from './api';  

const _URL = '/auth/login';

//services de acesso ao ponto de api referente a autenticação a aplicação.
export const loginService = async (form) => {
  try {
    const response = await api.post(`${_URL}`, form);
    
    const { acessToken } = response.data;

    if (acessToken) {
      return acessToken;  
    } else {
      throw new Error("Erro ao autenticar. Tente novamente."); 
    }
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.");
  }
};
